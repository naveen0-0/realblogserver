const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');


//* SignUp Route
router.route('/signup').post( async (req,res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.findOne({ username : username });
        if(user){
            return res.send({ statusload: false, msg:"Username already exists" })
        }else{
            const user = await User.findOne({ email : email })
            if(user){
                return res.send({ statusload: false, msg:"Email already exists" })
            }else{
                await User.create({ username, email, password });
                return res.send({ statusload:true, msg : "Account successfully created" })
            }
        }
    } catch (error) {
        return res.send({ statusload: false, msg:"Error occured while creating user" })
    }
})

//* Login User
router.route('/login').post( async (req,res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username : username })
        if(user){
            if(user.password === password){
                jwt.sign({ username : username },process.env.ACCESS_TOKEN,(err,token) => {
                    if(err) return res.send({ statusload: false, msg:"Error while creating token"})
                    res.send({ statusload: true, msg:"Successfully logged in",token:token,user:{ username:user.username,email:user.email,loggedIn:true}})
                })
            }else{
                return res.send({ statusload: false, msg:"Incorrect Password"})
            }
        }else{
            return res.send({ statusload: false, msg:"Incorrect Username"})
        }
    } catch (error) {
        return res.send({ statusload: false, msg:"Error logging in"})
    }
})


router.route('/getuser').get( async (req,res) => {
    const logintoken = req.headers.authorization
    if(logintoken){
        jwt.verify(logintoken,process.env.ACCESS_TOKEN,async (err,decoded) => {
            if(err) return res.send({statusload:false,msg:"error getting the user"})
            const user = await User.findOne({ username : decoded.username })
            return res.send({
                statusload:true,
                user:{ username : user.username,email:user.email,loggedIn:true}
            })
        })
    }else{
        res.send({
            statusload:false,
            user:{ username : "",email:"",loggedIn:false}
        })
    }
})

module.exports = router;