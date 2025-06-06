import connectDB from '../config/database.js';
import clerkWebhooks from '../controller/clerkWebhooks.js';
import { buffer } from 'micro';

connectDB();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const buf = await buffer(req);
  req.rawBody = buf.toString();

  try {
    req.body = JSON.parse(req.rawBody);
  } catch (e) {
    return res.status(400).json({ success: false, message: 'Invalid JSON' });
  }

  await clerkWebhooks(req, res);
}
