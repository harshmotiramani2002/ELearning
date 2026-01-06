import { User } from "../models/user.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendMail from "../middlewear/sendmail.js";
import trycatch from "../middlewear/trycatch.js";
export const register = async (req,res)=>{
        try {
            const {email,name,password}=req.body;
            let user = await User.findOne({email});
            if(user){
                return res.status(400).json({
                    message:"User already exists",
                })
            }
            const hashPassword = await bcrypt.hash(password,10)
            user={
                name,
                email,
                password : hashPassword,
            }
            const otp = Math.floor(Math.random() * 1000000);
            const activationToken = jwt.sign({
                user,
                otp,
            },process.env.Activation_Secret,
        {
            expiresIn:"5m",
        })
        const data = {
            name,otp,
        };
        await sendMail(email,"IIT_Academy",data)
        res.status(200).json({
            message:"Otp end to your mail.....",
            activationToken,
        })
        } catch (error) {
            res.status(500).json({
                message: error.message,
            })
        }
}
export const verifyUser = trycatch(async(req,res)=>{
    const {otp,activationToken}=req.body;
    const verify=jwt.verify(activationToken,process.env.Activation_Secret);
    if(!verify){
        return res.status(400).json({
            message:"Otp Expired"
        })
    }
    if(verify.otp !==otp){
        return res.status(400).json({
            message:"Otp is wrong"
        })
    }
    await User.create({
        name:verify.user.name,
        email:verify.user.email,
        password:verify.user.password,
    })
    res.json({
        message:"User registered",
    })
})

export const loginUser = trycatch(async(req,res)=>{
    const {email,password}=req.body;
    const user = await User.findOne({email})
    if(!user){
        res.status(400).json({
            message:"No user with this email exists ",
        })
    }
    const matchpassword = await bcrypt.compare(password,user.password);
    if(!matchpassword){
        res.status(400).json({
            message:"Password wrong",
        })
    }
    const token = jwt.sign({
        _id:user._id,
    },process.env.Jwt_Sec,
    {
        expiresIn:"15d"
    })
    res.json({
        message:`welcome back ${user.name}`,
        token,
        user,
    })
})
export const myProfile = trycatch(async(req,res)=>{
    const user = await User.findById(req.user._id)
     res.json({
        user
    })
})

