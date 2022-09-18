const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');


//* SignUp Route
router.route('/signup').post( async (req,res) => {
    const { username, email, password } = req.body;
    try {
        const userNameExistsOrNot = await User.findOne({ username : username });
        if(userNameExistsOrNot) return res.send({ statusload: false, msg:"Username already exists" })

        const userEmailExistsOrNot = await User.findOne({ email : email })
        if(userEmailExistsOrNot) return res.send({ statusload: false, msg:"Email already exists" })

        try {
            const userCreated = await User.create({ username, email, password });
            jwt.sign({ username : username },process.env.ACCESS_TOKEN,(err,token) => {
                if(err) return res.send({ statusload: false, msg:"Error while creating token"})
                res.send({ statusload: true, msg:"Account successfully created",token:token,user:{ username:userCreated.username,email:userCreated.email,loggedIn:true}})
            })
        } catch (error) {
            return res.send({ statusload: false, msg:"Error creating your account." })
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
        if(user == null) return res.send({ statusload: false, msg:"Incorrect Username"})

        if(user.password !== password) return res.send({ statusload: false, msg:"Incorrect Password"})

        jwt.sign({ username : username },process.env.ACCESS_TOKEN,(err,token) => {
            if(err) return res.send({ statusload: false, msg:"Error while creating token"})
            res.send({ statusload: true, msg:"Successfully logged in",token:token,user:{ username:user.username,email:user.email,loggedIn:true}})
        })
            
    } catch (error) {
        return res.send({ statusload: false, msg:"Error logging in"})
    }
})


router.route('/getuser').get( async (req,res) => {
    const logintoken = req.headers.authorization
    if (logintoken === 'null') return res.send({ statusload:true, user:{username : "",email:"",loggedIn:false}}) 

    jwt.verify(logintoken,process.env.ACCESS_TOKEN,async (err,decoded) => {
        if(err) return res.send({statusload:false,msg:"error veryfying the user"})
        const user = await User.findOne({ username : decoded.username })
        return res.send({ statusload:true, user:{username : user.username,email:user.email,loggedIn:true }})
    })
})

module.exports = router;