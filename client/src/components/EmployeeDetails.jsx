import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Textarea } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AttendanceSheet from './AttendanceSheet';
import EmployeeForm from './EmployeeForm';

const EmployeeDetails = ({ loginData }) => {
  const [open,setOpen] = useState(false)
  const [openDelete,setOpenDelete] = useState(false)
  const { id } = useParams();
  const [data, setData] = useState({});
  const [message,setMessage] = useState({})
  const navigate = useNavigate();
  const getData = async () => {
    let a = await fetch(`${import.meta.env.VITE_API_URL}/api/employee-details?id=${id}`)
    let res = await a.json();
    setData(res)
  }
  useEffect(() => {
    getData();
  }, [message])

  const handleDelete = async()=>{
    let a = await fetch(`${import.meta.env.VITE_API_URL}/api/delete-employee/${data._id}`,{
      method: 'DELETE',
  })
  let res = await a.json();
  setMessage(res)
  setOpenDelete(false)
  navigate('/manage-employees')
  setTimeout(() => {
    setMessage({})
  }, 5000);
  }

  return (<>
    <div className='w-full h-full p-1 bg-primary flex flex-col overflow-hidden gap-2'>
      <div className='w-full flex justify-between bg-white items-center h-auto py-4 px-8'>
        <div className='flex gap-2 h-full'>
          <div className='bg-secondary text-white font-bold flex h-20 w-20 rounded-full justify-center items-center text-4xl'>
            {data?.name && (<>{data?.name[0]}{data?.name.split(' ')[1] && data.name.split('')[1][0]}</>)}
          </div>
          <div className='flex flex-col justify-center'>
            <h1 className='text-xl font-poppins font-semibold'>{data.name} {data.isAdmin && <span className='bg-tertary text-white text-xs leading-none align-top rounded-xl px-1'>Admin</span>}</h1>
            <h2 className='font-poppins text-t1 leading-none'>{data.email}</h2>
          </div>
        </div>
        {(!data?.isAdmin || loginData.superUser) && <div>
          <Button variant='text' className='rounded-full p-2' onClick={()=>setOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </Button>
          <Button variant='text' className='rounded-full p-2' onClick={()=>setOpenDelete(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </Button>
        </div>}
      </div>
      <div className=' w-full h-full flex gap-2 overflow-hidden' >
        <div className='w-1/3 h-full bg-white flex flex-col px-2'>
        <h1 className='p-2 border-b text-lg font-semibold font-poppins text-secondary'>Employee Data</h1>
          <div className='w-full h-full flex flex-col overflow-scroll gap-2 py-4'>
            <Input defaultValue={data._id} label='Id' />
            <Input defaultValue={data.name} label='Name' />
            <Input defaultValue={data.email} label='Email' />
            <Input defaultValue={data.phone} label='Phone' />
            <Input defaultValue={data.position} label='Position/Roll' />
            <Input defaultValue={data.department} label='Department' />
            <Input defaultValue={data.salary} label='Salary' type='number'/>
            <Input defaultValue={data.joinDate && new Date(data.joinDate).toLocaleString().split(',')[0]} label="Joining Date" />
            <Input defaultValue={data.salary} label="Salary" />
            <Textarea defaultValue={data.address} label="Address" />
          </div>
        </div>
        <div className='w-2/3'>
          {data._id && <AttendanceSheet loginData={data} />}
        </div>
      </div>
    </div>
    <EmployeeForm open={open} handleOpen={()=>setOpen(false)} loginData={loginData} method='PUT' message={message} setMessage={setMessage} data={data}/>
    <Dialog open={openDelete} handler={()=>setOpenDelete(false)}>
      <DialogHeader>Delete Employee</DialogHeader>
      <DialogBody>
        <p>You are Deleting {data.name}({data._id})</p>
      </DialogBody>
      <DialogFooter>
        <Button onClick={handleDelete}>Delete</Button>
      </DialogFooter>
    </Dialog>
    </>
  )
}

export default EmployeeDetails