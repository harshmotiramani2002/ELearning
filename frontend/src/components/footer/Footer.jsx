import React from 'react'
import "./footer.css"
import { AiFillFacebook } from "react-icons/ai";
import { AiFillTwitterSquare } from "react-icons/ai";
import { AiFillInstagram } from "react-icons/ai";
const Footer = () => {
  return (
    <footer>
        <div className="footer-content">
            <p>
                &copy; 2025 IIT_ACADEMY Platform. All rights reserved. <br />
             <p style={{ marginTop: "5px" }}>
  Made By ❤️ <a href="https://www.linkedin.com/in/harsh-motiramani-1877232a8/">Harsh Motiramani</a>
</p>

            </p>
            <div className="social-link">
                <a href="">
                    <AiFillFacebook/>
                </a>
                <a href=""><AiFillTwitterSquare/></a>
                <a href=""><AiFillInstagram/></a>
            </div>
        </div>
    </footer>
  )
}

export default Footer
