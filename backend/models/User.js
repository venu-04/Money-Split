import mongoose from "mongoose"; 

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
});

const User = mongoose.model("User",userSchema);
export default User;

// export const User = mongoose.model('User', userSchema);