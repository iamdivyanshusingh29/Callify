import { User } from "../models/user.model.js";

const authMiddlewareGET = async (req , res , next) => {
    const { token } = req.query;

    if (!token) {
        return res.status(401).json({message : "No token"});
    }

    const user = await User.findOne({ token });

    if (!user) {
        return res.status(401).json({ message: "Invaild token"});
    }

    if( user.tokenExpiry < new Date()) {
        user.token = null;
        user.tokenExpiry = null;
        await user.save();

        return res.status(401).json({ message: "Session expired"});
    }

    next();
}

const authMiddlewareADD = async (req, res ,next) => {
    const { token } = req.body;

    if(!token) {
        return res.status(401).json({ message : "No Token"});
    }

    const user = await User.findOne({ token });
    
    if(!user){
        return res.status(401).json({ message : "User doesn't exists"});
    }

    if ( user.tokenExpiry < new Date()) {
        user.token = null;
        user.tokenExpiry = null;
        await user.save();

        return res.status(401).json({ message : "session ended"});
    }

    next();
}

export { authMiddlewareGET , authMiddlewareADD } ;