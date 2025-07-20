import express from 'express';
import  User  from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const router = express.Router();

router.post('/register',async (req,res) => {
    //  console.log(req.body);
    // console.log(req.body.email);
    
    const {name,email,password,confirmpassword} = req.body;
    // console.log(email);
    //  console.log(confirmpassword);
    
    if(!name || !email || !password || !confirmpassword){
        return res.status(400).json({message:"Please fill all the fields"});
    }
    try{
        const existinguser = await User.findOne({email});
        if(existinguser){
            return res.status(400).json({message:"user already exists"});
            
        }
        if(password !== confirmpassword){
            return res.status(400).json({message:"passwords do not match"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        //  console.log(hashedPassword);
        
        const newuser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // const newuser = new User({ name, email, password });
        // await newuser.save();

        // console.log(newuser);
    
         const token = jwt.sign({id:newuser._id},process.env.JWT_SECRET,
        //    { expiresIn:"1h"  } // Token will expire in 1 hour
         );
         
        
        res.json({token,user:{name:newuser.name,email:newuser.email}});

    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong, please try again later"});
        
    }
}) ;

router.post('/login',async( req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"Please fill all the fields"});
    };
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,);
        res.json({token,user:{
            name:user.name,
            email:user.email
        }});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"something went wrong, please try again later"});
    }
});

export default router;
