var request = require('request');
var cheerio = require('cheerio');
var Note = require('../models/Note.js');
var Article = require('../models/Article.js');

module.exports = function(app){

    app.get('/', function (req, res){
        res.redirect('/scrape');
    });

    app.get("/scrape", function(req, res) {
        request("https://longreads.com/", function(error, response, html) {
            var $ = cheerio.load(html);

            $(".grid-title").each(function(i, element) {

            var title = $(element).find("a").text();
            var summary = $(element).find("p").text();

            var link = $(element).find(".more-link").attr("href");

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

    app.get("/article/:id", function (req, res) {
        Article.findOne({"_id": req.params.id})
        .populate("note")
        .exec(function (error, doc) {
            if (error) {
              console.log(error
              );
            } else {
              res.render("notes", {result: doc});
            }
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
}
