import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import crypto from 'crypto';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://yourusername.github.io/nighthub', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster0.mongodb.net/nighthub?retryWrites=true&w=majority';

// MongoDB Schemas
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
}
interface IChat {
  pairId: string;
  userIds: string[];
}

// In-memory storage (replace with Redis for production)
const users = new Map<string, IUser>();
const chats = new Map<string, IChat>();
const bannedIps = new Map<string, IBan>();
const reports = new Map<string, IReport>();
const tagUsers = new Map<string, Set<string>>();
const blockedPairs = new Set<string>(); // Prevent rematch for 1h

let onlineUsers = 0;
let activeChats = 0;

const generateUserId = () => crypto.randomBytes(16).toString('hex');
const sanitizeInput = (input: string) => input.replace(/<[^>]*>/g, '');

const findMatch = (userId: string, tags: string[]) => {
  if (tags.length === 0) {
    for (const [otherUserId, user] of users) {
      if (otherUserId !== userId && !user.pairId) {
        return otherUserId;
      }
    }
  } else {
    for (const tag of tags) {
      const usersWithTag = tagUsers.get(tag) || new Set();
      for (const otherUserId of usersWithTag) {
        if (otherUserId !== userId && !users.get(otherUserId)!.pairId) {
          return otherUserId;
        }
      }
    }
  }
  return null;
};

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

io.on('connection', (socket) => {
  const userId = generateUserId();
  users.set(userId, { userId, socketId: socket.id, tags: [] });
  onlineUsers++;
  socket.userId = userId;

  socket.on('join', (tags: string[]) => {
    const ip = socket.handshake.address;
    if (bannedIps.has(ip)) {
      const ban = bannedIps.get(ip)!;
      if (ban.end > Date.now()) {
        socket.emit('error', `You are banned until ${new Date(ban.end).toISOString()}`);
        return;
      } else {
        bannedIps.delete(ip);
      }
    }

    const sanitizedTags = tags.map(sanitizeInput).filter((tag) => tag.length > 0);
    const user = users.get(userId)!;
    user.tags = sanitizedTags;
    for (const tag of sanitizedTags) {
      if (!tagUsers.has(tag)) tagUsers.set(tag, new Set());
      tagUsers.get(tag)!.add(userId);
    }

    const matchId = findMatch(userId, sanitizedTags);
    if (matchId) {
      const pairId = crypto.randomBytes(8).toString('hex');
      user.pairId = pairId;
      users.get(matchId)!.pairId = pairId;
      chats.set(pairId, { pairId, userIds: [userId, matchId] });
      activeChats++;
      socket.emit('paired');
      io.to(users.get(matchId)!.socketId).emit('paired');
    } else {
      socket.emit('rejoin');
    }
  });

  socket.on('message', (data: { text?: string; gifId?: string }) => {
    const user = users.get(userId);
    if (!user || !user.pairId) {
      socket.emit('error', 'Not in a chat');
      return;
    }
    // TODO: Encrypt message with libsodium
    const pair = chats.get(user.pairId)!;
    const otherUserId = pair.userIds.find((id) => id !== userId)!;
    io.to(users.get(otherUserId)!.socketId).emit('message', data);
  });

  socket.on('typing', (isTyping: boolean) => {
    const user = users.get(userId);
    if (user && user.pairId) {
      const pair = chats.get(user.pairId)!;
      const otherUserId = pair.userIds.find((id) => id !== userId)!;
      io.to(users.get(otherUserId)!.socketId).emit('typing', isTyping);
    }
  });

  socket.on('leave', () => {
    const user = users.get(userId);
    if (user && user.pairId) {
      const pairId = user.pairId;
      const pair = chats.get(pairId)!;
      const otherUserId = pair.userIds.find((id) => id !== userId)!;
      const otherUser = users.get(otherUserId)!;
      io.to(socket.id).emit('disconnected');
      io.to(users.get(otherUserId)!.socketId).emit('disconnected');
      chats.delete(pairId);
      activeChats--;
      user.pairId = undefined;
      otherUser.pairId = undefined;
      socket.emit('join', user.tags);
      io.to(users.get(otherUserId)!.socketId).emit('join', otherUser.tags);
    }
  });

  socket.on('report', ({ reason }: { reason: string }) => {
    const user = users.get(userId);
    if (user && user.pairId) {
      const pair = chats.get(user.pairId)!;
      const otherUserId = pair.userIds.find((id) => id !== userId)!;
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
      }, 60 * 60 * 1000); // 1h
      socket.emit('leave');
    }
  });

  socket.on('disconnect', () => {
    const user = users.get(userId);
    if (user) {
      for (const tag of user.tags) {
        tagUsers.get(tag)?.delete(userId);
      }
      if (user.pairId) {
        const pair = chats.get(user.pairId)!;
        const otherUserId = pair.userIds.find((id) => id !== userId)!;
        io.to(users.get(otherUserId)!.socketId).emit('disconnected');
        chats.delete(user.pairId);
        activeChats--;
        users.get(otherUserId)!.pairId = undefined;
        io.to(users.get(otherUserId)!.socketId).emit('join', users.get(otherUserId)!.tags);
      }
      users.delete(userId);
      onlineUsers--;
    }
  });
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
  server.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});