import React, { useEffect, useState } from 'react'
import "./coursedesc.css"
import {  useNavigate, useParams } from 'react-router-dom'
import { CourseData } from '../../context/CourseContext'
import { server } from '../../main'
import axios from "axios"
import toast from 'react-hot-toast'
import { UserData } from '../../context/UserContext'
import Loading from '../../components/loading/Loading'
const CourseDescription = ({user}) => {
     const params = useParams()
     const Navigate = useNavigate();
     const {fetchUser} = UserData();
    const {fetchCourse,course,fetchMyCourse} = CourseData();
    useEffect(()=>{
        fetchCourse(params.id)
    },[])
    const [loading, setloading] = useState(false)
   async function checkoutHandler() {
  const token = localStorage.getItem("token");
  setloading(true);
  try {
    const { data: { order } } = await axios.post(
      `${server}/api/course/checkout/${params.id}`,
      {},
      {
        headers: {
          token,
        },
      }
    );

    const options = {
      key: "rzp_test_zn64fSwepd0ekz", // Razorpay test key
      amount: order.amount, // ✅ FIX: this should be `order.amount`
      currency: "INR",
      name: "IIT_ACADEMY",
      description: "Learn with us",
      image: `http://localhost:3000/uploads/svg.png`,
      order_id: order.id,
      handler: async function (response) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
        try {
          const { data } = await axios.post(
            `${server}/api/verification/${params.id}`,
            {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            },
            {
              headers: {
                token,
              },
            }
          );
          await fetchUser();
          await fetchCourse();
          await fetchMyCourse();
          toast.success(data.message);
          setloading(false);
          Navigate(`/payment-success/${razorpay_payment_id}`);
        } catch (error) {
          toast.error(error?.response?.data?.message || "Payment verification failed");
          setloading(false);
        }
      },
      theme: {
        color: "black",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    setloading(false); // ✅ Important: turn off loading if Razorpay doesn't open
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to create order");
    setloading(false); // ✅ turn off loading on error
  }
}

  return (
    <>
    {loading ? <Loading/> :
      (
        <> 
        {course && 
    <div className="course-description">
        <div className='border'> 
        <div className="course-header">
            
            <img src={`${server}/${course.image}`} alt="" className='course-image' />
            <div className='info'>
                <h2>{course.title}</h2>
                <p>Instructor - {course.createdBy} </p>
                <p>Duration - {course.duration} week </p>
            </div>
            
        </div>
         <p>Let's get started with course At &#8377; {course.price}  </p>

         <p>{course.description}</p>
            {
                user && user.subscription.includes(course._id) ?
                    <button onClick={()=> Navigate(`/course/study/${course._id}`)} className='common-btn btn'>Study</button>
                :
                  <button onClick={checkoutHandler} className='common-btn btn'>Buy Now</button>
            }
          
    </div>
    </div>
    }
        </>
      )
    }
    </>
  )
}

export default CourseDescription