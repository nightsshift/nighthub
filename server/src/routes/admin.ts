import express, { Request, Response, NextFunction } from 'express';
   import jwt from 'jsonwebtoken';
   import bcrypt from 'bcrypt';
   import { Admin, Ban, Report } from '../models';
   import { Types } from 'mongoose';

   const router = express.Router();
   const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

   interface AuthenticatedRequest extends Request {
     user?: {
       _id: Types.ObjectId;
       isAdmin: boolean;
     };
   }

   const auth = (role: 'admin' | 'moderator') => async (
     req: AuthenticatedRequest,
     res: Response,
     next: NextFunction
   ) => {
     const token = req.headers.authorization?.split(' ')[1];
     if (!token) return res.status(401).json({ error: 'No token provided' });

     try {
       const decoded = jwt.verify(token, JWT_SECRET) as { id: string; isAdmin: boolean };
       const user = await Admin.findById(decoded.id);
       if (!user) return res.status(401).json({ error: 'Invalid token' });
       if (role === 'admin' && !user.isAdmin) return res.status(403).json({ error: 'Admin access required' });
       req.user = { _id: user._id, isAdmin: user.isAdmin };
       next();
     } catch (err) {
       res.status(401).json({ error: 'Invalid token' });
     }
   };

   router.post('/login', async (req: Request, res: Response) => {
     const { username, password } = req.body;
     const user = await Admin.findOne({ username });
     if (!user || !await bcrypt.compare(password, user.password)) {
       return res.status(401).json({ error: 'Invalid credentials' });
     }
     const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1d' });
     res.json({ token });
   });

   router.post('/moderator', auth('admin'), async (req: AuthenticatedRequest, res: Response) => {
     const { username, password } = req.body;
     const hashedPassword = await bcrypt.hash(password, 10);
     const moderator = new Admin({
       username,
       password: hashedPassword,
       isAdmin: false,
       createdBy: req.user!._id,
     });
     await moderator.save();
     res.status(201).json({ message: 'Moderator created' });
   });

   router.delete('/moderator/:id', auth('admin'), async (req: AuthenticatedRequest, res: Response) => {
     await Admin.findByIdAndDelete(req.params.id);
     res.json({ message: 'Moderator deleted' });
   });

   router.post('/ban', auth('moderator'), async (req: AuthenticatedRequest, res: Response) => {
     const { ip, duration, reason } = req.body;
     if (duration === Infinity && !req.user!.isAdmin) {
       return res.status(403).json({ error: 'Permanent bans require admin' });
     }
     const ban = new Ban({
       ip,
       duration,
       end: Date.now() + duration,
       reason,
       issuedBy: req.user!._id,
     });
     await ban.save();
     res.json({ message: 'User banned' });
   });

   router.delete('/ban/:ip', auth('moderator'), async (req: AuthenticatedRequest, res: Response) => {
     await Ban.deleteOne({ ip: req.params.ip });
     res.json({ message: 'User unbanned' });
   });

   router.get('/reports', auth('moderator'), async (req: AuthenticatedRequest, res: Response) => {
     const reports = await Report.find().populate('messages');
     res.json(reports);
   });

   router.patch('/report/:id', auth('moderator'), async (req: AuthenticatedRequest, res: Response) => {
     const { status } = req.body;
     if (status === 'resolved' && !req.user!.isAdmin) {
       return res.status(403).json({ error: 'Resolving reports requires admin' });
     }
     await Report.findByIdAndUpdate(req.params.id, { status });
     res.json({ message: 'Report updated' });
   });

   export default router;