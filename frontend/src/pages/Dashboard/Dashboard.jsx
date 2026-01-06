import React from 'react'
import  './Dashboard.css'
import { CourseData } from '../../context/CourseContext'
import CourseCard from '../../components/courseCard/CourseCard';
const Dashboard = ({user}) => {
    const {myCourse}=CourseData();
    console.log(myCourse)
  return (
    <div className="stu-dashboad">
      <h2>All Enlored Courses</h2>
      <div className="dashboard"> 
      {
        myCourse && myCourse.length > 0 ? myCourse.map((e)=>(
          <CourseCard key={e._id} course={e} />
        )) : <p>No Courses Enlored</p>
      }
      </div>
    </div>
  )
}

export default Dashboard