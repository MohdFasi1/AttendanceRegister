import React from 'react'

const TodayAttendance = ({empData, attendanceToday}) => {
    console.log(empData,attendanceToday)
    const countHours = (e)=>{
        let timeDiff = e?.time_in ? (e?.time_out ? new Date(e.time_out) - new Date(e.time_in) : new Date() - new Date(e.time_in)) : 0;          
        let hours = Math.floor(timeDiff/(1000*60*60)).toString().padStart(2,'0');
        const mins = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2,'0');
        return `${hours}:${mins}`
    }
    const mergedData = empData.map(emp => {
        const attendance = attendanceToday.find(att => att.id === emp._id);
        if (attendance) {
          return {
            name: emp.name,
            _id:emp._id,
            ...attendance
          };
        } else {
          return {
            _id:emp._id,
            name: emp.name,
            status: 'Absent',
          };
        }
      });
      console.log(mergedData)
    const statusOrder = {
        'Present': 1,
        'Ongoing': 2,
        'Halfday': 3,
        'Incomplete': 4,
        'Absent': 5
      };
    
      const sortedData = mergedData.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
      console.log(sortedData)
  return (
    <div className='w-full bg-white h-full pt-16 lg:pt-0 p-1 box-content flex flex-col overflow-hidden'>
            <h1 className='p-2 border-b text-lg font-semibold font-poppins text-secondary'>Today's Attendance</h1>
            <div className='w-full h-full overflow-y-scroll'>
            <table className='w-full h-auto table-auto border-collapse'>
                <thead>
                    <tr className=' bg-primary sticky top-0'>
                        <th className='border border-collapse ' >Sno.</th>
                        <th className='border border-collapse ' >Name</th>
                        <th className='border-collapse ' >Check In</th>
                        <th className='border border-collapse ' >Check Out</th>
                        <th className='border border-collapse ' >totalhours</th>
                        <th className='border border-collapse ' >Status</th>
                    </tr>
                </thead>
                <tbody className='overflow-y-scroll w-full'>
                    {
                        sortedData && sortedData.map((e, i) =>
                            <tr key={e._id}>
                                <td className='border border-collapse'>{i+1}</td>
                                <td className='border border-collapse'>{e.name}</td>
                                <td className='border border-collapse'>{e.time_in ? new Date(e.time_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase() : "N/A"}</td>
                                <td className='border border-collapse'>{e.time_out ? new Date(e.time_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase() : "N/A"}</td>
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

export default TodayAttendance