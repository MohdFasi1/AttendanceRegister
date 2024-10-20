import { Card, CardBody, CardHeader } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import DataCard from './DataCard'
import getDashBoardData from './middlewares/GetDashboardData'
import TodayAttendance from './TodayAttendance'
import Notification from './Notification'
const Dashboard = () => {

  const [attendanceToday, setAttendanceToday] = useState([]);
  const [empData, setEmpData] = useState([]);
  useEffect(() => {
    getDashBoardData(setEmpData,setAttendanceToday);
    console.log(empData,attendanceToday)
  }, [])

  return (
    <div className=' w-full flex flex-col gap-2 h-full'>
      <div className='flex w-full gap-2'>
        <DataCard title="Total Present Today" progress={attendanceToday.length - attendanceToday.filter((e)=>e.status === "Incomplete").length} max={empData.length} >
          <div className='relative flex flex-col flex-end text-end w-full pt-4'>
            <p>Ongoing: {attendanceToday.filter((e)=>e.status==="Ongoing").length.toString().padStart(2,0)}</p>
            <p>Complete: {attendanceToday.filter((e)=>e.status === "Present").length.toString().padStart(2,0)}</p>
            <p>HalfDay: {attendanceToday.filter((e)=>e.status==="HalfDay").length.toString().padStart(2,0)}</p>
          </div>
        </DataCard>
        <DataCard title="Total Absent Today" progress={empData.length - attendanceToday.length + attendanceToday.filter((e)=>e.status === "Incomplete").length} max={empData.length} >
          <div className='relative flex flex-col flex-end text-end w-full pt-4'>
            <p className='h-5'></p>
            <p>Unmarked: {(empData.length - attendanceToday.length).toString().padStart(2,0)}</p>
            <p>Incomplete: {attendanceToday.filter((e)=>e.status==="Incomplete").length.toString().padStart(2,0)}</p>
          </div>
        </DataCard>
        <div className='h-40 w-full p-4 bg-white'>
          <h1 className='font-poppins text-lg text-tertary'>Total Employees</h1>
          <p className='w-full f-full text-6xl flex justify-center items-attendance p-6 text-secondary'>{empData.length.toString().padStart(2, 0)}</p>
        </div>
        <div className='h-40 w-full p-4 bg-white'>
          <h1 className='font-poppins text-lg text-tertary'>Total Admins</h1>
          <p className='w-full f-full text-6xl flex justify-center items-attendance p-6 text-secondary'>{empData.filter((e) => e.isAdmin).length.toString().padStart(2, 0)}</p>
        </div>

      </div>
      <div className='w-full h-full flex gap-2 overflow-hidden'>
        <TodayAttendance attendanceToday={attendanceToday} empData={empData}/>
        <Notification id="notify-admin"/>
      </div>
    </div>
  )
}

export default Dashboard