var express = require('express')
    , http = require('http')
    , path = require('path')
    , bodyParser = require('body-parser')
    , _ = require('underscore')
    , mongoDb = require('mongoose')
    , session = require('express-session');
var stackexchange = require('stackexchange');
var options = { version: 2.2 };
var context = new stackexchange(options);
var filter = {
  key: 'zENiiAyyY12j)fYECBVEbw((',
  limit: 50,
  pagesize: 5,
  sort: 'activity',
  order: 'asc'
};

var filter_for_answering = {
  key: 'zENiiAyyY12j)fYECBVEbw((',
  limit: 50,
  pagesize: 50,
  sort: 'activity',
  order: 'asc'
};

var filter_for_tags = {
  key: 'zENiiAyyY12j)fYECBVEbw((',
  limit: 50,
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
app.use(session({secret: '1234567890QWERTY'}));

// mongo connection
mongoDb.connect('mongodb://localhost/snap_stackoverflow');
var connection = mongoDb.connection;
var userSchema = new mongoDb.Schema({
  userId: Number,
  userName: { type: String },
  accountId: Number,
  questionIdsToAvoid : [Number],
  learningGroupIds : [Number],
  competencies: [{competencyId: Number, score: Number}]
});

var competencySchema = new mongoDb.Schema({
  competencyId: Number,
  competencyName: {type: String}
});

var auth = new mongoDb.Schema({
  username:String,
  password:String
});

var expertNotificationSchema = new mongoDb.Schema({
  expertName: {type: String},
  questionId: Number,
  question: {type: String},
  link: {type: String},
  tags: [String],
  personWhoAsked: {type: String}
});

var learningGroupSchema = new mongoDb.Schema({
  userName: {type: String}, // req.sessio.
  learningGroup: {type: String}, // extract from html
  verifiedBy: {type: String}, // ""
  isVerified: {type: Boolean}, // false
  post: {type: String}, // text - that comes from the form
});

/*var learningObjectiveSchema = new mongoDb.Schema({
    learningObjectiveId: Number
    , learningObjectiveName: {type: String}
    , score: Number
}, {strict: false});

var learningGroupSchema = new mongoDb.Schema({
    learningGroupId: Number
    , learningGroupName: {type: String}
    , content: String
}, {strict: false});*/

var User = mongoDb.model('User', userSchema);
var Competency = mongoDb.model('Competency', competencySchema);
//var LearningObjective = mongoDb.model('LearningObjective', learningObjectiveSchema);
//var LearningGroup = mongoDb.model('LearningGroup', learningGroupSchema);
var ExpertNotification = mongoDb.model('ExpertNotification', expertNotificationSchema);
var LearningGroup = mongoDb.model('LearningGroup', learningGroupSchema);

var createDbSchema = function(){
/* This is the code to use the schema to create a model and populate the model.
   Once the first entry is created, we could see that reflected in our local database */
   /*
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

    var sampleCompetency = new Competency({
          competencyId: 1
        , competencyName: 'sample'
        , score : 0
    });
    sampleCompetency.save(function(err, sampleCompetency) {
      if (err) return console.error(err);
      console.log(sampleCompetency);
    });

    var sampleLearningObjective = new LearningObjective({
          LearningObjectiveId: 1
        , LearningObjectiveName: 'sample'
        , score : 0
    });
    sampleLearningObjective.save(function(err, sampleLearningObjective) {
      if (err) return console.error(err);
      console.log(sampleLearningObjective);
    });


    var sampleLearningGroup = new LearningGroup({
          LearningGroupId: 1
        , LearningGroupName: 'sample'
        , content : "content"
    });
    sampleLearningGroup.save(function(err, sampleLearningGroup) {
      if (err) return console.error(err);
      console.log(sampleLearningGroup);
    });*/
};

// var secret = 'SessionSecret';

app.get('/', function(req, res){
  if(req.session.user_id)
    res.sendFile(__dirname + '/views/dashboard.html');
  else
    res.sendFile(__dirname + '/views/home.html');
});

app.get('/login', function(req, res){
  if(req.session.user_id)
    res.sendFile(__dirname + '/views/dashboard.html');
  else
    res.render('login.ejs', {message:'Login'});
});

app.post('/login', function(req, res){
  var post = req.body;
  var username = post.username;
  var password = post.password;
  var Auth = mongoDb.model('Auth', auth);
  Auth.findOne({"username":username,"password":password}, function(err, user){
    if(err) {
      res.render('login.ejs', {message:'Server error. Try again.'});
    }
    if(user) {
      req.session.user_id = username;
      res.redirect('/dashboard');
    }
    else {
      res.render('login.ejs', {message:'Incorrect user name or password.'});
    }
  });
});

app.get('/signup', function(req, res){
  if(req.session.user_id)
    res.sendFile(__dirname + '/views/dashboard.html');
  else
    res.render('signup.ejs', {message:'Signup'});
});

app.post('/signup', function(req, res){
  var post = req.body;
  var username = post.username;
  var password = post.password;
  var Auth = mongoDb.model('Auth', auth);

  Auth.findOne({"username":username}, function(err, user){
    if(err) {
      res.render('signup.ejs', {message:'Server error. Try again.'});
    }
    if(user == null) {
      var toInsert = new Auth({
        "username":username,
        "password":password
      });
      var initUser = new User({
        "userId": 1,
        "userName": username,
        "accountId": 1,
        "questionIdsToAvoid": [],
        "learningGroupIds": [],
        "competencies": []
      });

      initUser.save(function(err){
        if(err) {
          res.render('signup.ejs', {message:'Server error. Try again.'});
        }
      });
      toInsert.save(function(err){
        if(err) {
          res.render('signup.ejs', {message:'Server error. Try again.'});
        }
      });
      res.render('login.ejs', {message:'Sign up successful. Login now.'});
    }
    else {
      res.render('signup.ejs', {message:'User name is already taken. Try something else.'});
    }
  });
})

app.post('/updateCompetency', function(req, res){
  var tags = req.body;
  var username = req.session.user_id;
  User.findOne({'userName': username}, function(err, user){
      Competency.find({"competencyName": {$in:tags}}, function(err, competency){
        if(err) {
          res.sendFile(__dirname + '/views/dashboard.html');
        }
        var s;
        var userCompetencies = user.competencies;
        for(var i=0; i<competency.length; i++) {
          var id = competency[i].competencyId;
          s = 0;
          var j;
          for(j=0; j<userCompetencies.length; j++) {
            if(userCompetencies[j].competencyId == competency[i].competencyId) {
              s = 1;
              break;
            }
          }
          if(s == 0) {
            user.competencies.push({"competencyId":id, "score":1});
          } else {
            var score = user.competencies[j].score;
            if(score == 100) {
              // do nothing
            } else {
              user.competencies[j].score = score+1;
            }
          }
          user.save(function(err, user) {
              if (err) return console.error(err);
          });
      }
    });
  });
});

/* app.post('/updateLearningObjective', function(req, res){
    var tags = req.body;
    LearningObjective.find({'userId': 1}, function(err, results){
        _.each(results, function(learningObjective) {
          if(_.contains(tags, learningObjective['learningObjectiveName'])) {
              learningObjective['score'] = learningObjective['score'] + 1;
              learningObjective.save(function(err, learningObjective) {
              if (err) return console.error(err);
          });
        };
        });
    });
}); */

app.get('/getExperts', function(req, res){
  var results = [{'userId': 1,
            'userName': 'web-dev'},
              {'userId': 2,
            'userName': 'tinylx'},
            {'userId': 3,
            'userName': 'Termininja'},
            {'userId': 4,
            'userName': 'alogana1@asu.edu'}];
  res.json(results);
  // var tags = req.body;
  // var competencyDetails = Competency.find(
  //             {'competencyName' : { $in: [tags] } }
  //             );
  // console.log("competency " +competencyDetails);
  // var competencyIds = _.each(competencyDetails, function(competency){
  //     return competency['competencyId']
  // });

  // User.find(function(err, userDetails){
  //   var experts= [];
  //   _.each(userDetails, function(userDetail){
  //     var userCompetencies = userDetail['competencies'];
  //     if(_.contains(competencyIds, userCompetencies['competencyId'])){
  //         if(userCompetencies['score'] > 50) {
  //             experts.add(userDetail);
  //         }
  //     }
  //   });
  //   return experts;
  // });
});

app.get('/getPosts', function(req, res){
  //var learningGroup = req.body;
  var learningGroup = 'Java';
  LearningGroup.find({learningGroup: learningGroup}, function(err,learningGroupDetails){
   res.json(learningGroupDetails);
  });
});


app.get('/did-you-know', function(req, res){
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
}, ['andriod']);
});

app.post('/notifyExperts', function(req, res){
  var experts = req.body;


  _.each(experts['experts'], function(expertName){
      var note = new ExpertNotification({
      expertName: expertName,
      questionId: experts['question'].questionId,
      question: experts['question'].question,
      link: experts['question'].link,
      tags: experts['question'].tags,
      personWhoAsked: req.session.user_id});
      note.save(function(err){
        if(err) {
          console.log("Error saving notifications");
          res.sendStatus(500);
        } else {
          console.log("Saved");
        }
      });
  });
});

app.get('/listExpertNotifications', function(req, res){
    var expertName = req.session.user_id;
    ExpertNotification.find({'expertName': expertName}, function(err, notifications){
      if(err) {
        res.render('login.ejs');
      } else {
        res.json(notifications);
      }
    })
});

app.post('/postComment', function(req, res){
  var userPost = req.body;
  console.log(userPost);
  console.log(userPost['post'] + userPost['learningGroup']);

  //  _.each(userPost['post'], function(){
      var note = new LearningGroup({
      post: userPost['post'],
      userName: req.session.user_id,
      learningGroup:userPost['learningGroup'], // extract from html
      verifiedBy: '', // ""
      isVerified: false, // false;'
  });
      console.log(note);
      note.save(function(err){
        if(err) {
          console.log("Error saving user post");
          res.sendStatus(500);
        } else {
          console.log("Saved");
        }
      });
  // });
});

app.post('/updateQuestionStatus', function(req, res){
    var question_id = req.body;
    var id = parseInt(question_id['question_id']);

    User.findOne({'userId' : 1}, function(err, user){
              user['questionIdsToAvoid'].push(id);
              user.save(function(err, user) {
              if (err) return console.error(err);
          });
        });
});

app.get('/what-to-answer', function(req, res){
    var relatedTags = ['chef'];
              var data = [];
              context.tags.faq(filter_for_answering, function(err, results){
              if (err) {
                  res.json(data);
              } else {
                  for(i = 0; i < 51; i++) {
                  if(results.items[i].answer_count <= 1) {
                  var d = {'id': i,
                          'link': results.items[i].link,
                          'question': results.items[i].title,
                          'tags': results.items[i].tags};
                  data.push(d);
                  }
              }
          }
          }, relatedTags);
});


app.get('/what-to-learn', function(req, res){

  if(req.session.user_id) {
    var username = req.session.user_id;

    User.findOne({"userName":username}, function(err, user){
      var obj = [];
      if(err || user == undefined) {
        res.render('login.ejs', {message:'Please login first'});
      }
      var competencies = user.competencies;
      var query = [];
      for(var i=0;i<competencies.length;i++) {
        query.push(competencies[i].competencyId);
      }
      Competency.find({"competencyId": {$in:query}}, function(err, competency){

          if(err) {
            res.sendFile(__dirname + '/views/dashboard.html');
          }
          for(var i=0; i<competency.length; i++) {
            var competencyName = competency[i].competencyName;
            var s = 0;
            for(var j=0; j<competencies.length; j++) {
              if(competencies[j].competencyId == competency[i].competencyId) {
                s = competencies[j].score;
                break;
              }
            }
            if(s < 75)
              obj.push(competencyName);
          }
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
          }, obj.slice(0,1));
      });
    });

  }

//    var relatedTags = ['git'];

});


app.get('/dashboard', function(req, res){
  if(req.session.user_id)
    res.sendFile(__dirname + '/views/dashboard.html');
  else
    res.render('login.ejs', {message:'Please login first'});
});

app.get('/profile', function(req, res){
  var graphMessage = [];
  if(req.session.user_id) {
    var username = req.session.user_id;
    User.findOne({"userName":username}, function(err, user){
      if(err || user == undefined) {
        res.sendFile(__dirname + '/views/dashboard.html');
      }
      var competencies = user.competencies;
      var query = [];
      for(var i=0;i<competencies.length;i++) {
        query.push(competencies[i].competencyId);
      }
      Competency.find({"competencyId": {$in:query}}, function(err, competency){

          if(err) {
            res.sendFile(__dirname + '/views/dashboard.html');
          }
          for(var i=0; i<competency.length; i++) {
            var competencyName = competency[i].competencyName;
            var s = 0;
            for(var j=0; j<competencies.length; j++) {
              if(competencies[j].competencyId == competency[i].competencyId) {
                s = competencies[j].score;
                break;
              }
            }
            graphMessage.push({topic:competencyName, score:s});
          }
          var msg = {'graphMessage':graphMessage, 'user':username};
          res.render('graph.ejs', {message:msg});
      });
    });
  } else
    res.render('login.ejs', {message:'Please login first'});
});

app.get('/expertNotifications', function(req, res){
  if(req.session.user_id)
    res.sendFile(__dirname + '/views/notifications.html');
  else
    res.render('login.ejs', {message:'Please login first'});
});

app.get('/learningGroups', function(req, res){
  if(req.session.user_id)
    res.sendFile(__dirname + '/views/learningGroups.html');
  else
    res.render('login.ejs', {message:'Please login first'});
});

app.get('/logout', function(req, res){
  delete req.session.user_id;
  res.redirect('/login');
});


app.post('/add-objective', function(req, res){
    if(req.session.user_id) {
      var username = req.session.user_id;
      var newcompetency = req.body['new-objective'];

      var id = 0;

      Competency.findOne({"competencyName": newcompetency}, function(err, competency){
        if(err) {
          res.render('login.ejs', {message:'Please login first'});
        }
        id = competency.competencyId;
        User.findOne({'userName' : username}, function(err, user){
          if(err || user == undefined) {
             res.render('login.ejs', {message:'Please login first'});
          }
          user['competencies'].push({"competencyId":id, "score":0});
          user.save(function(err, user) {
            if (err) return console.error(err);
          });
          res.redirect('/dashboard');
        });
      });

    }
});

app.post('/add-competency', function(req, res){
    if(req.session.user_id) {
      var username = req.session.user_id;
      var newcompetency = req.body['new-competency'];

      var id = 0;

      Competency.findOne({"competencyName": newcompetency}, function(err, competency){
        if(err) {
          res.render('login.ejs', {message:'Please login first'});
        }
        id = competency.competencyId;
        User.findOne({'userName' : username}, function(err, user){
          if(err || user == undefined) {
             res.render('login.ejs', {message:'Please login first'});
          }
          user['competencies'].push({"competencyId":id, "score":75});
          user.save(function(err, user) {
            if (err) return console.error(err);
          });
          res.redirect('/dashboard');
        });
      });

    }
});

app.post('/lookup-profile', function(req, res){
  var graphMessage = [];
  var username = req.body['lookup-user'];
  User.findOne({"userName":username}, function(err, user){
    if(err || user == undefined) {
      res.redirect('/profile');
    }
    var competencies = user.competencies;
    var query = [];
    for(var i=0;i<competencies.length;i++) {
      query.push(competencies[i].competencyId);
    }
    Competency.find({"competencyId": {$in:query}}, function(err, competency){

        if(err) {
          res.sendFile(__dirname + '/views/dashboard.html');
        }
        for(var i=0; i<competency.length; i++) {
          var competencyName = competency[i].competencyName;
          var s = 0;
          for(var j=0; j<competencies.length; j++) {
            if(competencies[j].competencyId == competency[i].competencyId) {
              s = competencies[j].score;
              break;
            }
          }
          graphMessage.push({topic:competencyName, score:s});
        }
        var msg = {'graphMessage':graphMessage, 'user':username};
        res.render('graph.ejs', {message:msg});
    });
  });
});


app.get('/get-competencies', function(req, res){
  if(req.session.user_id) {
    var username = req.session.user_id;

    User.findOne({"userName":username}, function(err, user){
      var data = [];
      if(err || user == undefined) {
        res.json(data);
      }
      var competencies = user.competencies;
      var query = [];
      for(var i=0;i<competencies.length;i++) {
        query.push(competencies[i].competencyId);
      }
      Competency.find({"competencyId": {$in:query}}, function(err, competency){

          if(err) {
            res.sendFile(__dirname + '/views/dashboard.html');
          }
          for(var i=0; i<competency.length; i++) {
            var competencyName = competency[i].competencyName;
            var s = 0;
            for(var j=0; j<competencies.length; j++) {
              if(competencies[j].competencyId == competency[i].competencyId) {
                s = competencies[j].score;
                break;
              }
            }
            if(s >= 75)
              data.push(competencyName);
          }
          res.json(data);
      });
    });

  }

});


app.get('/get-learning-objectives', function(req, res){
  if(req.session.user_id) {
    var username = req.session.user_id;

    User.findOne({"userName":username}, function(err, user){
      var data = [];
      if(err || user == undefined) {
        res.json(data);
      }
      var competencies = user.competencies;
      var query = [];
      for(var i=0;i<competencies.length;i++) {
        query.push(competencies[i].competencyId);
      }
      Competency.find({"competencyId": {$in:query}}, function(err, competency){

          if(err) {
            res.sendFile(__dirname + '/views/dashboard.html');
          }
          for(var i=0; i<competency.length; i++) {
            var competencyName = competency[i].competencyName;
            var s = 0;
            for(var j=0; j<competencies.length; j++) {
              if(competencies[j].competencyId == competency[i].competencyId) {
                s = competencies[j].score;
                break;
              }
            }
            if(s < 75)
              data.push(competencyName);
          }
          res.json(data);
      });
    });

  }

});


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
