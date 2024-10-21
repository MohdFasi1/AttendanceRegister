import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import EmployeeForm from './EmployeeForm';

const ManageEmployees = ({ loginData }) => {
    const [employees, setEmployees] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState({})
    useEffect(() => {
        getEmployees();
    }, [message])
    const getEmployees = async () => {
        let api = await fetch(`${import.meta.env.VITE_API_URL}/api/employees`);
        let res = await api.json();
        setEmployees(res);
    };

    return (
        <div className=' w-full h-full'>
            <div className='w-full bg-white h-full p-1 box-content overflow-hidden flex flex-col'>
                <div className='flex justify-between items-center px-2 w-full'>
                    <h1 className='p-2 border-b text-lg font-semibold font-poppins text-secondary'>Manage Employees</h1>
                    <button className='px-6 bg-tertary text-white py-1' onClick={() => setOpen(true)}>Add Employee</button>
                </div>
                <div className='w-full h-full overflow-y-scroll'>
                    <table className='w-full h-auto table-auto border-collapse'>
                        <thead>
                            <tr className='sticky top-0'>
                                <th className='bg-primary border border-collapse ' >Sno</th>
                                <th className='bg-primary border border-collapse ' >Id</th>
                                <th className='bg-primary border border-collapse ' >Name</th>
                                <th className='bg-primary border border-collapse ' >Email</th>
                                <th className='bg-primary border border-collapse ' >Phone no.</th>
                                <th className='bg-primary border border-collapse ' >Address</th>
                                <th className='bg-primary border border-collapse ' >Position</th>
                                <th className='bg-primary border border-collapse ' >Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                employees.filter((e)=>e?.status!=="Inactive").map((e, i) =>
                                    <tr className={e?.status=="Inactive" ? 'opacity-50' : ''} key={e._id}>
                                        <td className='border border-collapse'>{i + 1}</td>
                                        <td className='border border-collapse'>
                                            {e?.status == "Inactive" ? e._id : <Link to={`/employee-details/${e._id}`} className='hover:text-secondary'>{e._id}</Link>}
                                        </td>
                                        <td className='border border-collapse'>{e.name}{e?.status == "Inactive" && "(Inactive)"}</td>
                                        <td className='border border-collapse'>{e.email}</td>
                                        <td className='border border-collapse'>{e.phone}</td>
                                        <td className='border border-collapse'>{e.address}</td>
                                        <td className='border border-collapse'>{e.position}</td>
                                        <td className='border border-collapse'>{e.salary}</td>  
                                    </tr>
                                )}
                                {
                                employees.filter((e)=>e?.status =="Inactive").map((e, i) =>
                                    <tr className={e?.status=="Inactive" ? 'opacity-50' : ''} key={e._id}>
                                        <td className='border border-collapse'>{i + 1}</td>
                                        <td className='border border-collapse'>
                                            {e?.status == "Inactive" ? e._id : <Link to={`/employee-details/${e._id}`} className='hover:text-secondary'>{e._id}</Link>}
                                        </td>
                                        <td className='border border-collapse'>{e.name}{e?.status == "Inactive" && "(Inactive)"}</td>
                                        <td className='border border-collapse'>{e.email}</td>
                                        <td className='border border-collapse'>{e.phone}</td>
                                        <td className='border border-collapse'>{e.address}</td>
                                        <td className='border border-collapse'>{e.position}</td>
                                        <td className='border border-collapse'>{e.salary}</td>  
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
            <EmployeeForm open={open} handleOpen={()=>setOpen(false)} loginData={loginData} method='POST' message={message} setMessage={setMessage} />
        </div>
    )
}

export default ManageEmployees