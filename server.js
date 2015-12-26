

    // --- Set up ---
    var express  = require('express');
    var app      = express();                          // Create app w/ express
    var mongoose = require('mongoose');                // Mongoose for mongodb
    var morgan = require('morgan');                    // Log requests to the console (express4)
    var bodyParser = require('body-parser');           // Pull information from HTML POST (express4)
    var methodOverride = require('method-override');   // Simulate DELETE and PUT (express4)
    var request = require('request');                  // To get HTML code of website
    var cheerio = require('cheerio');                  // Provides jQuery functionality

    // --- Configuration ---
    mongoose.connect('mongodb://localhost/test');
    //mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');  // Connect to mongoDB database on modulus.io

    var __dirname = '/Users/georgewee/documents/posturlsapp';

    app.use(express.static(__dirname));                             // Set the static files location
    app.use(morgan('dev'));                                         // Log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // Parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // Parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // Parse application/vnd.api+json as json
    app.use(methodOverride());

    // --- Define model ---
    var PostURL = mongoose.model('PostURL', {
        text : String
      , title: String
    });

    // --- Routes and API ---
    // Get all posts
    app.get('/api/posturls', function(req, res) {
        // Use mongoose to get all posts in the database
        PostURL.find(function(err, weblinks) {
            // If there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);
            res.json(weblinks); // return all posts in JSON format
        });  //  PostURL.find()...
    });  //  app.get()...

    // Create post and send back all posts after creation
    app.post('/api/posturls', function(req, res) {
      var title ="";
      url = req.body.text;

      request(url, function(error, response, html){
         if(!error){
            // Utilize cheerio library on the returned html which gives jQuery functionality
            var $ = cheerio.load(html);
            // Define variables to capture
            $('title').filter(function() {
               title = $(this).text();

               // Create a post, information comes from AJAX request from Angular
               PostURL.create({
                   text : req.body.text
                 , title:title
                 , done : false
               }, function(err, weblink) {
                   if (err)
                       res.send(err);
                   PostURL.find(function(err, weblinks) {
                       if (err)
                           res.send(err)
                       res.json(weblinks);
                   });  //  PostURL.find()...
               });  //  PostURL.create()...
            });  // $('title').filter()...
         }  //  if(!error)...
      });  //  request()...
    });  //  app.post()...

    // Delete a post
    app.delete('/api/posturls/:posturl_id', function(req, res) {
        PostURL.remove({
            _id : req.params.posturl_id
        }, function(err, weblink) {
            if (err)
                res.send(err);
            // get and return all the posts after you create another
            PostURL.find(function(err, weblinks) {
                if (err)
                    res.send(err)
                res.json(weblinks);
            });  //  PostURL.find()...
        });  //  PostURL.remove()...
    });  //  app.delete()...

    // --- Application ---
    app.get('*', function(req, res) {
        res.sendfile(path.join(__dirname + '/index.html')); // load the single view file (angular will handle the page changes on the front-end)
    });

    // Listen (start app with node server.js)
    app.listen(8080);
    console.log("App listening on port 8080");
