import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './config/database.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controller/clerkWebhooks.js';

connectDB();

const app = express();
app.use(cors());

// Middleware Clerk
app.use(express.json());
app.use(clerkMiddleware());

//APT to listen to Clerk webhooks
app.use('/api/clerk', clerkWebhooks);



app.get('/', (req, res) => { res.send('Hello World!'); })

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));