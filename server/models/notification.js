import mongoose from "mongoose";
const NotificationSchema = new mongoose.Schema({
    id:String,
    message: { type: String, required: true },
    date: { type: Date, default: Date.now, expires: '1d' }
})

export const Notification = mongoose.model('Notification',NotificationSchema);