
/**
 * main
 * author:yongzheng
 * date:2014-1-3 10:30:02
 */
var fs = require('fs');
var logAccess = fs.createWriteStream('access.log', {flags: 'a'});
 
var express = require('express');
var app = express();
var routes = require('./routes');
var MongoStore = require('connect-mongo')(express);
var sets = require('./sets');
var partials = require('express-partials'); 
var util = require('util'); 
var http = require('http');
var path = require('path');

var log=sets.log;
// all environments
app.configure(function(){
	app.use(express.static(path.join(__dirname, 'public')));//public
	//app.use(express.static(path.join(__dirname, 'temp')));
	app.use(express.logger({stream: logAccess}));
	app.use(express.compress());	
	app.set('views', path.join(__dirname,'views'));
	app.set('view engine', 'ejs');
	app.set('view options', {layout:false});
	//app.use(partials());
	app.use(express.favicon());
	app.use(express.methodOverride());
	app.use(express.bodyParser(sets.upload));
	app.use(express.cookieParser());
	//app.use(express.cookieSession({secret:sets.cookieSecret}));//{cookie: { path: '/', httpOnly: true, maxAge: null }}
	app.use(express.session({
		secret: sets.cookieSecret
		,store: new MongoStore({
			url:sets.host
			,db: sets.db
		})
	}));	
	//app.use(app.router);
	app.use(new express.Router(routes));	
});

// development only
app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
	//app.use(express.errorHandler());
});

var port=sets.webport;
if (!module.parent) {
app.listen(port, function(){
  log('Express server listening on port ' + port+"==>"+app.settings.env);
});
}
// Routes
routes(app);
module.exports=app;



