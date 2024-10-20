import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header'

const EmpLayout = ({loginData, setLoginData}) => {
  return (
    <div className='h-screen bg-primary w-full overflow-hidden flex flex-col gap-2'>
      <Header data={loginData} setLoginData={setLoginData}/>
      <Outlet/>
    </div>
  )
}

export default EmpLayout