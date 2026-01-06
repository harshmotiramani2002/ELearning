import React from 'react'
import "./account.css"
import { MdSpaceDashboard } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import toast from 'react-hot-toast';
import { UserData } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
const Account = ({user}) => {
    const Navigate = useNavigate();
    const {setUser,setisAuth} = UserData();
    const logoutHanler = ()=>{
        localStorage.clear(),
        setUser([]),
        setisAuth(false),
        toast.success("Logged Out");
        Navigate("/login")
    }
  return (
    <div>
        {user && <div className="profile">
        <div className="bor">
        <h2>My Profile</h2>
        <div className="profile-info">
            <p>
                <strong>Name - {user.name}</strong>
            </p>
             <p>
                <strong>Email - {user.email}</strong>
            </p>
            <button onClick={()=>Navigate(`/${user._id}/dashboard`)} className='common-btn'><MdSpaceDashboard/> Dashboard</button>
             <button onClick={logoutHanler} className='common-btn logout'><LuLogOut/> Logout</button>
        </div>
    </div>
     </div>}
    </div>
  )
}

export default Account