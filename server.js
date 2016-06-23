var express = require('express');
var app = express();
var google = require('googleapis');
var youtube = google.youtube('v3');
var data_to_send;

var API_KEY = 'AIzaSyAr9xBlzUbDqg44kU2DahiCr4_DsQ9Fbug'; // specify your API key here

var nextToken;


app.set('views', __dirname + '/views');
// set the view engine to ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));


// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
  	res.render('index');

});

app.get('/search/', function(req, res) {
	if(req.query.q!=""||req.query.source =='search'){
		youtube.search.list({ key: API_KEY, part: 'snippet',q: req.query.q , type: 'video',maxResults:25}, function(err, data) {
		  	//console.log(data);
		  	data.items[0].queryVal = req.query.q;

		  	data_to_send = data.items;
		  	res.render('search');
		  	nextToken = data.nextPageToken
	});
	}
	else{
		res.send(data_to_send);
	}
	/*console.log("Say something!")
	console.log("In search " + req.query.q);
	*/

});

app.get('/moreResults/',function(req,res){

	youtube.search.list({ key: API_KEY, part: 'snippet',q: req.query.q , type: 'video',maxResults:25,pageToken:nextToken}, function(err, data) {
		  	console.log(nextToken);
		  	nextToken = data.nextPageToken;
		  	res.send(data.items);
	});




});

app.get('/video/', function(req, res) {
	
	if (req.query.flag=="getVideo") {
		youtube.videos.list({key: API_KEY,id : req.query.vidId, part : 'snippet,statistics' },function(err,data){
			res.send(data.items[0])

		});

  	} 
  	else {
    	res.render('videoview');
    }
		


});


app.get('/channelInfo/', function(req, res){

	youtube.channels.list({key: API_KEY,id: req.query.chId, part: 'id,snippet'},function(err,data){
		res.send(data.items[0]);

	});


});





app.listen(3000);
console.log('3000 is the magic port');