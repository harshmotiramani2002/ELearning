import trycatch from "../middlewear/trycatch.js";
import { Courses } from "../models/courses.js";
import { Lecture } from "../models/lecture.js";
import {rm} from 'fs';
import {promisify} from 'util'
import fs from 'fs'
import { User } from "../models/user.js";
export const createCourse = trycatch(async (req, res) => {
    // console.log("req.file:", req.file);
    // console.log("req.body:", req.body); 

    const { title, description, category, createdBy, duration, price } = req.body;
    const image = req.file;

    if (!image) {
        return res.status(400).json({ message: "Image file is required." });
    }

    await Courses.create({
        title,
        description,
        category,
        createdBy,
        image: image.path,
        duration,
        price,
    });

    res.status(201).json({
        message: "Course Created Successfully"
    });
});

export const addLectures = trycatch(async (req, res) => {
    // ❌ Bug 1: Use findById instead of findOne when searching by ID
    const course = await Courses.findById(req.params.id);

    if (!course) {
        // ❌ Bug 2: You used `req.status` instead of `res.status`
        return res.status(404).json({
            message: "No course with this id"
        });
    }

    const { title, description } = req.body;
    const file = req.file;

    // ✅ Optional: Validate file upload
    if (!file) {
        return res.status(400).json({
            message: "Video file is required."
        });
    }

    const lecture = await Lecture.create({
        title,
        description,
        video: file.path, // or file.filename if you saved it like that
        course: course._id,
    });

    res.status(200).json({
        message: "Lecture Created",
        lecture,
    });
});

export const deleteLecture = trycatch(async(req,res)=>{
     const lecture = await Lecture.findById(req.params.id);
    rm(lecture.video,()=>{
        console.log("video deleted");
    })
    await lecture.deleteOne();
    res.json({
        message:"Lecture deleted"
    })
})

const unlinkAsync = promisify(fs.unlink)

export const deletedCourse = trycatch(async(req,res)=>{
    const course = await Courses.findById(req.params.id);
    if(!course){
        res.status(404).json({
            message:"Course Not Found"
        })
    }
    const lectures = await Lecture.find({course:course._id})
    await Promise.all(
        lectures.map(async(lecture)=>{
            await unlinkAsync(lecture.video);
            console.log("video deleted from deleteCourse")
        })
    )
    rm(course.image,()=>{
        console.log("image deleted")
    })
    await Lecture.find({course:course._id}).deleteMany();
    await course.deleteOne();
    await User.updateMany({},{$pull: {subscription:req.params.id}})
    res.json({
        message:"Course Deleted"
    })
})

export const getAllStats = trycatch(async(req,res)=>{
    const totalCourse = (await Courses.find()).length;
    const totalLecture = (await Lecture.find()).length;
    const totalUser = (await User.find()).length;
    const stats={
        totalCourse,
        totalLecture,
        totalUser,
    };
    res.json({
        stats,
        // console.log("Status send");
    })
})