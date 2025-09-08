const jwt = require('jsonwebtoken')

const propertyAuth = (req,res,next) => {
    const token =  req.cookies?.token || req.headers("Authorization")?.replace("Bearer ", "")
    if(!token) return res.status(401).send("No token , Access Denied")
    
    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        req.user = decoded
        next()
    }catch(err){
        res.status(401).send("Error : "+err.message)
    }
}

module.exports = propertyAuth