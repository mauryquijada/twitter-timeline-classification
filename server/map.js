var tweetParser = require('./parser');

function train (tweet, callback) {
	var parsed = tweetParser.parseTweet(tweet.text);
	console.log(parsed);


	response = 'Hello, world!';
	callback(200, response);
}

function mapTweetList (tweets, callback) {
	// For each tweet, determine a relevance.
	var response = [];
	tweets.forEach(function (tweet) {
		response.push(mapTweet(tweet));
	});

	callback(200, JSON.stringify(response));
	console.log(response);
}

// Returns a relevance from 0 to 1.
function mapTweet (tweet) {
	return {'id': tweet.id, 'relevance': Math.random()};
}

exports.train = train;
exports.map = mapTweetList;