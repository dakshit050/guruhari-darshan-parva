const mongoose=require('mongoose');
const {uuid} = require('uuidv4');

const attendanceSchema= new mongoose.Schema({
    uuid:{type:String,default:uuid},
    name:{type:String},
    phoneNumber:{type:String,index: { unique: true }},
    sabha:{type:String,default:""},
    reference:{type:String,default:""}
});


const Attendance= mongoose.model('attendance',attendanceSchema);

module.exports=Attendance;