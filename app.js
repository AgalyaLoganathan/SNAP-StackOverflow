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

var app = express();
var router = express.Router();

// all environments
app.use(express.static(__dirname + '/public'))
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

app.get('/get-tags', function(req, res) {

});

app.get('/did-you-know', function(req, res){
    var data = [];
    context.tags.faq(filter, function(err, results){
    if (err) {
        res.render('questions.ejs', {data: data});
    } else {
    for(i = 0; i < 11; i++) {
        if(results.items[i].is_answered == true) {
        console.log(results.items[i].link);
        console.log(results.items[i].title);
        var d = {'id': i,
                'link': results.items[i].link,
                'title': results.items[i].title,
                'tags': results.items[i].tags};
        data.push(d);
        console.log(data.length);
        }
    }
}
}, ['java']);
});

app.get('/dashboard', function(req, res){
    console.log("inside server function");
    var questions_to_answer = [
    {
      id:1,
      question:'Test quetsion',
      tags:['Test-tag'],
      link:'http://stackoverflow.com/questions/18539711/input-widths-on-bootstrap-3'
    }];
    res.json(questions_to_answer);
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
