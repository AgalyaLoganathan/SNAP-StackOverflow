SNAP - A StackOverflow based Learning System
============================================
1. For Mongo connection to work, install mongo db and run it in its default port
2. Then run app.js - it has the code to create necessary collections and db for our app
3. Once it is successfully run, you can check the sample entries in 'snap_stackoverflow' db.
4. Please update your local db to include an additional field
    db.competencies.update({}, {$set: {'userId' : 1}}, false, true)
    db.learninggroups.update({}, {$set: {'userId' : 1}}, false, true)
    db.learningobjectives.update({}, {$set: {'userId' : 1}}, false, true)

**README coming soon**
