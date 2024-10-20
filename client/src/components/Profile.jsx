import { Button,Input, Textarea } from '@material-tailwind/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
const Profile = ({ loginData,setLoginData }) => {
    const navigate = useNavigate();
    const handleLogOut = ()=>{
        Cookies.remove('cred');
        setLoginData(null)
        navigate('/')
    }
    return (
        <div className='w-full h-full bg-white p-8'>
            <div className='flex justify-between items-center p-2'>
                <div className='flex gap-2'>
                    <div className='bg-secondary text-white font-bold flex h-20 w-20 rounded-full justify-center items-center text-4xl'>
                        {loginData?.name[0]}{loginData?.name.split(' ')[1] && loginData.name.split(' ')[1][0]}
                    </div>
                    <div className='flex flex-col justify-center'>
                        <h1 className='text-xl font-poppins font-semibold'>{loginData.name} {loginData?.superUser ? <span className='bg-tertary text-white text-xs leading-none align-top rounded-xl px-1'>Super Admin</span> : loginData?.isAdmin && <span className='bg-tertary text-white text-xs leading-none align-top rounded-xl px-1'>Admin</span>}</h1>
                        <h2 className='font-poppins text-t1 leading-none'>{loginData.email}</h2>
                    </div>
                </div>
                <Button variant='text' color='red' onClick={handleLogOut}>Log Out</Button>
            </div>
            <div className='w-full h-auto p-4 grid grid-cols-2 gap-8'>
                <Input defaultValue={loginData.name} label="Name"/>
                <Input defaultValue={loginData._id} label="Id"/>
                <Input defaultValue={loginData.email} label="Email"/>
                <Input defaultValue={loginData.phone} label="Phone Number"/>
                <Input defaultValue={loginData.position} label="Position/Roll"/>
                <Input defaultValue={loginData.department} label="Department"/>
                <Input defaultValue={loginData.joinDate && new Date(loginData.joinDate).toLocaleString().split(',')[0]} label="Joining Date"/>
                <Input defaultValue={loginData.salary} label="Salary"/>
                <Textarea defaultValue={loginData.address} label="Address"/>
            </div>
        </div>
    )
}

export default Profile