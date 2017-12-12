var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path=require('path');
const config =  require('./routes/config.js');
app.set('view engine', 'ejs')
express = require('express');
var session = require('express-session');
app.use(session({secret: 'ssshhhhh'}));

// express valdation
var expressValidator = require('express-validator');

app.use(expressValidator());
app.use(express.static(__dirname + '/public'));


// parse body request
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



var flash = require('connect-flash');
app.use(flash());



app.use(function(req,res,next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.errors = req.flash('error');
  res.locals.users = req.user || null;
  res.locals.output= {};
  res.locals.userType="";
  res.locals.address="";
  res.locals.transactionsList={};
  if(req.session.user)
  res.locals.userType=req.session.user.userType;
  else
  res.locals.userType="";
  next();
  });



var front = require('./routes/front.js');
app.use('/',front);


app.listen(config.serveport, function() {
    console.log(`[+] Listening ${config.serveport}`);
  })  // Start App Listener

module.exports = app;
  