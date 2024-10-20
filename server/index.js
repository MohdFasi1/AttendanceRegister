import express from "express"
import path from "path";
import http from 'http'; 
import cron from 'node-cron';
import { Emp } from "./models/emp.js"
import cors from 'cors'
import bcrypt from 'bcrypt';
import { EmpData } from './models/login.js';
import { Announcement } from "./models/announcement.js";
import { Server } from 'socket.io';
import { config } from "dotenv";
config()
import connectDB from "./connectMongo.js";
import { Notification } from "./models/notification.js";
const app = express();

const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Adjust this to match your client URL
    methods: ['GET', 'POST'],
    credentials: true // Allow connections from any domain (modify in production)
  },
});
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}
));
connectDB()



// runs every day at 23:59 (11:59 PM) and marks absent to remaining employees
cron.schedule('59 23 * * *', async () => {
  try {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const employees = await EmpData.find();
    let temp = [];
    for (let employee of employees) {
      const attendance = await Emp.findOne({
        id: employee._id,
        date: today.toLocaleString()
      });
      if (!attendance) {
        await Emp.create({
          id: employee._id,
          date: today.toLocaleString(),
          status: 'Absent'
        });
        temp.push(employee.name)
        let notify = new Notification({
          id: employee._id,
          message : `you were marked absent for date:${today.toLocaleString()} `
        });
        await notify.save();
        io.emit(employee._id,notify);
      }
      else{
        if(attendance.status === "Incomplete" || attendance.status === "Ongoing"){
          let notify = new Notification({
            id: employee._id,
            message : `you were marked absent for date:${today.toLocaleString()} `
          });
          await notify.save();
          io.emit(employee._id,notify)
        }
      }
    }
    await Emp.updateMany({
      date: yesterday.toLocaleString(),
      $or: [
        { status: "Incomplete" },
        { status: "Ongoing" },
      ]
    }, { status: "Absent" })
    let notifyAdmin = new Notification({
      id: "notify-admin",
      message : `${temp.join(', ')} were absent yesterday (${today.toLocaleString()})`
    });
    await notifyAdmin.save()
    io.emit("notify-admin",notifyAdmin)

  } catch (error) {
    console.error('Error marking employees as absent:', error);
  }
});



// login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await EmpData.findOne({ email,
      status: {$ne: "Inactive"}
     });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const passwordMatch = bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return res.json({ data: user });
    } else {
      return res.json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})


// punch in route
app.post('/api/punch', async (req, res) => {
  try {
    const { id,name } = req.body;
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const data = new Emp({
      id: id,
      date: date.toLocaleString(),
      time_in: new Date(),     
      status: "Ongoing"
    })
    data.save();
    let temp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase()
    let notify = new Notification({
      id: "notify-admin",
      message : `${name} checked in at ${temp}`
    });
    notify.save()
    io.emit("notify-admin",notify)
    res.json({ data, message: `Data Submitted Successfully` });
  } catch (err) {
    console.log(err);
    res.json({ message: `There was an error while submiting data, Please Try again` })
  }
})


// punch out route
app.put('/api/punch', async (req, res) => {
  try {
    const a = req.body;

    const temp = await Emp.findOne({ _id: a._id });
    let timeDiff = new Date() - new Date(temp.time_in)
    let hour = Math.round(timeDiff / (1000 * 60 * 60));
    const status = hour <= 4 ? "Incomplete" : hour >= 8 ? "Present" : "Half Day";
    const data = await Emp.updateOne({ _id: a._id }, {
      time_out: new Date(),
      notes: a.notes,
      status: status,
    })
    let time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase()
    let notify = new Notification({
      id: "notify-admin",
      message : `${a.name} checked out at ${time}`
    });
    notify.save()
    io.emit("notify-admin",notify)
    res.json({ data, message: "punched out" })
  }
  catch (err) {
    console.error(err)
  }
})


// todays attendance status route
app.get('/api/today', async (req, res) => {
  try {
    const id = req.query.id;

    // Get today's date at midnight
    const date = new Date();
    date.setHours(0, 0, 0, 0);// Reset time to midnight (00:00:00)
    let today = date.toLocaleString()
    // Query for the employee's current shift (open shift where time_out is not set)
    const data = await Emp.findOne({
      id: id,
      status :{$ne : "Absent"},
      $or: [
        { date: { $gte: today } },  // Check if the date is today or later
        { time_out: null, date: { $lt: today } }  // Check for open shifts from previous days
      ]
    });
    console.log(today)
    const markedShift = await Emp.findOne({
      id: id,
      date: today,
      time_out: { $ne: null } 
    });

    if (markedShift) {
      // If the employee has already punched out, send "Marked" message
      res.json({ data: markedShift, message: 'Marked' });
    } else if (data) {
      // If the employee has a shift without a time_out, send shift data with punch-out status
      res.json({ data: data, message: 'Punch Out' });
    } else {
      // If there's no active shift, respond with punch-in status
      res.json({ data: null, message: 'Punch In' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching data' });
  }
});


//dashboard data
app.get('/api/get-dashboard-data', async(req,res)=>{
  const date = new Date();
  date.setHours(0,0,0,0);
  try{
    const employees = await EmpData.find({
      status: {$ne: "Inactive"}
    });
    const attendance = await Emp.find({
      date: date.toLocaleString()
    });
    res.json({employees, attendance})
  }catch(err){
    res.status(500).send({message:"error getting data"})
    console.error(err)
  }
})

//employees data list
app.get('/api/employees', async (req, res) => {
  const data = await EmpData.find()
  res.json(data)
})


// attendance of single employee upto 3 months
app.get('/api/attendance', async (req, res) => {
  try {
    const id = req.query.id;
    const month = req.query.month;
    const now = new Date();
    const fromDate = new Date(now.getFullYear(), now.getMonth() - month, 1).toLocaleString();
    const toDate = new Date(now.getFullYear(), now.getMonth() - month + 1, 0).toLocaleString();
    const data = await Emp.find({
      id: id,
      date: { $gte: fromDate, $lte: toDate }
    });
    const distDates = await Emp.distinct('date', {
      date: { $gte: fromDate, $lte: toDate }
    })
    const count = {
      total: distDates.length,
      present: data.length,
      absent: distDates.length - data.length
    }
    res.json({ data, count });
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Announcement posted by admins
app.post('/api/announcement',async(req,res)=>{
  const { message, postedBy } = req.body;
    const newAnnouncement = new Announcement({ message, postedBy });
    try {
        await newAnnouncement.save();
        io.emit('announcement', newAnnouncement);
        res.status(200).json({ message: 'Announcement posted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error posting announcement' });
    }
})

//retrive announcements
app.get('/api/announcements',async(req,res)=>{
  try{
    const announcements = await Announcement.find().sort({date:-1});
    res.json(announcements);
  }
  catch(err){
    res.status(500).json({message:"error fetching announcements"});
  }
})

// notifications to admins
app.get('/api/notify',async(req,res)=>{
  try{
    const id = req.query.id;
    const notifications = await Notification.find({id:id}).sort({date:-1});
    res.json(notifications);
  }
  catch(err){
    res.status(500).json({message:"error fetching announcements"});
  }
})


// add Employee Data
app.post('/api/employee-details', async (req, res) => {
  try {
    const data = req.body;
    const user = await EmpData.findOne({ email: data.email });
    if (user) {
      return res.json({ message: 'User Already Exist',success:false });
    }
    const hashedPass = await bcrypt.hash(data.password, 10)
    const emp = new EmpData({
      ...data,
       password: hashedPass,
    })
    await emp.save()
    return res.json({ message: "user added", success:true })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
})

// update employee's data
app.put('/api/employee-details', async (req, res) => {
  try {
    const data = req.body;
    await EmpData.updateOne({_id:data._id},{
      ...data,
    })
    return res.json({ message: "user updated", success:true })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
})

// to delete employee
app.delete('/api/delete-employee/:_id', async (req, res) => {
  try {
    const _id = req.params;
    await EmpData.updateOne({_id},{
      status : "Inactive",
      leftOn : new Date().toLocaleString(),
    })
    return res.json({ message: "user Deleted", success:true })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
})

// get employee Data
app.get('/api/employee-details',async (req,res)=>{
  try{
    const _id = req.query.id
    const data = await EmpData.findOne({_id});
    res.json(data);
  }catch(err){
    console.error(err)
  }
})



const port = process.env.PORT

server.listen(port, () => {
  console.log('Server running on port 3000');
});