import express from 'express';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import { connectDb } from './database/dp.js';
import Razorpay from 'razorpay'
import cors from "cors"

dotenv.config();
const app = express();

export const instance = new Razorpay({
  key_id:process.env.Razorpay_Key,
  key_secret:process.env.Razorpay_Secret,
})
// using middlewear 
app.use(express.json())
app.use(cors());
app.use('/uploads', express.static("uploads"));

app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send("hiii");
});

// importing routes
import userRoutes from './routes/user.js'
import courseRoutes from './routes/course.js'
import adminRoutes from './routes/admin.js'
app.use('/uploads',express.static("uploads"))
//using routes
app.use('/api',userRoutes);
app.use('/api',courseRoutes);
app.use('/api',adminRoutes);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb()
});
