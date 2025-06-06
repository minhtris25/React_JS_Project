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


// app.use(express.json());

// Kiểm tra kết nối DB và đồng bộ bảng
// sequelize.authenticate()
//   .then(() => console.log('Connected to MySQL!'))
//   .catch(err => console.error('Unable to connect:', err));

// sequelize.sync({ alter: true })
//   .then(() => console.log('Database synced'));

// // Route test tạo user
// app.post('/users', async (req, res) => {
//   try {
//     const { username, email } = req.body;
//     const user = await User.create({ username, email });
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Route lấy danh sách user
// app.get('/users', async (req, res) => {
//   try {
//     const users = await User.findAll();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


app.get('/', (req, res) => { res.send('Hello 1World!'); })

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));