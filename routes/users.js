var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Node-Crud' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Node-Crud' });
});

/* Database authenticate. */
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud"
});

con.connect(function(err) {
  if (err) {
    console.log("Error connecting!");
    return;
  }
  console.log("Connected!");
});

/* Login Process */
router.get('/', function(req, res_, next) {
  var username = req.query['name'];
  var password = req.query['pass'];

  if (username && password) {
    con.query('SELECT * FROM login WHERE username = ? AND password = ?', [username, password], function(err, res) {
      if (res.length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
        res_.render('profile', { title: username });
      } else {
        res_.send('Incorrect Username or Password!');
      }
    });
  } else {
    req.session.loggedin = false;
    req.session.username = username;
    res_.send('Please enter Username and Password!');
  }
});

/* Logout Process */
router.get('/logout',function(req,res){
  req.session.destroy(function(err){
    if(err){
      console.log(err);
    }
    else
    {
      res.redirect('/');
    }
  });
});

  /* Signup process */
router.get('/sign', function(req, res_) {
  var num = req.query['no1'];
  var username = req.query['name1'];
  var password = req.query['pass1'];
  con.query('INSERT INTO login (No, Username, Password) VALUES (?,?,?)', [num, username, password], function(err, res) {
    if (err) throw err;
    res_.send('Just one user added.');
  });
});

module.exports = router;