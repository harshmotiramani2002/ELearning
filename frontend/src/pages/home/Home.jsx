import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./home.css"
import Testimonials from '../../components/testimonial/Testimonials'
const Home = () => {
  const navigate = useNavigate()
  return (
    <div>
      <div className="home">
        <div className="home-content">
          <h1>
            Welcome to IIT_ACADEMY
            <p>Learn, Grow ,Excel</p>
            <button onClick={()=>navigate("/courses")} className='common-btn'>Get Started</button>
          </h1>
        </div>
        <Testimonials/>
      </div>
    </div>
  )
}

export default Home