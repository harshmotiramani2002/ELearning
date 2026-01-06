import React from 'react'
import "./Header.css"
import { Link } from 'react-router-dom'

const Header = ({isAuth,user}) => {
  return (
    <header>
 <div className="logo">
  <span className="g1">I</span>
  <span className="g2">I</span>
  <span className="g3">T</span>
  <span className="g4">_</span>
  <span className="g5">A</span>
  <span className="g6">C</span>
  <span className="g7">A</span>
  <span className="g8">D</span>
  <span className="g9">E</span>
  <span className="g10">M</span>
  <span className="g11">Y</span>
</div>




      <div className="link">
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/about">About</Link>
        {isAuth ? (<Link to="/account">Account</Link>)
        :
        <Link to="/login">Login</Link>
        }
      </div>
    </header>
  )
}

export default Header
