const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'sampler-db'
})


module.exports = {
  findUser: function (userId) {
    userquery = `SELECT * FROM users WHERE id="${userId}";`

    console.log('User ID is: ', userId)
    console.log('Query is: ', userquery)
    result = query(userquery)

    return result
  }
};



function query(queryString){
 // connection.connect()
  return connection.query(queryString, function(error, results){
    console.log("query response is ", results);
  })

  //connection.end()
}


