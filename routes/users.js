const express = require('express');
const router = express.Router();
const db = require('../dbconfig/db');
const path = require('path');

// signup user
// localhost:8000/users/signup/
router.get('/signup', function (req, res) {
    res.render('signup')
});
router.post('/signup', function (req,res) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var password1 = req.body.password1;
    var password2 = req.body.password2;

    // check if password matched
    if (password1 == password2){
        password = password1
    }else{
        res.send("Password did not match")
    }
    // check if user exists in the system
    var sql = "SELECT * FROM `users` WHERE email = '"+email+"' AND password = '"+password+"'";
    db.query(sql, function (err,results, next) {
        if(results.length > 0){
            res.redirect('/users/signup/')
        }

    });


    var sql = "INSERT INTO `users`(`id`, `first_name`, `last_name`, `email`, `password`) VALUES (NULL,'"+first_name+"','"+last_name+"','"+email+"','"+password+"')";
    db.query(sql, function (err, result) {
        if(err){
            throw err;
        }
    });
    res.render('login');
});

// localhost:8000/users/login/
router.get('/login', function (req, res) {
    res.render('login')
});
router.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if(email && password){
        var sql = "SELECT * FROM `users` WHERE email = '"+email+"' AND password = '"+password+"'";
        db.query(sql, function (err,results) {
            if(results.length > 0){
                req.session.loggedin = true;
                req.session.email = email;
                res.redirect('/');
            }else{
                res.render('login', error="Incorrect username and / or password")
            }
            res.end();
        })
    }else{
        res.send("Please enter Username and Password");
        res.end();
    }

});

module.exports = router;
