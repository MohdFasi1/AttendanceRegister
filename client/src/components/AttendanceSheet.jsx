import React, { useEffect, useState } from 'react'
import Header from './Header';

const AttendanceSheet = ({loginData}) => {
    const [dataSheet, setDataSheet] = useState([]);
    const [month, setMonth] = useState(0);
    useEffect(()=>{
        getDataSheet()
        console.log(dataSheet)
    },[])
    const getDataSheet = async () => {
        try {
            let api = await fetch(`${import.meta.env.VITE_API_URL}/api/attendance?id=${loginData._id}&month=${month}`);
            let res = await api.json();
            setDataSheet(res.data);
            console.log(dataSheet)
        } catch (err) {
            console.error(err)
        }
    }
    const countHours = (e)=>{
        let timeDiff = e?.time_in ? (e?.time_out ? new Date(e.time_out) - new Date(e.time_in) : new Date() - new Date(e.time_in)) : 0;          
        let hours = Math.floor(timeDiff/(1000*60*60)).toString().padStart(2,'0');
        const mins = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2,'0');
        return `${hours}:${mins}`
    }
    
    return (
        <div className='w-full bg-white h-full p-1 box-content overflow-hidden flex flex-col'>
            <h1 className='p-2 border-b text-lg font-semibold font-poppins text-secondary'>Attendance History</h1>
            <div className='w-full h-full overflow-scroll'>
            <table className='w-full h-auto table-auto border-collapse overflow-y-scroll'>
                <thead>
                    <tr className=' bg-primary sticky top-0'>
                        <th className='border border-collapse ' >Date</th>
                        <th className=' border border-collapse ' >Check In</th>
                        <th className='border border-collapse ' >Check Out</th>
                        <th className='border border-collapse ' >totalhours</th>
                        <th className='border border-collapse ' >Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dataSheet.map((e, i) =>
                            <tr key={e._id}>
                                <td className='border border-collapse'>{e.date.split(",")[0]}</td>
                                <td className='border border-collapse'>{e.time_in && new Date(e.time_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase()}</td>
                                <td className='border border-collapse'>{e?.time_out && new Date(e?.time_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase()}</td>
                                <td className='border border-collapse'>{countHours(e)}</td>
                                <td className='border border-collapse'>{e?.status}</td>
                            </tr>
                        )}
                </tbody>
            </table>
            </div>
        </div>

    )
}

export default AttendanceSheet