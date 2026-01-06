import { Children, createContext, useContext, useEffect, useState } from "react";
import axios from "axios"
const CourseContext = createContext()
import { server } from "../main";
export const CourseContextProvider = ({children})=>{
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState([])
    const [myCourse, setmyCourse] = useState([])
    async function fectchCourses() {
        try {
            const {data} = await axios.get(`${server}/api/course/all`);
            setCourses(data.courses);

        } catch (error) {
            console.log(error)
        }
    }

    async function fetchMyCourse() {
        try {
            
            const {data} = await axios.get(`${server}/api/mycourse`,{
                headers:{
                    token:localStorage.getItem("token"),
                },
            })

            setmyCourse(data.courses)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        fectchCourses();
        fetchMyCourse();
    },[])
    async function fetchCourse(id) {
        try {
            const {data} = await axios.get(`${server}/api/course/${id}`)
            setCourse(data.course)
        } catch (error) {
            console.log(error)
        }
    }
    // async function deleteCourse(course){
    //     try {
    //         const {data} = await axios.delete(`${server}/api/courses/${course._id}`,{
    //             headers:{
    //                 token:localStorage.getItem("token"),
    //             },
    //         });
           

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
        return <CourseContext.Provider value={{courses,fetchCourse,course,fectchCourses,fetchMyCourse,myCourse}}>{children}</CourseContext.Provider>
}

export const CourseData = ()=> useContext(CourseContext)