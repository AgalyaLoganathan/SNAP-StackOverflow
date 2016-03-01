var express = require('express')
    , http = require('http')
    , path = require('path')
    , bodyParser = require('body-parser');

var stackexchange = require('stackexchange');
var options = { version: 2.2 };
var context = new stackexchange(options);
var filter = {
  limit: 10,
  pagesize: 10,
  sort: 'activity',
  order: 'asc'
};

var filter_for_tags = {
  limit: 10,
  pagesize: 3,
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

app.get('/what-to-learn', function(req, res){
    var relatedTags = [];
    context.tags.related(filter_for_tags, function(err, results){
    if (err) {
              var data = [];
              context.tags.faq(filter, function(err, results){
              if (err) {
                  res.json(data);
              } else {
              for(i = 0; i < 11; i++) {
                  if(results.items[i].is_answered == true) {
                  var d = {'id': i,
                          'link': results.items[i].link,
                          'question': results.items[i].title,
                          'tags': results.items[i].tags};
                  data.push(d);
                  }
              }
          }
          }, relatedTags);
} else {
    for(i = 0;i<4;i++){
      // Fetch 3 related tags; more than this wouldn't give proper results since tags are diverse
      relatedTags.push(results.items[i].name);
    }
  }
  }, ['android']);
});

app.get('/profile', function(req, res){
    res.sendFile(__dirname + '/views/dashboard.html');
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
