var express = require('express')
    , http = require('http')
    , path = require('path')
    , bodyParser = require('body-parser');

var stackexchange = require('stackexchange');
var options = { version: 2.2 };
var context = new stackexchange(options);
var filter = {
  pagesize: 50,
  tagged: 'node.js',
  sort: 'activity',
  order: 'asc'
};

var app = express();
var router = express.Router();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/login.html');
});

app.get('/badges', function(req, res){
    context.tags.synonyms(filter, function(err, results){
    if (err) throw err;

    console.log(results.items);
    console.log(results.has_more);
});
});


app.get('/dashboard', function(req, res){
    res.sendFile(__dirname + '/views/dashboard.html');
});
app.get('/profile', function(req, res){
    res.sendFile(__dirname + '/views/profile.html');
});

app.get('/test1', function(req, res){
  // get tags related
  var stackexchange = require('stackexchange');
  var options = { version: 2.2 };
  var context = new stackexchange(options);
  var filter = {
    pagesize:10,
    sort: 'activity',
    order: 'desc'
  };
  var relatedTags = [];
  context.tags.related(filter, function(err, results){
    if (err) {
      res.render('questions1.ejs',{data:relatedTags})
    } else {
    for(i = 0;i<11;i++){
      relatedTags.push(results.items[i].name);
      console.log(relatedTags[i]);
    }
  }
  }, ['javascript']);
  // res.render('questions1.ejs',dataArray)
});


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
