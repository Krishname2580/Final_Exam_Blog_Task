require('dotenv').config()
const express = require('express')
const path = require('path')
const dbConnection = require('./app/config/dbcon')
const cors = require('cors')
const cookieParser=require('cookie-parser')


const app = express()
dbConnection()

app.use(cookieParser())


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())


const userAuthRoute = require('./app/routes/userAuthRoute')
app.use('/api', userAuthRoute)

const postRoute = require('./app/routes/postRoute')
app.use('/api', postRoute)

const categoryRoute = require('./app/routes/categoryRoute')
app.use('/api', categoryRoute)

const commentRoute = require('./app/routes/commentRoute')
app.use('/api', commentRoute)

const userRoute = require('./app/routes/userRoute')
app.use('/api', userRoute)


const PORT = 5005;
app.listen(PORT, () => {
    console.log(`Sever is running on the Port ${PORT}`);

})