const express = require('express');
var session = require('express-session');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');

var app = express();
const userRoute = require('./routes/users');

app.set('view engine', 'hbs');//instead of app.engine('handlebars', handlebars({
app.engine('hbs', hbs({layoutsDir: __dirname + '/views/layouts', extname: 'hbs'}));
app.use(express.static(__dirname + '/public'));

app.use(session({
    // key: 'user_sid',
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie:{maxAge:70000}
}));

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
// app.use(upload.array());
app.use(express.static('public'));

// app.use((req, res, next) => {
//     if (req.cookies.user_sid && !req.session.user) {
//         res.clearCookie('user_sid');
//     }
//     next();
// });
// routes
app.get('/', function (req, res) {http://localhost:8000/
    console.log(req.session.loggedin =='undefined');
    res.render('index')
});
// localhost:8000/users/
app.use('/users', userRoute);


app.listen(8000, function () {
    console.log("SERVER RUNNING ON PORT 8000")
});
