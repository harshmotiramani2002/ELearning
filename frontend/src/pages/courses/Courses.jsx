import React from 'react';
import "./courses.css";
import { CourseData } from '../../context/CourseContext';
import CourseCard from '../../components/courseCard/CourseCard';

const Courses = () => {
    const {courses} = CourseData();
  return (
    <div className='c'>
        <h2>Available Courses</h2>
        <div className="courses">
        <div className="course-container">
            {
                courses && courses.length>0 ? courses.map((e)=>(
                    <CourseCard key={e.id} course={e} /> 
                )) : <p>No Courses Yet!</p>

            }
        </div>
        </div>
    </div>
  )
}

export default Courses