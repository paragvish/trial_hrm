require('./dbconfig/dbconfig')
require('dotenv').config()
const express = require('express')
const app = express()



app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/' , (req,res)=>{
    res.status(200).send({message:"Trial"})
})
require('./src/router/userRouter')(app)
app.listen(process.env.PORT , ()=>{
    console.log(`server has started :${process.env.PORT}`)
})

module.exports = app