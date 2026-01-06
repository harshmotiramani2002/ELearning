import { instance } from "../index.js";
import trycatch from "../middlewear/trycatch.js";
import { Courses } from "../models/courses.js";
import { Lecture } from "../models/lecture.js";
import { Payment } from "../models/Payment.js";
import { User } from "../models/user.js";
import crypto from "crypto"
export const getAllCourses= trycatch(async(req,res)=>{
    const courses= await Courses.find()
    res.json({
        courses,
    })
})

export const getSingleCourse = trycatch(async(req,res)=>{
    const course = await Courses.findById(req.params.id);
    res.json({
        course,
    })
})

export const fetchLectures = trycatch(async(req,res)=>{
    const lectures = await Lecture.find({course:req.params.id});
    const user = await User.findById(req.user._id);
    if(user.role=="admin"){
        return res.json({lectures});
    }
    if(!user.subscription.includes(req.params.id)){
        return res.status(400).json({
            message:"You have not subscribed to this course"
        })
    }
    res.json({lectures})
})

export const fetchLecture = trycatch(async(req,res) => {
         const lecture = await Lecture.findById(req.params.id);
    const user = await User.findById(req.user._id);
    if(user.role==="admin"){
        return res.json({lecture});
    }
    if(!user.subscription.includes(lecture.course)){
        return res.status(400).json({
            message:"You have not subscribed to this course"
        })
    }
    res.json({lecture})
})

export const getMyCourse = trycatch(async(req,res)=>{
    const courses = await Courses.find({_id:req.user.subscription});

    res.json({
        courses,
    })
})

export const checkout = trycatch(async (req, res) => {
 
  const user = await User.findById(req.user._id);
  

  const course = await Courses.findById(req.params.id);
 
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  if (user.subscription.includes(course._id)) {
    return res.status(400).json({ message: "You already have this course" });
  }

  const amountInPaise = Number(course.price * 100);

  let order;
  try {
    order = await instance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    res.status(201).json({
    order,
    course,
  });
  } catch (razorErr) {
   
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: razorErr.message,
    });
  }

  
});




export const paymentVerification = trycatch(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.Razorpay_Secret)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // ✅ Save payment
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    // ✅ Add course to user's subscription
    const user = await User.findById(req.user._id);
    const course = await Courses.findById(req.params.id);

    if (!user.subscription.includes(course._id)) {
      user.subscription.push(course._id);
      await user.save();
    }

    return res.status(200).json({
      message: "Course Purchased Successfully 🎉",
    });
  } else {
    return res.status(400).json({
      message: "Payment verification failed ❌",
    });
  }
});
