import {User} from "../models/user.js";
import jwt from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
    try {
        const token=req.headers.token;
        if(!token){
          return  res.status(403).json({
            message:"Please login"
        })
        }
        const decodedData= jwt.verify(token,process.env.Jwt_Sec);
        req.user = await User.findById(decodedData._id);
        next();

    } catch (error) {
        res.status(500).json({
            message:"Login first"
        })
    }
};
export const isAdmin = (req,res,next)=>{
    try {
        if(req.user.role !== "admin"){
           return res.status(403).json({
                message:"You are not admin"
            })
        }
        next()
    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }
}
