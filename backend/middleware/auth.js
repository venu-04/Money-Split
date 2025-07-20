import jwt from 'jsonwebtoken';

const authMiddleware = (req,res,next) => {
    const token = req.header('Authorization');
    if(!token) return res.status(401).json({message:'Access denied. No token Provided'});
    try {
        const decoded =jwt.verify(token,process.env.JWT_SECRET);
        // console.log(decoded);
        
        req.user = { _id: decoded.id }
        next();
    }
    catch(err){
        res.status(400).json({message:'Invalid token'});
    }
};
export default authMiddleware;