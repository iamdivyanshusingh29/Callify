import httpStatus from 'http-status';
import bcrypt, { hash , compare } from 'bcryptjs';
import { User } from "../models/user.model.js";
import crypto from "crypto";
import { Meeting } from '../models/meeting.model.js';

const signin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: `Please give details` });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(httpStatus.NOT_FOUND).json({ message: `User Not Found` });
        }

        let match = await bcrypt.compare(password, existingUser.password); 

        if(match) {
            const token = crypto.randomBytes(10).toString("hex");
            existingUser.token = token;
            existingUser.tokenExpiry = new Date(Date.now() + 12*60*60*1000);
            await existingUser.save();
            return res.status(httpStatus.OK).json({ message: `User Signed In Successfully`, token: token });
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: `Password is incorrect`});
        }
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
}


const signup = async (req, res) => {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: `Please give details` });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.CONFLICT).json({ message: `User already register` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword,
        });

        await newUser.save();
        return res.status(httpStatus.CREATED).json({ message: `User Sign Up success fully` });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message});
    }
}

const getUserHistory = async (req, res) => {
    const { token }  =  req.query;

    try {
        const user = await User.findOne({ token: token });
        const meetings = await Meeting.find({ userId : user.username });
        res.json(meetings);
    } catch (e) {
        console.log(`Some Thing Went Wrong ${e}`);
    }
}

const addHistory = async (req, res) => {
    const { token , meetingCode } = req.body;

    try {
        const user = await User.findOne({ token: token });
        const meeting = new Meeting({
            userId: user.username,
            meetingCode: meetingCode,
        });

        await meeting.save();
        res.status(httpStatus.CREATED).json({message : `Meeting is Added`});
    } catch (e) {
        console.log(`Some Thing Went Wrong ${e}`);
    }
}
 
export { signup, signin, addHistory, getUserHistory };