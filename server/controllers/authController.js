const User = require("../models/user")
const jwt = require('jsonwebtoken')
require("dotenv").config();

const secretKey= process.env.JWT_SECRET



async function registeredUser(req, res){
    let {firstName, lastName, username, password}= req.body;
    try{

        const duplicate= await User.find({username});
        if(duplicate && duplicate.length> 0){
            return res.status(400).send({message:"User already registered"})
        }

        let user = new User({firstName, lastName, username, password});
        const result = await user.save();
        console.log(result)
        res.status(201).send({message:"User registered successfully"});

    }

    catch(err){
        console.log(err)
        req.status(400).send(err)
    }
    
}


async function loginUser(req, res){

    try{
        const{username,password} = req.body
        const user = await User.findOne({username})
        if(!user){
            return res.status(404).send({error:"Authentication failed"})
        }

        const isPasswordvalid = await user.comparePassword(password)
        if(!isPasswordvalid){
            return res.status(404).send({error:"Wrong Password"})

        }

        let token = await jwt.sign({userId: user?._id}, secretKey, {expiresIn: "1h"});

            let finalData={
                userId: user?._id,
                username: user?.username,
                firstName: user?.firstName,
                lastName: user?.lastName,
                token

            }

            res.send(finalData)
        
    }

    catch(err){
        console.log(err);
        res.status(400).send(err)
    }
}


const AuthController={
    registeredUser,
    loginUser
}

module.exports = AuthController