// This script saves all tags from stackoverflow. 
// Sadly Stackoverflow blocks its API after certain number of requests.
// So not all tags can be saved.

var stackexchange = require('stackexchange');
var options = { version: 2.2 };
var context = new stackexchange(options);
var mongoDb = require('mongoose');

mongoDb.connect('mongodb://localhost/snap_tags');
var connection = mongoDb.connection;
var competencySchema = new mongoDb.Schema({
    competencyId: Number, 
    competencyName: {type: String}
});
var Competency = mongoDb.model('Competency', competencySchema);


filter = {
	page:1,
    pagesize: 100,
    sort: 'popular',
    order: 'desc'
};

var count = 0;
function setTags() {
	context.tags.tags(filter, function(err, results){
      if (err) console.log(err);
      //console.log(results);
      
	      for(var i=0; i<results.items.length; i++) {
	      	count++;
	      	// console.log(count, results.items[i].name);
	      	var competency = new Competency({
	            competencyId: count
	          , competencyName:results.items[i].name
	        });
		    competency.save(function(err, competency) {
		      if (err) return console.error(err);
		      // console.log(competency);
		    });
	      }
	      if(results.has_more == true) {
	      	console.log(count);
	      	var pageNum = filter.page;
	      	pageNum++;
	      	filter.page = pageNum;
	      	
	      	setTags();
	      } else {
	      	return;
	      }
	  
    });
}

setTags();