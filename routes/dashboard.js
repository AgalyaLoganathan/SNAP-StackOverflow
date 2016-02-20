exports.dashboard = function (req, res) {
    var name = req.body;
    res.render('dashboard.ejs', {'name' : name});
};