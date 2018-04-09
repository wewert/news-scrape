const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

mongoose.Promise = Promise;

const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}))

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

const databaseUrl = 'mongodb://heroku_ctsbrs2t:st6ft1h2bpalppp53n247empv5@ds159013.mlab.com:59013/heroku_ctsbrs2t'

if (process.env.MONGODB_URI) {
  mongoose.connect(databaseUrl)
} else {
  mongoose.connect(databaseUrl)
}

const db = mongoose.connection;

db.on('error', function(err){
  console.log("Mongoose Error: ", err);
});

db.once('open', function() {
  console.log('Mongoose connection successful.')
});

require('./controllers/controller.js')(app);

app.listen(port, function(){
  console.log('Running on port: ' + port);
});
