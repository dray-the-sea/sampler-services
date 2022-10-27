const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const moment = require('moment')

const app = express();
const port = 3000;


const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'sampler-db'
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.use(bodyParser.json());
app.post('/user/', function(req, res) {
  let sql = `INSERT INTO users(email, username, passcode, created) VALUES (?)`;
  let values = [
    req.body.email,
    req.body.username,
    req.body.passcode,  
    moment().format('YYYY-MM-DD, hh:mm:ss')
  ];
    console.log("query: ", sql)
  
  connection.query(sql, [values], function(err) {
    if (err) {
      console.log(err)
      res.json({
        status: 500,
        message: "Something went terribly wrong with your query; please check logs."
      })
    } 
    res.json({
      status: 200,
      message: "New user added successfully"
    })
  })
});

app.get('/user/:username/', (req, res) => {
  username = req.params.username
  if (username)
  {
    let sql = `SELECT * FROM users WHERE username=?;`
    console.log("query: ", sql)

    return connection.query(sql, [username], function(err, results){
      if (err) {
        console.log(err)
        res.json({
          status: 500,
          message: "Something went terribly wrong with your query; please check logs."
        })
      } 
      console.log("response: ", results);
      res.json(results);
    })
  }
  res.json({
    status: 400,
    message: "Bad request; missing user ID."
  })
})

app.use(bodyParser.json());
app.post('/user/:userId/observation', function(req, res) {
  let sql = `INSERT INTO observations(user, feeling, company, activity, created) VALUES (?)`;
  console.log("query: ", sql)
  
  let values = [
    req.params.userId,
    req.body.feeling,
    req.body.company, 
    req.body.activity,
    moment().format('YYYY-MM-DD, hh:mm:ss')
  ];
  
  connection.query(sql, [values], function(err) {
    if (err) {
      console.log(err)
      res.json({
        status: 500,
        message: "Something went terribly wrong with your query; please check logs."
      })
      
    } 
    res.json({
      status: 200,
      message: "New observation added successfully"
    })
  })
});


app.get('/user/:userId/observations', (req, res) => {
  userId = req.params.userId
  if (userId)
  {
    let sql = `SELECT * FROM observations WHERE user="${userId}";`
    console.log("query: ", sql)

    return connection.query(sql, function(err, results){  
      if (err) {
        console.log(err)
        res.json({
          status: 500,
          message: "Something went terribly wrong with your query; please check logs."
        })
      } 
      console.log("response: ", results);
      res.json(results);
    })
  }
  res.json({
    status: 400,
    message: "Bad request; missing user ID."
  })
})
