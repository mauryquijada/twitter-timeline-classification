var som = require('./som')
var parser = require('./parser');

function train (tweet, callback) {
	var parsed = parser.parseTweet(tweet.text);
	console.log(parsed);

	callback(200, 'OK');
}

function mapTweetList (tweets, callback) {
	// For each tweet, determine a relevance.
	var response = [];
	tweets.forEach(function (tweet) {
		response.push(mapTweet(tweet));
	});

	callback(200, JSON.stringify(response));
}

// Returns a relevance from 0 to 1.
function mapTweet (tweet) {
	return {'id': tweet.id, 'relevance': Math.random()};
}

exports.train = train;
exports.map = mapTweetList;