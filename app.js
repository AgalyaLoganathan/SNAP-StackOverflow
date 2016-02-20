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


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

