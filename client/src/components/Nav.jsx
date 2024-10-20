import { ListItem } from '@material-tailwind/react'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Nav = () => {
    const location = useLocation();
    const [selected,setSelected] = useState(location.pathname)
    console.log(location.pathname)
    return (
        <div className='bg-white w-1/ hidden lg:block'>
            <div className='flex flex-col gap-1 h-full'>
                <Link to='/'>
                    <ListItem className={`w-44cursor-pointer transition-colors duration-200 
            ${selected === "/" ? 'bg-tertary text-white focus:bg-tertary focus:text-white focus:bg-opacity-100' : 'bg-white text-black'}`} selected={selected==="/"}  onClick={()=>setSelected("/")}>Home</ListItem>
                </Link>
                <Link to='/dashboard'>
                    <ListItem className={`w-44 transition-colors duration-200 
            ${selected === "/dashboard" ? 'bg-tertary text-white focus:bg-tertary focus:text-white focus:bg-opacity-100'  : 'bg-white text-black'}`} selected={selected==="/dashboard"} onClick={()=>setSelected("/dashboard")}>DashBoard</ListItem>
                </Link>
                <Link to='/manage-employees'>
                    <ListItem className={`w-44 transition-colors duration-200 
            ${selected === "/manage-employees" ? 'bg-tertary text-white focus:bg-tertary focus:text-white focus:bg-opacity-100'  : 'bg-white text-black'}`} selected={selected==="/manage-employees"} onClick={()=>setSelected("/manage-employees")}>Manage Employees</ListItem>
                </Link>
            </div>
        </div>
    )
}

export default Nav