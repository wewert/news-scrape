var express = require("express");
var exphbs = require('express-handlebars');
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

mongoose.Promise = Promise;

var app = express();
var port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}))

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

var databaseUrl = 'mongodb://localhost/news-scraperDB'

if (process.env.MONGODB_URI) {
  mongoose.connect(databaseUrl)
} else {
  mongoose.connect(databaseUrl)
}

var db = mongoose.connection;

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

// var databaseUri = 'mongodb://localhost/news-scrape';
//
// if(process.env.MONGODB_URI) {
//   mongoose.connect(process.env.MONGODB_URI);
// } else {
//   mongoose.connect(databaseUri);
// }
//
// var db = mongoose.connection;
//
// db.on('error', function(err) {
//   console.log('Mongoose Error: ', err);
// });
//
// db.once('open', function() {
//   console.log('Mongoose connection successful.');
// });
//
//
// app.get("/scrape", function(req, res) {
//   request("https://longreads.com/", function(error, response, html) {
//     var $ = cheerio.load(html);
//     $(".grid-article").each(function(i, element) {
//       var result = {};
//       result.title = $(this).children("a").text();
//       result.link = $(this).children("a").attr("href");
//       var entry = new Article(result);
//       console.log(entry);
//       entry.save(function(err, doc) {
//         if (err) {
//           console.log(err);
//         }
//         else {
//           console.log(doc);
//         }
//       });
//
//     });
//   });
//   res.send("Scrape Complete");
// });
