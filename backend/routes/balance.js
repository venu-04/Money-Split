import express from 'express';
import Expense from '../models/Expense.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/balance',auth,async(req,res) => {
    const userId = req.user._id;
    const groupId = req.query.group || null;

    try {
        const expense = await Expense.find(groupId ? {group:groupId} : {})  //it return an array of expenses
        .populate('paidBy','name email')
        .populate('participants','name email');
        console.log(expense);
        
        
        //if groupId is provided, filter expenses by groupId, otherwise get all expenses
        const balance ={};

        for(const exp of expense){
            const { participants, amount, paidBy } = exp;
            console.log("Expense:", exp);
            
            const share = amount / participants.length;

            for(const participant of participants){
                if(participant.toString() !== paidBy.toString()){
                    const key = `${participant.name} -> ${paidBy.name}`;
                    balance[key] = (balance[key] || 0) + share;            //if key = A -> B then balance[A->B] will be the amount A owes B
                                                                           // example: if A owes B 50, then balance[A->B] = 50
                                                                           //balance object store as key-value pairs where key is the participant and paidBy, and value is the amount owed  
                                                                           // balance object is store as this : "A -> B" = 50 
                }
            }
        }

        const netBalance = {};
        for(const [key,amount] of Object.entries(balance)){
                const [from,to] = key.split(" -> ");
                const reversKey = `${to} -> ${from}`;
                const netAmount = amount - (balance[reversKey] || 0);

                if(netAmount > 0){
                    netBalance[`${from} -> ${to}`] = parseFloat(netAmount.toFixed(2)); // Round to two decimal places
                }
        }
        res.json({ netBalance });


    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({ message: "Failed to fetch balance. Please try again later." });
        
    }

})



export default router;