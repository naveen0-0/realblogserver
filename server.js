const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authen');
const dotenv = require('dotenv')

//* App Initialization
const app = express();

//*Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(morgan('tiny'))
app.use(cookieParser())
app.use(cors())
dotenv.config()

//*Routes
app.use('/auth',authRoutes)

//* MongoDB Connection
const MONGO = process.env.MONGO || "mongodb://localhost/blogreal";
const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false }

mongoose.connect(MONGO,options)
        .then(() => console.log("Mongo connection successful"))
        .catch(() => console.log("Mongo connection failure"))


//* Listening Port
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))