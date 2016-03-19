var express = require('express')
    , http = require('http')
    , path = require('path')
    , bodyParser = require('body-parser')
    , mongoDb = require('mongoose');

var stackexchange = require('stackexchange');
var options = { version: 2.2 };
var context = new stackexchange(options);
var filter = {
  limit: 10,
  pagesize: 10,
  sort: 'activity',
  order: 'asc'
};

var filter_for_answering = {
  limit: 50,
  pagesize: 50,
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

// mongo connection
mongoDb.connect('mongodb://localhost/snap_stackoverflow');
var connection = mongoDb.connection;
connection.once('open', function callback() {
    console.log("DB connected successfully");
    createDbSchema();
});

var createDbSchema = function(){
    var userSchema = new mongoDb.Schema({
          userId: Number
          , userName: { type: String }
          , accountId: Number
          , questionIdsToAvoid : [Number]
          , competencyIds : [Number]
          , learningObjectiveIds : [Number]
          , learningGroupIds : [Number]
          });

    var competencySchema = new mongoDb.Schema({
        competencyId: Number
        , competencyName: {type: String}
        , score: Number
    });

    var learningObjectiveSchema = new mongoDb.Schema({
        learningObjectiveId: Number
        , learningObjectiveName: {type: String}
        , score: Number
    });

    var learningGroupSchema = new mongoDb.Schema({
        learningGroupId: Number
        , learningGroupName: {type: String}
        , content: String
    });

/* This is the code to use the schema to create a model and populate the model.
   Once the first entry is created, we could see that reflected in our local database */
    var User = mongoDb.model('User', userSchema);
    var firstUser = new User({
            userId: 1
          , userName: "testMe"
          , accountId: 1
          , questionIdsToAvoid : [100]
          , competencyIds : [1]
          , learningObjectiveIds : [1]
          , learningGroupIds : [1]
    });

    firstUser.save(function(err, firstUser) {
      if (err) return console.error(err);
      console.log(firstUser);
    });

    var Competency = mongoDb.model('Competency', competencySchema);
    var sampleCompetency = new Competency({
          competencyId: 1
        , competencyName: 'sample'
        , score : 0
    });
    sampleCompetency.save(function(err, sampleCompetency) {
      if (err) return console.error(err);
      console.log(sampleCompetency);
    });

    var LearningObjective = mongoDb.model('LearningObjective', learningObjectiveSchema);
    var sampleLearningObjective = new LearningObjective({
          LearningObjectiveId: 1
        , LearningObjectiveName: 'sample'
        , score : 0
    });
    sampleLearningObjective.save(function(err, sampleLearningObjective) {
      if (err) return console.error(err);
      console.log(sampleLearningObjective);
    });

    var LearningGroup = mongoDb.model('LearningGroup', learningGroupSchema);
    var sampleLearningGroup = new LearningGroup({
          LearningGroupId: 1
        , LearningGroupName: 'sample'
        , content : "content"
    });
    sampleLearningGroup.save(function(err, sampleLearningGroup) {
      if (err) return console.error(err);
      console.log(sampleLearningGroup);
    });
};

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/login.html');
});

app.get('/what-to-answer', function(req, res){
    var relatedTags = [];
    context.tags.related(filter_for_tags, function(err, results){
    if (err) {
              var data = [];
              context.tags.faq(filter_for_answering, function(err, results){
              if (err) {
                  res.json(data);
              } else {
                  for(i = 0; i < 51; i++) {
                  if(results.items[i].answer_count <= 2) {
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
  }, ['jquery']);
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

app.get('/dashboard', function(req, res){
    res.sendFile(__dirname + '/views/dashboard.html');
});
app.get('/profile', function(req, res){
    res.sendFile(__dirname + '/views/graph.html');
});


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
