var tweetParser = require('./parser');

function train (tweet, callback) {
	response = 'Hello, world!';
	callback(200, response);
}

function map (tweet, callback) {
	//var result = tweetParser.parseTweet(tweet.text);
	console.log(tweet['text']);
	response = 'Hello, world!';
	callback(200, response);
}

exports.train = train;
exports.map = map;