import express from 'express';
import auth from '../middleware/auth.js';
import Group from '../models/Group.js';
import User from '../models/User.js';
import Expense from '../models/Expense.js';
// import mongoose from 'mongoose';

const router = express.Router();

router.post("/add-expense",auth,async(req,res) => {
    const {group=null,participants,amount,description} = req.body;
    console.log(req.body);
    
    const  userId=req.user._id;

    try {
        // const group = await Group.findById(groupId);
        //  if(!group) return res.status(404).json({message:'Group not found'});

        const expense = await Expense.create({
            group,
            participants,
            amount,
            description,
            paidBy: userId,
            date: new Date()
        });

        res.status(201).json({message:'Expense added successfully', expense});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Failed to add expense. Please try again later.'});
        
    }
});
// GET all expenses of a group
router.get("/:groupId/expenses", auth, async (req, res) => {
  const { groupId } = req.params;

  try {
    // Verify group exists
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Fetch expenses and populate user info
    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy", "name email")
      .populate("participants", "name email")
      .sort({ date: -1 }); // newest first

    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});


export default router;