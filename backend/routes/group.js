import express from 'express';
import auth from '../middleware/auth.js';
import Group from '../models/Group.js';
import User from '../models/User.js';


const router = express.Router();

router.post('/create',auth,async(req,res) => {
    const {name,members} = req.body;
    const userId = req.user._id; //req.user was previously added by your authentication middleware (auth).

    try{
        
        const group = await Group.create({
            name,
            createdBy:userId,
            members:[...members, userId]

        });
        res.status(201).json(group);
    }catch(err){
        console.error((err));
        res.status(500).json({message:'Failed to create group. Please try again later.'});
        
    }
});

router.get('/my-groups',auth,async(req,res) => {
    try {
        const groups = await Group.find({members: req.user._id});
        const user = await User.findById(req.user._id).select('name email');
        res.json({ groups, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Failed to fetch groups. Please try again later.'});
        
    }
});
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'name email');
    const rawGroup = await Group.findById(req.params.id);
    console.log('Raw group members:', rawGroup.members); // Should include ObjectIds


    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }
    console.log("Logged-in user ID:", req.user._id);
    // console.log("Group members:", group.members);


    // Check if the logged-in user is part of the group
    if (!group.members.some((m) => m._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'You are not a member of this group.' });
    }

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch group. Please try again later.' });
  }
});


export default router;