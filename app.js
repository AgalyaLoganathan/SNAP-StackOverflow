var express = require('express')
    , http = require('http')
    , path = require('path')
    , bodyParser = require('body-parser');

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
    res.render('index.ejs');
});
app.post('/dashboard', function(req, res){
    res.render('dashboard.ejs', {'name': req.body.name});
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
