import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './config/database.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controller/clerkWebhooks.js';

// Kết nối DB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use('/api/clerk', clerkWebhooks);
app.get('/', (req, res) => {
  res.send("Hello từ Vercel!");
});

// ❌ KHÔNG dùng app.listen() trên Vercel
// ✅ Export app cho Vercel xử lý
export default app;
