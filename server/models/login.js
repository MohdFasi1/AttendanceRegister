import mongoose from "mongoose";
const EmpDataSchema = new mongoose.Schema({
    name: String,
    email: String,
    password:String,
    phone: Number,
    position: String,
    department:String,
    joinDate: String,
    salary:Number,
    address:String,
    isAdmin:Boolean,
    superUser: Boolean,
    status: String,
    leftOn:String,
})

export const EmpData = mongoose.model('EmpData',EmpDataSchema)
