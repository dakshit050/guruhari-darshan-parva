const mongoose = require("mongoose");
const Attendance = require("./models/attendance");
const axios=require("axios");
mongoose.connect(
    process.env.URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    async function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Connected to database");
  
      }
    })


    async function markAttendance(payload){
    console.log(payload)
    const {accessToken,requestId,endpoint}= payload;
      const headers= { 
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
    }
    try{
        const response= await axios.get(endpoint,{
            headers
        });
        const result=response.data;
        let attendance = Attendance();
        attendance.uuid=requestId;
        attendance.name=result.name.first+" "+result.name.last;
        attendance.phoneNumber=(result.phoneNumbers[0].toString()).slice(2);
        return await attendance.save();
    }catch(e){
        throw e;
    }
   
}

async function findAttendance(Id){
    try{
        let result=await Attendance.findOne({"uuid":Id});
        return result;
    }catch(e){
        throw e;
    }
}

async function markAttendanceManually(payload){
    const {name,phoneNumber,sabha,reference}=payload;
    try{
        let isPresent= await Attendance.findOne({"phoneNumber":phoneNumber});
        if(isPresent!==null){
            isPresent.sabha=sabha;
            isPresent.reference=reference;
            await isPresent.save();
            return "Present";
        }else{
            let attendance = Attendance();
            attendance.name=name;
            attendance.phoneNumber=phoneNumber;
            attendance.sabha=sabha;
            attendance.reference=reference;
            return await attendance.save();
        }
    }catch(e){
        throw e;
    }
}
module.exports={
    markAttendance:markAttendance,
    findAttendance:findAttendance,
    markAttendanceManually:markAttendanceManually
}