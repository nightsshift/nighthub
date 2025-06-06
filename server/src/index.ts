import express from 'express';
   import http from 'http';
   import { Server, Socket } from 'socket.io';
   import crypto from 'crypto';
   import mongoose from 'mongoose';
   import cors from 'cors';
   import sodium from 'libsodium-wrappers';
   import adminRoutes from './routes/admin';

   const app = express();
   const server = http.createServer(app);
   const io = new Server(server, {
     cors: {
       origin: ['http://localhost:3000', 'https://nightshift.github.io/nighthub'],
       methods: ['GET', 'POST'],
     },
   });

   app.use(cors());
   app.use(express.json());
   app.use('/admin', adminRoutes);

   const PORT = process.env.PORT || 3001;
   const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/nighthub?retryWrites=true&w=majority';

   interface IBan {
     ip: string;
     duration: number;
     end: number;
   }
   interface IReport {
     reporterId: string;
     reportedId: string;
     reason: string;
     timestamp: Date;
   }
   interface IUser {
     userId: string;
     socketId: string;
     tags: string[];
     pairId?: string;
     publicKey?: string;
     messageCount: number;
     lastMessageTime: number;
     safeMode: boolean;
   }
   interface IChat {
     pairId: string;
     userIds: string[];
     messages: { text?: string; gifId?: string; timestamp: number }[];
   }

   const users = new Map<string, IUser>();
   const chats = new Map<string, IChat>();
   const bannedIps = new Map<string, IBan>();
   const reports = new Map<string, IReport>();
   const tagUsers = new Map<string, Set<string>>();
   const blockedPairs = new Set<string>();
   let onlineUsers = 0;
   let activeChats = 0;

   const nsfwWords = ['explicit', 'nsfw', 'adult', 'offensive'];

   const generateUserId = () => crypto.randomBytes(16).toString('hex');
   const sanitizeInput = (input: string) => input.replace(/<[^>]*>/g, '');

   const checkNSFW = (message: string, safeMode: boolean) => {
     if (!safeMode) return false;
     return nsfwWords.some((word) => message.toLowerCase().includes(word));
   };

   const findMatch = (userId: string, tags: string[]) => {
     const candidates: string[] = [];
     if (tags.length === 0) {
       for (const [otherUserId, user] of users) {
         if (
           otherUserId !== userId &&
           !user.pairId &&
           !blockedPairs.has(`${userId}:${otherUserId}`) &&
           !blockedPairs.has(`${otherUserId}:${userId}`)
         ) {
           candidates.push(otherUserId);
         }
       }
     } else {
       for (const tag of tags) {
         const usersWithTag = tagUsers.get(tag) || new Set();
         for (const otherUserId of usersWithTag) {
           if (
             otherUserId !== userId &&
             !users.get(otherUserId)!.pairId &&
             !blockedPairs.has(`${userId}:${otherUserId}`) &&
             !blockedPairs.has(`${otherUserId}:${userId}`)
           ) {
             candidates.push(otherUserId);
           }
         }
       }
     }
     return candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : null;
   };

   app.get('/health', (req, res) => {
     res.status(200).send('OK');
   });

   (async () => {
     await sodium.ready;

     io.on('connection', (socket: Socket) => {
       const userId = generateUserId();
       const keyPair = sodium.crypto_box_keypair();
       users.set(userId, {
         userId,
         socketId: socket.id,
         tags: [],
         publicKey: sodium.to_hex(keyPair.publicKey),
         messageCount: 0,
         lastMessageTime: Date.now(),
         safeMode: true,
       });
       onlineUsers++;
       (socket as any).userId = userId;

       socket.on('join', (tags: string[]) => {
         const ip = socket.handshake.address;
         const ban = bannedIps.get(ip);
         if (ban && ban.end > Date.now()) {
           socket.emit('error', `You are banned until ${new Date(ban.end).toISOString()}`);
           return;
         } else if (ban) {
           bannedIps.delete(ip);
         }

         const sanitizedTags = tags.map(sanitizeInput).filter((tag) => tag.length > 0);
         const user = users.get(userId);
         if (!user) return;

         user.tags = sanitizedTags;
         for (const tag of sanitizedTags) {
           if (!tagUsers.has(tag)) tagUsers.set(tag, new Set());
           tagUsers.get(tag)!.add(userId);
         }

         const matchId = findMatch(userId, sanitizedTags);
         if (matchId) {
           const pairId = crypto.randomBytes(8).toString('hex');
           user.pairId = pairId;
           const matchedUser = users.get(matchId);
           if (matchedUser) {
             matchedUser.pairId = pairId;
             chats.set(pairId, { pairId, userIds: [userId, matchId], messages: [] });
             activeChats++;
             socket.emit('paired', { partnerPublicKey: matchedUser.publicKey });
             io.to(matchedUser.socketId).emit('paired', { partnerPublicKey: user.publicKey });
           }
         } else {
           socket.emit('rejoin');
         }
       });

       socket.on('message', async (data: { text?: string; gifId?: string }) => {
         const user = users.get(userId);
         if (!user || !user.pairId) {
           socket.emit('error', 'Not in a chat');
           return;
         }

         const now = Date.now();
         if (now - user.lastMessageTime >= 60_000) {
           user.messageCount = 0;
           user.lastMessageTime = now;
         }
         if (user.messageCount >= 10) {
           socket.emit('error', 'Rate limit: Max 10 messages per minute');
           return;
         }

         if (data.text && checkNSFW(data.text, user.safeMode)) {
           socket.emit('error', 'Message blocked by Safe Mode');
           return;
         }

         const pair = chats.get(user.pairId);
         if (!pair) return;

         const otherUserId = pair.userIds.find((id) => id !== userId);
         if (!otherUserId) return;

         const otherUser = users.get(otherUserId);
         if (!otherUser) return;

         let encryptedText: string | undefined;
         if (data.text) {
           const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
           const combinedKey = sodium.crypto_box_beforenm(
             sodium.from_hex(otherUser.publicKey!),
             keyPair.privateKey
           );
           encryptedText = sodium.to_hex(
             sodium.crypto_box_easy_afternm(data.text, nonce, combinedKey)
           );
         }

         pair.messages.push({ ...data, timestamp: Date.now() });
         io.to(otherUser.socketId).emit('message', { text: encryptedText, gifId: data.gifId });
         user.messageCount++;
       });

       socket.on('typing', (isTyping: boolean) => {
         const user = users.get(userId);
         if (!user || !user.pairId) return;

         const pair = chats.get(user.pairId);
         if (!pair) return;

         const otherUserId = pair.userIds.find((id) => id !== userId);
         if (!otherUserId) return;

         const otherUser = users.get(otherUserId);
         if (!otherUser) return;

         io.to(otherUser.socketId).emit('typing', isTyping);
       });

       socket.on('leave', () => {
         const user = users.get(userId);
         if (!user || !user.pairId) return;

         const pairId = user.pairId;
         const pair = chats.get(pairId);
         if (!pair) return;

         const otherUserId = pair.userIds.find((id) => id !== userId);
         if (!otherUserId) return;

         const otherUser = users.get(otherUserId);
         if (!otherUser) return;

         io.to(socket.id).emit('disconnected');
         io.to(otherUser.socketId).emit('disconnected');
         chats.delete(pairId);
         activeChats--;
         user.pairId = undefined;
         otherUser.pairId = undefined;
         socket.emit('join', user.tags);
         io.to(otherUser.socketId).emit('join', otherUser.tags);
       });

       socket.on('report', ({ reason }: { reason: string }) => {
         const user = users.get(userId);
         if (!user || !user.pairId) return;

         const pair = chats.get(user.pairId);
         if (!pair) return;

         const otherUserId = pair.userIds.find((id) => id !== userId);
         if (!otherUserId) return;

         const reportId = crypto.randomBytes(8).toString('hex');
         reports.set(reportId, {
           reporterId: userId,
           reportedId: otherUserId,
           reason: sanitizeInput(reason),
           timestamp: new Date(),
         });
         blockedPairs.add(`${userId}:${otherUserId}`);
         setTimeout(() => {
           blockedPairs.delete(`${userId}:${otherUserId}`);
         }, 60 * 60 * 1000);
         socket.emit('leave');
       });

       socket.on('disconnect', () => {
         const user = users.get(userId);
         if (!user) return;

         for (const tag of user.tags) {
           tagUsers.get(tag)?.delete(userId);
         }
         if (user.pairId) {
           const pair = chats.get(user.pairId);
           if (pair) {
             const otherUserId = pair.userIds.find((id) => id !== userId);
             if (otherUserId) {
               const otherUser = users.get(otherUserId);
               if (otherUser) {
                 io.to(otherUser.socketId).emit('disconnected');
                 otherUser.pairId = undefined;
                 io.to(otherUser.socketId).emit('join', otherUser.tags);
               }
               chats.delete(user.pairId);
               activeChats--;
             }
           }
         }
         users.delete(userId);
         onlineUsers--;
       });
     });

     mongoose.connect(MONGODB_URI).then(() => {
       console.log('Connected to MongoDB');
       server.listen(PORT, () => {
         console.log(`Server running on http://0.0.0.0:${PORT}`);
       });
     }).catch((err) => {
       console.error('MongoDB connection error:', err);
     });
   })();