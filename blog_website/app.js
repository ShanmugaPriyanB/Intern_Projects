//jshint esversion:6
//require modules
const express = require('express');
const bodyParser = require('body-parser');
const engine = require('ejs-locals');
const mongoose = require('mongoose');

//created an express server which is required above
const server = express();

//using ejs for ease
server.set('view engine', 'ejs');
server.engine('ejs', engine);

//taking input from HTML, setting paths to files to server.js
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static('public'));

//connecting the blog post to a mongoDB, remember 27017 is a default port for mongoDB
const path = require('path');

const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://bspriyan102:436QlTuOIJl5jg2t@bspprojects.c34rozm.mongodb.net/?retryWrites=true&w=majority&appName=bspProjects', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

//schema for blog post
const postSchema = {
  title: String,
  content: String,
};
//model for mongoose
const Post = mongoose.model('Post', postSchema);

//setting the webpage funtionality this is for homepage
server.get('/', function (req, res) {
  Post.find({}, function (err, posts) {
    res.render('home', {
      posts: posts,
    });
  });
});
//where the users are posting (we create a different page for it)
server.get('/compose', function (req, res) {
  res.render('compose');
});
//what after user is done writing the post? we use .post to give response to the user and redirect the user to our / (homepage)
server.post('/compose', function (req, res) {
  const post = new Post({
    //use of body-parser
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  //save the post to mongoDB
  post.save(function (err) {
    if (!err) {
      res.redirect('/');
    }
  });
});

// Dynamically make new URL's when Blog is to viewed on a separate webPage.
server.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});


//other pages of the blog website
server.get('/about', function (req, res) {
  res.render('about');
});

server.get('/contact', function (req, res) {
  res.render('contact');
});

//listening on local server | use a dynamic port when hosting on web.
server.listen(process.env.PORT || 3000, function () {
  console.log('Server started on port : http://localhost:3000');
});
