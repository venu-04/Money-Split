// import express from 'express';
// import Expense from '../models/Expense.js';
// import auth from '../middleware/auth.js';

// const router = express.Router();

// router.get('/balance',auth,async(req,res) => {
//     const userId = req.user._id;
//     const groupId = req.query.group || null;

//     try {
//         const expense = await Expense.find(groupId ? {group:groupId} : {})  //it return an array of expenses
//         .populate('paidBy','name email')
//         .populate('participants','name email');
//         console.log(expense);
        
        
//         //if groupId is provided, filter expenses by groupId, otherwise get all expenses
//         const balance ={};

//         for(const exp of expense){
//             const { participants, amount, paidBy } = exp;
//             console.log("Expense:", exp);
            
//             const share = amount / participants.length;

//             for(const participant of participants){
//                 if(participant.toString() !== paidBy.toString()){
//                     const key = `${participant.name} -> ${paidBy.name}`;
//                     balance[key] = (balance[key] || 0) + share;            //if key = A -> B then balance[A->B] will be the amount A owes B
//                                                                            // example: if A owes B 50, then balance[A->B] = 50
//                                                                            //balance object store as key-value pairs where key is the participant and paidBy, and value is the amount owed  
//                                                                            // balance object is store as this : "A -> B" = 50 
//                 }
//             }
//         }

//         const netBalance = {};
//         for(const [key,amount] of Object.entries(balance)){
//                 const [from,to] = key.split(" -> ");
//                 const reversKey = `${to} -> ${from}`;
//                 const netAmount = amount - (balance[reversKey] || 0);

//                 if(netAmount > 0){
//                     netBalance[`${from} -> ${to}`] = parseFloat(netAmount.toFixed(2)); // Round to two decimal places
//                 }
//         }
//         res.json({ netBalance });


//     } catch (error) {
//         console.error("Error fetching balance:", error);
//         res.status(500).json({ message: "Failed to fetch balance. Please try again later." });
        
//     }

// })



// export default router;

import express from "express";
import Expense from "../models/Expense.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/balance", auth, async (req, res) => {
  const userId = req.user._id.toString();
  const groupId = req.query.group || null;

  try {
    const expenses = await Expense.find(groupId ? { group: groupId } : {})
      .populate("paidBy", "name email")
      .populate("participants", "name email");

    const balance = {};

    // Step 1: Build raw balances
    for (const exp of expenses) {
      const { participants, amount, paidBy, isSettlement } = exp;

      if (isSettlement) {
        const from = paidBy;
        const to = participants.find(p => p._id.toString() !== from._id.toString());
        if (!to) continue;

        const key = `${from._id} -> ${to._id}`;
        balance[key] = (balance[key] || 0) + amount;
      } else {
        const share = amount / participants.length;
        for (const participant of participants) {
          if (participant._id.toString() === paidBy._id.toString()) continue;

          const key = `${participant._id} -> ${paidBy._id}`;
          balance[key] = (balance[key] || 0) + share;
        }
      }
    }

    // Step 2: Net balances
    const netBalances = {};
    for (const [key, amount] of Object.entries(balance)) {
      const [from, to] = key.split(" -> ");
      const reverseKey = `${to} -> ${from}`;
      const netAmount = amount - (balance[reverseKey] || 0);

      if (netAmount > 0) {
        netBalances[`${from} -> ${to}`] = parseFloat(netAmount.toFixed(2));
      }
    }

    // Step 3: Build user map for names
    const userMap = new Map();
    expenses.forEach(exp => {
      userMap.set(exp.paidBy._id.toString(), exp.paidBy);
      exp.participants.forEach(p => userMap.set(p._id.toString(), p));
    });

    // Step 4: Keep only balances where logged-in user is involved
    const balances = Object.entries(netBalances)
      .map(([key, amount]) => {
        const [from, to] = key.split(" -> ");
        return {
          fromId: from,
          fromName: userMap.get(from)?.name || from,
          toId: to,
          toName: userMap.get(to)?.name || to,
          amount
        };
      })
      .filter(b => b.fromId === userId || b.toId === userId);

    res.json({ balances });

  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({ message: "Failed to fetch balance. Please try again later." });
  }
});


// export default router;


// // POST /api/settle
// router.post("/settle", async (req, res) => {
//   try {
//     const { from, to, amount } = req.body;

//     if (!from || !to || !amount) {
//       return res.status(400).json({ msg: "Missing fields" });
//     }

//     // Save settlement as a transaction
//     const settlement = new Transaction({
//       type: "settlement",
//       from,
//       to,
//       amount,
//       createdAt: new Date()
//     });
//     await settlement.save();

//     // Update balances (netting logic)
//     // Example: if "from owes to" 500 and settles 300 → remaining 200
//     const key = `${from} -> ${to}`;
//     const reverseKey = `${to} -> ${from}`;

//     let balance = await Balance.findOne({ $or: [{ key }, { key: reverseKey }] });

//     if (balance) {
//       if (balance.key === key) {
//         balance.amount -= amount;
//       } else {
//         balance.amount += amount;
//       }
//       await balance.save();
//     }

//     res.json({ msg: "Settlement successful", settlement });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });




export default router;