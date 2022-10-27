const express = require('express')
const app = express()
const port = 3000

const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'sampler-db'
})

//var app_db = require('./src/app-db');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.post('/user/:userId/', (req, res) => {

})

app.get('/user/:username/', (req, res) => {
  username = req.params.username
  if (username)
  {
    return connection.query(`SELECT * FROM users WHERE username="${username}";`, function(error, results){
      console.log("query response is ", results);
      res.json(results);
    })
  }
  res.send(`no username in request`)
})

app.get('/observations/:userId/', (req, res) => {
  userId = req.params.userId
  if (userId)
  {
    return connection.query(`SELECT * FROM observations WHERE user="${userId}";`, function(error, results){
      console.log("query response is ", results);
      res.json(results);
    })
  }
  res.send(`no username in request`)
})

app.post('/user/:username/observation', function(req, res) {
  let sql = `INSERT INTO observtions(user, feeling, company, activity, created) VALUES (?)`;
  let values = [
    req.params.userId,
    req.body.feeling,
    req.body.company, 
    req.body.activity,
    Date.now
  ];
  
  connection.query(sql, [values], function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "New observation added successfully"
    })
  })
});