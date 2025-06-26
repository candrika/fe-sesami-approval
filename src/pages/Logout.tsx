import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import {useNavigate} from 'react-router-dom'


const Logout =()=>{
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    useEffect(()=>{
        dispatch(logout())
        navigate('/login')
    },[])
} 

export default Logout;