const express = require('express')
const routes = require('./src/routes')
// const bodyParser = require('body-parser')
const path = require('path')

const envRealPath = path.resolve(__dirname, '.env')
require('dotenv').config( {path: envRealPath} )

const app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
});

app.use(routes)

app.listen(process.env.PORT, () => {
    console.log(`>>> Server starts on http://localhost:${process.env.PORT}`)
})
.on('error', error => console.warn(error))
