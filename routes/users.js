var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var _ = require("lodash"); // lodash code

/* GET users listing. */
router.get('/login', function(req, res) {
  res.render('login', { title: 'Node-Crud' });
});

router.get('/signup', function(req, res) { // View
    con.query('SELECT * FROM login',function (err,rows) {
        if (err) throw err;
        res.render('signup', { title: 'Node-Crud' , users: rows });
    })
});

router.get('/edit/:no', function(req, res) {
    var num = req.params.no;
    con.query('SELECT * FROM login WHERE No = ?', [num], function(err, rows) {
        if (err) throw err;
        res.render('edit', { title: 'Node-Crud' , usersdata: rows [0] });
    })
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
router.get('/', function(req, res_) {
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
router.get('/logout',function(req, res){
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
router.get('/sign', function(req, res) {
  var num = req.query['no1'];
  var username = req.query['name1'];
  var password = req.query['pass1'];

  if (!(num.length && username.length && password.length)) /*Validation*/ {
            res.redirect('/users/signup');
    } else {
            con.query('INSERT INTO login (No, Username, Password) VALUES (?,?,?)', [num, username, password], function(err) {
            if (err) throw err;
            res.redirect('/users/signup');
      });
    }
});


/* Delete process */
router.get('/del/:no', function(req, res) {
    var num = req.params.no;
    con.query('DELETE FROM login WHERE No = ?', [num], function(err) {
        if (err) throw err;
        res.redirect('/users/signup');
    });

});

/* Update process */
router.get('/edi/:no', function(req, res_) {
    var no = req.params.no;
    var username = req.query['name1'];
    var password = req.query['pass1'];
    con.query('UPDATE login SET Username = ? , Password = ? Where No = ?', [username ,password, no], function(err) {
        if (err) throw err;
        res_.redirect('/users/signup');
    });

});

module.exports = router;