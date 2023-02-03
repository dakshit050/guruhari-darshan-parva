const express = require('express');
const app = express();
const cors = require('cors');
const dbm = require("./dbm");
const Attendance = require('./models/attendance');

app.use(cors({
	origin: "*"
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/totalcount",async (req,res)=>{
    try {
        let count= await Attendance.countDocuments().exec();
        return res.status(200).json(count);   
    } catch (error) {
        return res.status(500).json(error);
    }
});
app.post('/attendance', async (req, res) => {
    try{
        const result= await dbm.markAttendanceManually(req.body);
        if(result==="Present"){
            return res.status(402).send("This phone number is already registerd");
        }
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json(e);
    }
});


app.post('/', async (req, res) => {
    try{
        const result= await dbm.markAttendance(req.body);
        return res.status(200).json(result);
    }catch(e){
        return res.status(200).send();
    }
});

app.get('/:id', async (req, res) => {
    const id=req.params['id'];
    try{
        const result= await dbm.findAttendance(id);
        if(result){
            return res.status(200).send();
        }
        return res.status(404).send();
    }catch(e){
        console.log(e)
        return res.status(500).json(e);
    }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app listening at Port:${PORT}`);
});