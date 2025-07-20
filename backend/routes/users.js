import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import sendInviteEmail from '../utils/email.js';


const router=express.Router();

router.post('/add-friend',auth,async(req,res) => {
    const {email} =req.body;
    console.log(req.user);
    
    const userId = req.user._id;
    console.log("User ID:", userId);

    try {
        const friend = await User.findOne({email});
        if(friend){
            if(friend._id.toString() == userId){
                return res.status(400).json({meassage:"You cant add yourself"})
            }
            const user=await User.findById(userId);

            if(user.friends.includes(friend._id)){
                return res.status(400).json({message:"This user is already your friend"});
            }
            user.friends.push(friend._id);
            await user.save();

            return res.json({message:"Friend added successfully",friend:{name:friend.name,email:friend.email}});
        }
        const inviter = await User.findById(userId);
        const inviteLink = `http://localhost:5173/register?email=${encodeURIComponent(email)}&invitedBy=${encodeURIComponent(inviter.name)}`;
        try {
              await sendInviteEmail(email, inviter.name, inviteLink);
            } catch (err) {
              console.error("Failed to send invite email:", err);  // ⬅️ This will help!
              return res.status(500).json({ message: "Error sending invitation email." });
         }


        return res.status(200).json({message:"Invitation sent to email."});
    } catch (error) {
        res.status(500).json({message:"Failed to add friend. Please try again later."});
    }
});

router.get('/friends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'name email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.friends);
  } catch {
    res.status(500).json({ message: 'Failed to load friends' });
  }
});
// GET /api/users/all → get all users except the logged-in user
// router.get('/all',auth,async(req,res) => {
//     try{
//         const users = await User.find(
//             {_id:{$ne:req.user.id} },   // exclude self  
//             // $ne: This is a MongoDB operator that means “Not Equal”.
//             '_id name email'  // only return _id, name, and email fields
//         );
//         res.json(users);
//     }catch(err){
//         console.error(err);
//         res.status(500).json({message:'Failed to fetch users. Please try again later.'});
        
//     }
// });

export default router;