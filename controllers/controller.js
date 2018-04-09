const request = require('request');
const cheerio = require('cheerio');
const Note = require('../models/Note.js');
const Article = require('../models/Article.js');
// const db = require("./models");

module.exports = function(app){

    app.get('/', function (req, res){
        res.redirect('/scrape');
    });

    app.get("/scrape", function(req, res) {
        request("https://longreads.com/", function(error, response, html) {
            var $ = cheerio.load(html);

            $("article").each(function(i, element) {

            var title = $(element).find("a").text();
            var summary = $(element).find("p").text();
            var link = $(element).find("a").attr("href");

            if (title && summary && link) {
                var result = { title, summary, link };

                Article.create(result, function(err, data) {
                    if (err){
                        console.log(err);
                    } else {
                        console.log(data);
                    };
                });
            };
            });

        });
        res.send("Scrape Complete");
        });

    app.get("/articles", function(req, res) {
        Article.find({}, function (err, data) {
            if (err) {
                console.log("Error")
            } else {
                res.render("index", {result: data});
            }
        })
        .sort({'_id': -1})
    });

    // Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(Article) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(Article);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

  app.post("/articles/:id", function (req, res) {
    Note.create(req.body, function (error, doc) {

        if (error) {
          console.log(error);
        } else {
          console.log(doc.id)
          Article.findOneAndUpdate({
            "_id": req.params.id
          }, {
            $push: {
              "note": doc._id
            }
          }, {

            new: true
          })
            .exec(function (err, doc) {
              if (err) {
                console.log(err);
              } else {
                res.redirect('back');
              }
            });
        }
      });
  });

  app.get("/delete/:id", function(req, res) {
  // Remove a note using the objectID
  db.Article.update(
    {  _id: req.params.id },
    { $unset: {note: "" }})
  .then(function(error, removed) {
    // Log any errors from mongojs
    if (error) {
      console.log(error);
      res.send(error);
    }
    // Otherwise, send the mongojs response to the browser
    else {
      console.log(removed);
      res.send(removed);
    }
  });
});

}
