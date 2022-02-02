const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "root",
    database: "users"
})

app.post('/register', (req, res)=>{
    db.query("INSERT INTO users (username, password) VALUES (?,?)", [username, password], (err, result)=>{
        console.log(err)
    })
})

app.listen(3001, ()=>{
    console.log("server running")
})