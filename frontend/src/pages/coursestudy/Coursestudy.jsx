import React, { useEffect } from 'react'
import  "./Coursestudy.css"
import { useNavigate, useParams } from 'react-router-dom'
import { CourseData } from '../../context/CourseContext';
import { server } from '../../main';
import {Link} from "react-router-dom"
const Coursestudy = ({user}) => {
    const params=useParams();
    const {fetchCourse,course}=CourseData();
    const navigate=useNavigate();
     useEffect(()=>{
        fetchCourse(params.id);
    },[params.id])
    useEffect(() => {
    if (
      user &&
      user.role !== 'admin' &&
      !user.subscription.includes(params.id) // fixed typo
    ) {
      navigate('/');
    }
  }, [user, params.id, navigate]); 
  return (
    <>
    {course && <div className='course-study-page'>
        <img src={`${server}/${course.image}`} width={350} />
        <h2>{course.title}</h2>
        <h4>{course.description}</h4>
        <h5>by - {course.createdBy}</h5>
        <h5>Duration - {course.duration} week</h5>
        <Link to={`/lectures/${course._id}`} ><h2>Lectures</h2></Link>
    </div>}
    </>
  )
}

export default Coursestudy