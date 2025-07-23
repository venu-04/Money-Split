import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    group:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group',
        default: null // Allowing expenses to be created without a group
        // required:true
    },
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    amount:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    paidBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    date:{
        type:Date,
        default: Date.now
    }
    
});

const Expense = mongoose.model("Expense",expenseSchema);
export default Expense;