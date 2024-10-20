import React from 'react'
import Header from '../Header'
import Nav from '../Nav'
import { Outlet } from 'react-router-dom'

const AdminLayout = ({loginData, setLoginData}) => {
  return (
    <div className='h-screen bg-primary w-full flex flex-col'>
        <Header data={loginData} setLoginData={setLoginData}/>
        <div className='lg:flex h-full w-full overflow-hidden pt-2 gap-2'>
          <Nav/>
          <Outlet/> 
        </div>
    </div>
  )
}

export default AdminLayout