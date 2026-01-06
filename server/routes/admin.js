import express from 'express'
import { isAdmin, isAuth } from '../middlewear/isAuth.js';
import { addLectures, createCourse, deletedCourse, deleteLecture, getAllStats } from '../controllers/admin.js';
import { uploadFiles } from '../middlewear/multer.js';
import { deleteModel } from 'mongoose';
const router= express.Router();
router.post('/courses/new',isAuth,isAdmin,uploadFiles,createCourse);
router.post('/courses/:id',isAuth,isAdmin,uploadFiles,addLectures);
router.delete('/lecture/:id',isAuth,isAdmin,deleteLecture);
router.delete('/courses/:id',isAuth,isAdmin,deletedCourse)
router.get('/stats/all',isAuth,isAdmin,getAllStats);
export default router;