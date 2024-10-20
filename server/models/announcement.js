import mongoose from "mongoose";
const AnnouncementSchema = new mongoose.Schema({
    message: { type: String, required: true },
    postedBy: { type: String, required: true }, // Admin name or ID
    date: { type: Date, default: Date.now, expires: '7d' }
})

export const Announcement = mongoose.model('Announcement',AnnouncementSchema);