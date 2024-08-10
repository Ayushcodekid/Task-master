const express = require('express')
const app = express();
const cors = require('cors');
const mongoose= require('mongoose');
const authRoutes=  require("./routes/authRoutes")
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:3000',
    'https://codertodoapp.netlify.app/'
  ];

  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));


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