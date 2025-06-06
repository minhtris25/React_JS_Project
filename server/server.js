// server.js
import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './config/database.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controller/clerkWebhooks.js';

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Webhook
app.use('/api/clerk', clerkWebhooks);

// Test
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 👉 Export app để Vercel xử lý
export default app;
