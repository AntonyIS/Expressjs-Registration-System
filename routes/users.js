const express = require('express');
const router = express.Router();
const db = require('../dbconfig/db');
const path = require('path');
const bycrypt = require('bcrypt');

// signup user
// localhost:8000/users/signup/
router.get('/signup', function (req, res) {
    res.render('signup')
});
router.post('/signup', function (req,res, next) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var password1 = req.body.password1;
    var password2 = req.body.password2;

    // check if password matched
    if (password1 == password2){
        password =  bycrypt.hash(password1, 10,function (err,hash) {
            password = hash
            console.log(password)
        });

    }else{
        res.send("Password did not match")
    }
    // check if user exists in the system
    var sql = "SELECT * FROM `users` WHERE email = '"+email+"' AND password = '"+ password+"'";
    db.query(sql, function (err,results, next) {
        if(!results.length > 0){
            var query = "INSERT INTO `users`(`id`, `first_name`, `last_name`, `email`, `password`) VALUES (NULL,'"+first_name+"','"+last_name+"','"+email+"','"+password+"')";
            db.query(query, function (err, result) {
                if(err){
                    throw err;
                }else{
                    res.render('login');
                }
            });
        }else{
            message = "User already exists, login ";
            res.render('login', {message:message})
        }

    });




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
            if(!results.length > 0){
                error="Incorrect username and / or password";
                res.render('login',{message:error} )
            }
            req.session.loggedin = true;
            req.session.email = email;
            // res.locals.user = req.session.loggedin ;
            res.redirect('/');
        })
    }else{
        var message = "Please fill in all fields";
        res.render('login',{message:message})
    }

});


router.get('/logout', function (req, res, next) {
    if(req.session){
        req.session.destroy(function (err) {
            if(err){
                throw err;
            }else{
                res.redirect('/')
            }
        })
    }
});
module.exports = router;
