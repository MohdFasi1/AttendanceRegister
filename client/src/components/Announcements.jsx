import React, { useEffect, useState } from 'react'
import socket from './middlewares/socket'
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Textarea, Typography } from '@material-tailwind/react';
const Announcements = ({ loginData }) => {
  const [announcements, setAnnouncements] = useState([])
  const [message,setMessage] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/announcements`)
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data);
      })
      .catch(err => console.error(err));

    socket.on('announcement', (message) => {
      setAnnouncements(prev => [message, ...prev]);  // Add new announcement to the list
    });
    return () => {
      socket.off('announcement');
    };
  }, [])

  const postAnnouncement = async(e) => {
    try {
      e.preventDefault();
      const a = await fetch(`${import.meta.env.VITE_API_URL}/api/announcement`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({message,postedBy:loginData.name}),
      });
      const res = await a.json();
      console.log(res.message)
      setOpen(false)
  } catch (err) {
      console.error(err)
  }
  }
  return (
    <div className=' w-full h-full lg:h-1/3 bg-white border box-content flex flex-col overflow-hidden'>
      <div className='border-b flex justify-between p-2'>
        <h1 className=' text-lg font-semibold font-poppins text-secondary'>Announcements</h1>
        {loginData?.isAdmin && <button className='px-4 bg-tertary text-white' onClick={() => setOpen(true)}>Post Announcement</button>}
      </div>
      <div className='p-2 w-full h-auto  overflow-y-scroll'>
        {announcements.length == 0 ?
          <div className=' flex flex-col justify-center items-center '>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 text-t1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
            </svg>
            <p className='text-t1 text-md font-semi'>NO ANNOUNCEMENTS!!</p>
          </div> :
          announcements.map((announcement, index) => (
            <div key={index} className='text-sm '>
              <strong className='text-tertary'>{announcement.postedBy}</strong>
              <span className='text-xs text-t1'> ({new Date(announcement.date).toLocaleString()})</span>: <br /> {announcement.message}
            </div>
          ))
        }
      </div>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader className='text-tertary'>Post Announcement</DialogHeader>
        <form onSubmit={postAnnouncement}>
          <DialogBody >
            <div>
              {/* <Typography color='gray' className='font-poppins text-sm'>Announcement</Typography> */}
              <Textarea
              label='Announcement'
                type="password" // Ensure type is password
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                autoComplete="off"
                required
                className="w-full rounded-none font-poppins text-t1 text-sm border-t1 border p-2"
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type='submit' className='bg-tertary'>Post</Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  )
}

export default Announcements