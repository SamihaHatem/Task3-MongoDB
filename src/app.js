const express=require('express')
require('dotenv').config()
const app=express()
const port=process.env.PORT
require('./db/mongoose')
app.use(express.json())

const Reporter=require('./Routers/Reporter')
app.use(Reporter)

const News=require('./Routers/News')
app.use(News)

app.listen(port,()=>console.log('Running ....'))