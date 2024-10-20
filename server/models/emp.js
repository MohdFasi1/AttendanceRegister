import mongoose from "mongoose";
const EmpSchema = new mongoose.Schema({
    id:String,
    date:String,
    time_in: Date,
    time_out:Date,
    notes:String,
    status: String,
})

EmpSchema.index({ id: 1, date: 1 }, { unique: true });

export const Emp = mongoose.model('attendance',EmpSchema)
