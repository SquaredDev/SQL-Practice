const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const config = require('config')
const mysql = require('mysql');

const conn = mysql.createConnection({
  host: config.get('db.host'),
  user: config.get('db.user'),
  password: config.get('db.password'),
  database: config.get('db.database')
})

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.static(path.join(__dirname, 'static')))

app.post("/", function(req,res,next) {
  const fname = req.body.fname
  const lname = req.body.lname
  const nickname = req.body.nickname
  const email = req.body.email

  const sql = `
    INSERT INTO students (fname, lname, nickname, email)
    VALUES ('${fname}', '${lname}', '${nickname}', '${email}')
  `

  conn.query(sql, function(err, results, fields) {
    if (!err) {
      res.redirect("/")
    } else {
      res.send("error")
    }
  })
})

app.get("/", function(req, res, next){
  res.render("index", {appType:"Express"})
})

app.listen(3000, function(){
  console.log("App running on port 3000")
})
