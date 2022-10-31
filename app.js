const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const moment = require('moment')
var methodOverride = require('method-override');

const app = express();
const port = 3000;

const credentials = {
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'sampler-db'
}
const connection = mysql.createConnection(credentials)



app.listen(port, () => {
  console.log(`Sampler Services listening on port ${port}`)
})

/* User Section */

app.use(bodyParser.json({ extended: true }));
app.use(methodOverride());
app.use(function(err, req, res, next) { res.status(400).send({
  status: 400,
  message: "Something might be wrong with the request."
});});
app.post('/user/', function(req, res) {
  let sql = `INSERT INTO users(email, username, passcode, created) VALUES (?)`;
  let values = [
    req.body.email,
    req.body.username,
    req.body.passcode,  
    moment().format('YYYY-MM-DD, hh:mm:ss')
  ];
  
  connection.query(sql, [values], function(err, results) {
    console.log("query: ", sql)
    if (err) {
      console.log(err)
      res.json({
        status: 500,
        message: "Something went terribly wrong with your query; please check logs."
      })
    } 
    console.log("results: ", results)
    res.json({
      status: 200,
      message: "New user added successfully", 
      id: results.insertId
    })
  })
});

app.use(methodOverride());
app.use(function(err, req, res, next) { res.status(400).send({
  status: 400,
  message: "Something might be wrong with the request."
});});
app.get('/user/:username/', (req, res) => {
  username = req.params.username
  if (username)
  {
    let sql = `SELECT * FROM users WHERE username=?;`

    return connection.query(sql, [username], function(err, results){
      console.log("query: ", sql, " ", username)
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

app.use(methodOverride());
app.use(function(err, req, res, next) { res.status(400).send({
  status: 400,
  message: "Something might be wrong with the request."
});});
app.delete('/user/:userId/', (req, res) => {
  userId = req.params.userId
  console.log("user id is ", userId)
  if (userId)
  {
    let sql = `DELETE FROM users WHERE userid = ?;`

    connection.query(sql, [userId], function(err, results) {
      console.log("query: ", sql, " ", userId)
      if (err) {
        console.log(err)
        res.json({
          status: 500,
          message: "Something went terribly wrong with your query; please check logs."
        })
      }
      console.log("response: ", results);
      res.json({
        status: 200,
        message: "User deleted successfully"
      })
    })
    
  } else {

    res.json({
      status: 400,
      message: "Bad request; missing user ID."
    })
  }
})

/* Observation Section */

app.use(bodyParser.json({ extended: true }));
app.use(methodOverride());
app.use(function(err, req, res, next) { res.status(400).send({
  status: 400,
  message: "Something might be wrong with the request."
});});
app.post('/user/:userId/observation', function(req, res) {
  let sql = `INSERT INTO observations(userid, feeling, company, activity, created) VALUES (?)`;
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


app.use(methodOverride());
app.use(function(err, req, res, next) { res.status(400).send({
  status: 400,
  message: "Something might be wrong with the request."
});});
app.get('/user/:userId/observations', (req, res) => {
  userId = req.params.userId
  if (userId)
  {
    let sql = `SELECT * FROM observations WHERE userid="${userId}";`
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
