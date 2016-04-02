SNAP - A StackOverflow based Learning System
============================================
1. For Mongo connection to work, install mongo db and run it in its default port
2. Then run app.js - it has the code to create necessary collections and db for our app
3. Once it is successfully run, you can check the sample entries in 'snap_stackoverflow' db.
4. Please update your local db to include an additional field
    db.competencies.update({}, {$set: {'userId' : 1}}, false, true)
    db.learninggroups.update({}, {$set: {'userId' : 1}}, false, true)
    db.learningobjectives.update({}, {$set: {'userId' : 1}}, false, true)
    db.users.update({}, {$set: {'score' : 0}}, false, true)

Run the following to update latest schema changes 
=================================================

Run the following:
```
    db.users.remove({})
    db.learningobjectives.remove({})
    db.competencies.update({userId: 1}, {$unset: {score: "", userId: ""}})
    db.createCollection("users", {
            userId: Number,
            userName: { type: String },
            accountId: Number,
            questionIdsToAvoid : [Number],
            learningGroupIds : [Number],
            competencies: [{competencyId: Number,
                            score: Number}]
            })

    db.users.insert({
        userId: 1,
        userName: "test",
        accountId: 1,
        questionIdsToAvoid: [10],
        learningGroupIds: [],
        competencies: [{
            competencyId: 1,
            score: 0
        }]
    })
```

Creating the competencies collection
------------------------------------

Run the `node populateCompetenciesCollection.js` command to create a new database with all competencies. Export the collection to json file in the new database using `mongoexport` command. Then run the below command to create competencies collection main database.

```
mongoimport --db snap_stackoverflow --collection competencies --type json --file tags.json
```
**README coming soon**
