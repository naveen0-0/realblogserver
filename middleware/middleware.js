const jwt = require('jsonwebtoken');

const checkToken = (req,res,next) => {
    const logintoken = req.headers.authorization
    if(logintoken==='null') return res.send({ msg:"You have to be logged in to perform this action"})

    jwt.verify(logintoken,process.env.ACCESS_TOKEN,(err,decoded) => {
        if(err) return res.send({ msg:"Error Decoding your token"})
        req.user = decoded;
        next();
    })
}

module.exports = {
    checkToken
}