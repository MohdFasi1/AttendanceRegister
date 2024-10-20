import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Textarea } from '@material-tailwind/react';
import React, { useState } from 'react';
import vector from '../assets/vector.png'
const CircularProgress = ({ progress, max, shift, loginData, refresh, setRefresh }) => {
  const [open, setOpen] = useState(false);
  const [notes,setNotes] = useState("");
  const handleOpen = ()=>setOpen(!open);
  const radius = 100; // Radius of the outer circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const offset = circumference - (progress / max) * circumference;

  const punchIn = async () => {
    console.log("punchin clicked")
    try {
      let api = await fetch(`${process.env.REACT_APP_API_URL}/api/punch`, {
        method: shift?.message === "Punch Out" ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: shift?.message === "Punch In" ? JSON.stringify({
          id: loginData?._id,
          name: loginData?.name,
        }) : JSON.stringify({
          _id: shift?.data?._id,
          name: loginData?.name,
          notes: notes
        })
      })
      let res = await api.json();
      console.log("data received",res)
      setRefresh(!refresh)
      handleOpen()
    } catch (err) {

    }
  }

  return (
    <div className="w-full h-full">
      <div className=" w-full h-full flex justify-center items-center">
        {/* Outer Progress Circle */}
        <svg width="280" height="280" className="absolute " transform='rotate(270,0,0)'>
          <circle
            stroke="#fff" // Background circle color (gray)
            strokeWidth="12"
            fill="transparent"
            r={radius}
            cx="140"
            cy="140"
          />
          <circle
            // stroke="#f59e0b"// Progress color (orange)
            strokeWidth="12"
            fill="transparent"
            r={radius}
            cx="140"
            cy="140"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition stroke-current duration-300 text-tertary"
            strokeLinecap="round"
          />
        </svg>

        <div className='absolute  w-48 h-48 rounded-full p-6 bg-primary'>
          <Button onClick={handleOpen} color='white' className='w-full h-full rounded-full bg-white shadow-inner shadow-t1 flex flex-col gap-2 justify-center items-center' disabled={shift?.message === "Marked"}>
            <img src={vector} alt="" />
            <p className='font-poppins text-sm'>{shift?.message}</p>
          </Button>
        </div>
        <Dialog open={open} handler={() => setOpen(!open)}>
        <DialogHeader className='text-secondary bg-primary font-poppins'>{shift?.message || " "}</DialogHeader>
        <DialogBody>
          <h1 className=''>you are about to {shift?.message}</h1>
          {shift?.message === "Punch In" ?<p>Click Confirm</p>:
          <div className='flex- flex-col'>
            <label htmlFor="notes">Add Notes</label>
            <Textarea name="notes" id="notes" value={notes} onChange={(e)=>setNotes(e.target.value)} />
          </div> }
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <button variant="gradient" className='bg-secondary px-4 py-2 shadow-inner text-white rounded'
            onClick={punchIn}>
            <span>Confirm</span>
          </button>
        </DialogFooter>
      </Dialog>
      </div>
      
    </div>
  );
};

export default CircularProgress;
