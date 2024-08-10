const express = require('express')
const app = express();
const cors = require('cors');
const mongoose= require('mongoose');
const authRoutes=  require("./routes/authRoutes")
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow cookies and authentication headers
}));

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes)

mongoose.connect(process.env.DB_URL).then((result)=>{
    console.log("DB connected successfully");
})
.catch(err=>{
    console.log(err);
})


app.listen(PORT,()=>{
    console.log(`Server started at ${PORT} `)
})