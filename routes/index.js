var express = require('express');
var router = express.Router();
var path = require('path');
var config = require(path.join(__dirname,'../config/config.gulp.js'));


/* GET home page. */

router.get('/', function(req, res, next) {
	console.log(config['build']);
  res.render('index', { 'build': 'build'});
});

module.exports = router;
