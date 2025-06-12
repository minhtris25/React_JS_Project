import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './config/database.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controller/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import { stripeWebhooks } from './controller/stripeWebhooks.js';


connectDB();
connectCloudinary();

const app = express();
app.use(cors());


app.post('/api/stripe',express.raw({type:"application/json" }) stripeWebhooks)

// Middleware Clerk
app.use(express.json());
app.use(clerkMiddleware());

//APT to listen to Clerk webhooks
app.use('/api/clerk', clerkWebhooks);


app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)
app.get('/', (req, res) => res.send('API is working'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));