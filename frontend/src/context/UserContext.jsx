import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

import { server } from "../main";
import toast, {Toaster} from "react-hot-toast"
const UserContext= createContext();

export const UserContextProvider = ({children})=>{
    const [user, setUser] = useState([])
    const [isAuth, setisAuth] = useState(false)
    const [btnLoading, setbtnLoading] = useState(false)
    const [loading, setLoading] = useState(true)
    async function loginUser (email,password,navigate,fetchMyCourse){
        setbtnLoading(true)
        try {
            const {data} = await axios.post(`${server}/api/user/login`,{email,password});
            localStorage.setItem("token", data.token);
            toast.success(data.message);
            setUser(data.user)
            setisAuth(true);
            setbtnLoading(false)
            navigate("/")
            fetchMyCourse()
        } catch (error) {
            setbtnLoading(false)
            setisAuth(false)
            toast.error(error.response.data.message)
            console.log(error);
        }
    }
    async function fetchUser() {
        try {
            const {data} = await axios.get(`${server}/api/user/me`,{
                headers:{
                    token:localStorage.getItem("token"),
                },
            })
            setisAuth(true);
            setUser(data.user)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchUser();
    },[])

    async function registerUser (name,email,password,navigate){
        setbtnLoading(true)
        try {
            const {data} = await axios.post(`${server}/api/user/register`,{name,email,password});
            localStorage.setItem("activationToken", data.activationToken);
            toast.success(data.message);
            setbtnLoading(false)
            navigate("/verify")
        } catch (error) {
            setbtnLoading(false)
            toast.error(error.response.data.message)
            console.log(error);
        }
    }
    async function verifyOtp (otp,navigate){
       setbtnLoading(true)
         const activationToken = localStorage.getItem("activationToken")
        try {
            const {data} = await axios.post(`${server}/api/user/verify`,{activationToken,otp});
            localStorage.setItem("activationToken", data.activationToken);
            toast.success(data.message);
      
            navigate("/login")
            localStorage.clear();
            setLoading(false)
        } catch (error) {
     
            toast.error(error.response.data.message)
            setLoading(false)
        }
    }
    return (
    <UserContext.Provider value={{user,verifyOtp,fetchUser,registerUser,setUser,setisAuth,isAuth,loginUser,btnLoading,loading}} >
        {children}
        <Toaster/>
    </UserContext.Provider>)
}

export const UserData = () => useContext(UserContext);