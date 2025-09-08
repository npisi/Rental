const mongoose = require('mongoose')
const {Schema , model} = mongoose

const userSchema = new Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName :{
        type : String,
        required : true
    },
    emailId : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['user', 'host' , 'admin']
    },
   

    //For Hosts

    
    updatedAt : {
        type : Date,
        default : Date.now
    }
    
},{timestamps : true})

module.exports = model("User" , userSchema , "users")