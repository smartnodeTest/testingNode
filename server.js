const express = require('express');
const bodyParser = require('body-parser');
const registerUser = require('./routes/registerUser.route');
const user = require('./routes/user.route');
const sync = require('./routes/sync.route');
const mongoose = require('mongoose');
const config = require('./config/config');
const router = require('./router');
const oauth2 = require('simple-oauth2').create(config.OAuth2credentials);
const expressValidator = require('express-validator');

const app = express();

mongoose.connect(config.db.mongodb, function(err) {
    if (err) 
    {
        console.log("DB not connected");
    }
    else
    {
        console.log("DB connected");
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());

app.get('/test', function(req, res){

   console.log("Request Received !!! ");
   res.json({
      "Message": "Welcome to SmartNode !!"
   });
});

// Import routes to be served
router(app);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

app.listen(config.server.port, function(){
   console.log('Server is running on Port : ',config.server.port);
});