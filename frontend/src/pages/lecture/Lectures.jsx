import React, { useEffect, useState } from 'react'
import "./Lecture.css"
import { useNavigate, useParams } from 'react-router-dom'
import { server } from '../../main'
import axios from 'axios'
import Loading from '../../components/loading/Loading'
import toast from 'react-hot-toast'
import trycatch from '../../../../server/middlewear/trycatch'
const Lectures = ({user}) => {
    const [lectures, setLectures] = useState([])
    const [lecture, setLecture] = useState([])
     const [lecLoading, setLecLoading] = useState(false)
     const navigate=useNavigate();
     const [loading, setLoading] = useState(false)
     const [show, setshow] = useState(false)
     const [title, settitle] = useState("")
     const [description, setdescription] = useState("")
     const [video, setvideo] = useState("")
     const [videoPrev, setvideoPrev] = useState("")
     const [btnloading, setbtnloading] = useState(false)
     const params=useParams();
    if(user && user.role!=="admin" && !user.subscription.includes(params.id)) return navigate("/");
    async function fetchLectures() {
        setLoading(true)
        try {
            const {data} = await axios.get(`${server}/api/lectures/${params.id}`,{
                headers:{
                    token:localStorage.getItem("token"),
                }
            })
            setLectures(data.lectures)
            setLoading(false);
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }
    async function fetchLecture(id) {
        setLecLoading(true);
        try {
             const {data} = await axios.get(`${server}/api/lecture/${id}`,{
                headers:{
                    token:localStorage.getItem("token"),
                }
            })
            setLecture(data.lecture)
            setLecLoading(false);
        } catch (error) {
             setLecLoading(false);
             console.log(error)
        }
    }
    const changeVideoHandler = (e)=>{
        const file=e.target.files[0];
        const reader=new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = ()=>{
            setvideoPrev(reader.result);
            setvideo(file)
        }
    }
    const submitHandle = async(e)=>{
        setbtnloading(true);
        e.preventDefault();
        const myForm= new FormData();
        myForm.append("title",title)
        myForm.append("description",description)
        myForm.append("file",video)
        try {
            const {data}= await axios.post(`${server}/api/courses/${params.id}`,myForm,{
                headers:{
                    token:localStorage.getItem("token"),
                }
            })
            toast.success(data.message)
            setbtnloading(false)
            setshow(false)
            fetchLectures()
            settitle("");
            setdescription("")
            setvideo("")
        } catch (error) {
            toast.error(error.response.data.message);
            setbtnloading(false)
        }

    }

    const deleteHandler = async(id)=>{
        if(confirm("Are you sure you want to delete this lecture")){
            try {
                const {data} = await axios.delete(`${server}/api/lecture/${id}`,{
                    headers:{
                        token:localStorage.getItem("token"),
                    }
                })
                toast.success(data.message);
                fetchLectures()
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
    }

    useEffect(()=>{
        fetchLectures();
    },[])
  return (
    <>
    {
        loading ? <Loading/> : <>
        <div className="lecture-page">
            <div className="left">
                {lecLoading ? <Loading/> :
                    lecture.video ? <>
                    <video src={`${server}/${lecture.video}`} width={"100%"}
                     controls
                    controlsList='nodownload noremoteplayback'
                    disablePictureInPicture
                     autoPlay
                     ></video>
                    <h1>{lecture.title}</h1>
                    <h3>{lecture.description}</h3>
                    </>: <h1>Please Select a Lecture</h1>
                }
            </div>
            <div className="right">
                {user && user.role==="admin" && (<button onClick={()=>{
                    setshow(!show)
                }}> {show ? "Close" : "Add Lecture + "}</button> )}
                {show &&<div className='lecture-form'>
                    <form>
                        <h2>All Lecture</h2>
                        <label htmlFor="text">Title</label>
                        <input type="text" onChange={e=>{
                            settitle(e.target.value)
                        }} required />
                        <label htmlFor="text">Description</label>
                        <input type="text" onChange={e=>{
                            setdescription(e.target.value)
                        }} required />
                        <label htmlFor="file">File</label>
                        <input type="file" onChange={changeVideoHandler} placeholder='choose video' required />
                        <button type='submit' disabled={btnloading} onClick={submitHandle} className='common-btn'>
                            {btnloading ? "Please Wait ...." : "Add"}
                        </button>
                        {
                            videoPrev && <div className='v1'> <video  src={videoPrev} width={300} controls></video></div>
                        }
                    </form>
                    </div>}
                    {
                        lectures && lectures.length>0 ? lectures.map((e,i)=>(
                            <>
                            <div key={i} onClick={()=>{
                                fetchLecture(e._id)
                            }} className={`lecture-number ${lecture._id===e._id ? "active":""}`}>
                                {i+1}. {e.title}
                            </div>
                            {
                                user && user.role==="admin" && <button style={{backgroundColor:"red"}} onClick={()=>{
                        deleteHandler(e._id)
                                }} className='common-btn'>Delete {e.title}</button>
                            }
                            </>
                        )) : <p>No Lecture Yet!  </p>
                    }
            </div>
        </div>
        </>
    }
    </>
  )
}

export default Lectures