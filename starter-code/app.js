const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require("mongoose"); // añadido por marc
const app = express();
const expressLayouts = require('express-ejs-layouts'); // para incluir layouts (añadido por marc)
const session = require("express-session"); //añadido por marc
const MongoStore = require("connect-mongo")(session); //añadido por marc


const index = require('./routes/index');
const users = require('./routes/users');
const authController = require('./routes/authController');// añadido por marc

// Mongoose configuration (añadido por marc)
mongoose.connect("mongodb://localhost/linkedin-exercice");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ...other code (añadido por marc)
app.use(expressLayouts);
app.set("layout", "layouts/main-layout");
app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', authController); // añadido por marc
app.use('/users', users);

//descomentar esta seccion y borrar este comentario cuando este funcionando correctament todo!!!!!!!
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
