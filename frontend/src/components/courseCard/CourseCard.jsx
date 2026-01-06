import React from 'react'
import "./coursecard.css"

import { server } from '../../main'
import { UserData } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { CourseData } from '../../context/CourseContext'
const CourseCard = ({course}) => {
    const {isAuth,user} = UserData();
    const {fectchCourses}=CourseData()
    const Navigate = useNavigate();
    const deleteHandle = async function(id){
        // console.log(id)
        // console.log(`${server}/api/courses/${id}`)
        if(confirm("Are you sure you want to delete this Course")){
            try {
            const {data} = await axios.delete(`${server}/api/courses/${id}`,{
                headers:{
                    token:localStorage.getItem("token"),
                },

            });
            toast.success(data.message);
             fectchCourses();
        } catch (error) {
            toast.error(error.response.data.message)
        }
        }
    }
  return (
    <div className="course-card">
        <img src={`${server}/${course.image}`} className='course-image'  />
        <h3>{course.title}</h3>
        <p>Instructor - {course.createdBy}</p>
        <p>Duration - {course.duration} weeks</p>
        <p>Price - &#8377; {course.price}</p>
        {
            isAuth ? <> { user && user.role !=='admin' ? (<> 
            {user.subscription.includes(course._id) ?
                  <button onClick={()=>Navigate(`/course/study/${course._id}`)} className='common-btn'>Study</button> :
                  <button onClick={()=>Navigate(`/course/${course._id}`)} className='common-btn'>Get Strated</button>
            }
            </>) : ( <button onClick={()=>Navigate(`/course/study/${course._id}`)} className='common-btn'>Study</button> )  } </>:
            <button onClick={()=>Navigate('/login')} className='common-btn'>Get Strated</button>
            
        }
        <br />
        {
            user && user.role==="admin" && (
                <button onClick={()=>deleteHandle(course._id)} style={{background:"red"}} className='common-btn'>Delete</button>
            )
        }

    </div>
  )
}

export default CourseCard