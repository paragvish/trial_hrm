require('dotenv').config()
const mongoose = require('mongoose')
console.log('Connecting to database %s', process.env.DB_URL)
mongoose
.connect(process.env.DB_URL)
.then(() => console.log('Database connected successfully.'))
.catch((err) => console.log('Error occured while connecting database', err.message))
