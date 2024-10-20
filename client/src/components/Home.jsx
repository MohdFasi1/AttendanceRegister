import React, { useEffect, useState } from 'react'
import totalhr from '../assets/totalhr.png'
import punchin from '../assets/punchin.png'
import punchout from '../assets/punchout.png'
import CircularProgress from './CircularProgress';
import Announcements from './Announcements';
import AttendanceSheet from './AttendanceSheet';
function getFormattedTime() {
    const date = new Date();

    let hours = date.getHours();
    let minutes = date.getMinutes();
    const sec = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // Pad single digits with a leading zero
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}
function getFormattedDate() {
    const date = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const weekday = weekdays[date.getDay()];

    return `${month} ${day}, ${year}, ${weekday}`;
}
function handleTotalHours(data, setProg) {
    let timeIn = new Date(data.time_in);
    let timeOut = data?.time_out ? new Date(data.time_out) : new Date();
    let timeDiff = timeOut - timeIn;
    setProg(Math.floor(timeDiff / (1000 * 60)));
    let hours = Math.floor(timeDiff / (1000 * 60 * 60)).toString().padStart(2, '0');
    const mins = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    console.log(`${hours}:${mins}`)
    return `${hours}:${mins}`
}
let interId;
function startInterval(data, setTotalHours, setProg) {
    setTotalHours(handleTotalHours(data, setProg))
    if (!interId) {
        console.log("interval")
        interId = setInterval(() => {
            setTotalHours(handleTotalHours(data, setProg))
        }, 60000);
    }
}
function stopInterval() {
    clearInterval(interId);
    interId = null;
}
const Home = ({ loginData }) => {
    const [timer, setTimer] = useState(getFormattedTime());
    const [date, setDate] = useState(getFormattedDate());
    const [shift, setShift] = useState({});
    const [totalhours, setTotalHours] = useState("00:00");
    const [prog, setProg] = useState(0);
    const [refresh, setRefresh] = useState(false);

    // Update clock every second
    useEffect(() => {
      const timerInterval = setInterval(() => {
        setTimer(getFormattedTime);
        if (timer === "12:00 AM") {
          setDate(getFormattedDate);
        }
      }, 1000);
  
      return () => clearInterval(timerInterval); // Cleanup the interval
    }, [timer]);
  
    useEffect(() => {
      console.log("home refreshed by cp")
      setTimeout(() => {
      getToday();
      }, 300);
    }, [refresh]);
  
    const getToday = async () => {
      console.log("gettoday running")
      try {
        let api = await fetch(`${process.env.REACT_APP_API_URL}/api/today?id=${loginData?._id}`);
        let res = await api.json();
        console.log("getdata received",res);
        setShift(res);
        if (res.data && !res.data?.time_out) {
          startInterval(res.data, setTotalHours, setProg);
        } else if (res.data?.time_out) {
          setTotalHours(handleTotalHours(res.data, setProg));
          stopInterval();
        } else {
          setTotalHours("00:00");
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    return (
      <div className='flex h-full overflow-hidden gap-2 w-full'>
        <div className='w-full lg:w-[540px] bg-white h-full'>
          <div className='w-full h-1/4 flex flex-col justify-center items-center'>
            <h1 className='text-5xl font-poppins'>{timer}</h1>
            <h2 className='text-sm font-poppins'>{date}</h2>
          </div>
          <div className='relative w-full h-1/2 flex justify-center items-center'>
            <CircularProgress 
              progress={Math.min(prog, 480)} 
              max={480} 
              shift={shift} 
              loginData={loginData} 
              setRefresh={setRefresh} 
              refresh={refresh} 
            />
          </div>
          <div className='h-1/4 flex justify-evenly items-center'>
            <div className='flex flex-col justify-center items-center'>
              <img src={punchin} alt="punch in" />
              <h1 className='font-poppins text-xl font-semibold'>
                {shift.data?.time_in 
                  ? new Date(shift.data.time_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  : "--:--"
                }
              </h1>
              <p className='text-t1'>Punch In</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <img src={punchout} alt="punch out" />
              <h1 className='font-poppins text-xl font-semibold'>
                {shift.data?.time_out 
                  ? new Date(shift.data?.time_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  : "--:--"
                }
              </h1>
              <p className='text-t1'>Punch Out</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <img src={totalhr} alt="total hours" />
              <h1 className='font-poppins text-xl font-semibold'>{totalhours}</h1>
              <p className='text-t1'>Total Hours</p>
            </div>
          </div>
        </div>
        <div className='hidden w-full lg:flex lg:flex-col gap-2 h-full'>
          <Announcements loginData={loginData} />
          <AttendanceSheet loginData={loginData} />
        </div>
      </div>
    );
  };
  
  export default Home;
  