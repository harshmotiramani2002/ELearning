import React from 'react'
import "./App.css"
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Header from "./components/header/Header"
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Verify from './pages/auth/Verify'
import Home from './pages/home/home'
import Footer from './components/footer/Footer'
import About from './pages/about/About'
import Account from './pages/account/Account'
import { UserData } from './context/UserContext'
import Loading from './components/loading/Loading'
import Courses from "./pages/courses/Courses.jsx"
import CourseCard from './components/courseCard/CourseCard.jsx'
import { CourseData } from './context/CourseContext.jsx'
import CourseDescription from './pages/coursedescription/CourseDescription.jsx'
import PaymentSucess from './pages/paymentsuccess/PaymentSucess.jsx'
import Coursestudy from './pages/coursestudy/Coursestudy.jsx'
import Lectures from './pages/lecture/Lectures.jsx'
const App = () => {
  const  {isAuth,user,loading} = UserData()
  const {courses} = CourseData()
  return (
   <>
   {loading ? <Loading/> : <BrowserRouter>
   <Header isAuth={isAuth}/>
   <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/about" element={<About/>}/>
    <Route path="/courses" element={<Courses/>}/>
    <Route path="/account" element={isAuth ? <Account user={user}/> : <Login/>}/>
    <Route path="/login" element={isAuth ? <Home/>:<Login/>} />
    <Route path="/register" element={isAuth ? <Home/>:<Register/>} />
    <Route path="/verify" element={isAuth ? <Home/>:<Verify/>} />
    <Route path="/course/:id" element={isAuth ? <CourseDescription user={user}/>:<Verify/>} />
    <Route path='/payment-success/:id' element={isAuth ?<PaymentSucess user={user} />: <Login/>} />
    <Route path='/:id/dashboard' element={isAuth ?<Dashboard user={user} />: <Login/>} />
    <Route path='/course/study/:id' element={isAuth ?<Coursestudy user={user} />: <Login/>} />
    <Route path='/lectures/:id' element={isAuth ?<Lectures user={user} />: <Login/>} />
   </Routes>
   <Footer/>
   </BrowserRouter>}
   </>
  )
}

export default App