var express = require('express');
var cors = require('cors')

var app = express()
app.use(cors())

var file_data = require('./favs.json');


//Put html document in /Views

app.get('/', function (req, res) 
{
// __dirname: directory name of current module 
	res.sendFile( __dirname+ "/" + "index.html" ); 
})


//Get all tweets
app.get('/process_get_all_tweets', function(req, res) {
    var result = [];
    for (var index in file_data) {
        var tweet = file_data[index];
        result.push({
            created_at: tweet.created_at,
            id: file_data[index].id,
            tweeted_text: file_data[index].text
        });
    }
    res.send(result);
});


//Get Twitter users
app.get('/process_get_all_twitter_users', function (req, res) 
{
	var result = [];
    for (var index in file_data) {
        var tweet = file_data[index];
        result.push({
            user_id: tweet.user.id,
            user_name: tweet.user.name,
        });
    }
    res.send(result);
})

//Get list of all external links
app.get('/process_get_all_external_links', function (req, res) 
{
	
	var result = [];
    for (var index in file_data) {
        var tweet = file_data[index];

		var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
		var regex = new RegExp(expression);

        result.push({
			tweet_id:tweet.id,
            url: tweet.text.match(regex),
            
        });
    }
    res.send(result);

})
//Get details about a given tweet
app.get('/process_get_details_about_tweet', function (req, res) 
{
	
	var tweetid = req.param('tweet_id');
	
	var result = [];
    for (var index in file_data) {
        var tweet = file_data[index];

		if(tweet.id==tweetid)
		{
        result.push({
            created_at: tweet.created_at,
            id: tweetid,
			text:tweet.text,
        });
		}
    }
    res.send(result);
})

//Get details about a given twitter user(UC)
app.get('/process_get_details_about_twitter_user', function (req, res) 
{
	var username = req.param('user_name');
	console.log(username);
	var result = [];
    for (var index in file_data) {
        var tweet = file_data[index];

		if(tweet.user.screen_name==username)
		{
        result.push({
            user_id: tweet.user.id,
            name:tweet.user.screen_name,
			location:tweet.user.location,
			description:tweet.user.description,
        });
		}
    }
    res.send(result);
})

	
var server = app.listen(8081, function () 
{ 
	var host = server.address().address
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port) 
})