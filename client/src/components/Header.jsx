import { Button, Drawer, List, ListItem } from '@material-tailwind/react';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';

const Header = ({ data, setLoginData }) => {
    const navigate = useNavigate()
    const handleLogOut = () => {
        Cookies.remove('cred');
        setLoginData(null)
        navigate('/')
    }
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("/");
    return (
        <>
            <div className='flex justify-between h-16 items-center px-2 lg:px-8 py-2 w-full bg-white top-0'>
                <h1 className='text-2xl font-extrabold text-secondary bg-primary p-2'>
                    <Link to='/'>LOGO</Link>
                </h1>
                <div className='flex gap-2 justify-center items-center'>
                    <Link to='notifications'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                    </svg>
                    </Link>
                    <Link to='/profile'>
                        <div className='bg-secondary text-white font-bold flex h-10 w-10 rounded-full justify-center items-center '>
                            {data?.name[0]}{data?.name.split(' ')[1] && data.name.split(' ')[1][0]}
                        </div>
                    </Link>
                    <Button variant='text' onClick={() => setOpen(true)} className='p-0 block lg:hidden'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 text-secondary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </Button>
                </div>

            </div>
            <Drawer placement='right' open={open}
                onClose={() => setOpen(false)}
                className="p-4 flex flex-col justify-between">
                <List className='pt-16'>
                    <Link to='/' selected={selected === "/"} onClick={() => {
                        setSelected("/")
                        setOpen(false)
                    }}> <ListItem>Home</ListItem> </Link>
                    <Link to='/attendance' selected={selected === "attendance"} onClick={() => {
                        setSelected("attendance")
                        setOpen(false)
                    }}> <ListItem>Attendance History</ListItem> </Link>
                    <Link to='/profile' selected={selected === "profile"} onClick={() => {
                        setSelected("profile")
                        setOpen(false)
                    }}> <ListItem>View Profile</ListItem> </Link>
                    <Link to='/announcements' selected={selected === "announcements"} onClick={() => {
                        setSelected("announcements")
                        setOpen(false)
                    }}> <ListItem>Announcements</ListItem> </Link>
                </List>
                <Button className='w-full ' variant='text' size='lg' color='red' onClick={handleLogOut}>Log Out</Button>
            </Drawer>
        </>
    )
}

export default Header