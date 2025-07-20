import express from 'express';
import mongoose, { mongo } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import groupRoutes from './routes/group.js';
import userRoutes from './routes/users.js';
import expenseRoutes from './routes/expenses.js';


dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/group',groupRoutes);
app.use('/api/users',userRoutes);
app.use('/api/expense',expenseRoutes);


app.get('/',(req,res) => {
    res.send('Welcome to the Money Split App Backend');
});

mongoose.connect(process.env.MONGO_URI) 
.then(() => {
    console.log("Connected to MongoDB Successfully");;
    app.listen(5000,() =>{
        console.log("Server is running on port 5000");
    })
    
})
.catch((error) => {
    console.log(error);
    
})
