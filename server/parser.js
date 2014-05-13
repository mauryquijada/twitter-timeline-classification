// Inspiration from http://ravikiranj.net/drupal/201205/code/machine-learning/how-build-twitter-sentiment-analyzer
var fs = require('fs');
var STOPWORDS = JSON.parse(fs.readFileSync('stopwords.json', 'ascii'));

function parseTweet (tweet) {
	// Apply pre-processing to the tweet.
	// -- Replace hashtags with their word representation (they give useful info).
	tweet = tweet.replace(/#([^\s]+)/g, '$1');

	// -- Remove additional whitespace.
	tweet = tweet.replace(/[\s]+/, ' ');

	// -- Remove links and the description text.


	// -- Convert to lowercase.
	tweet.toLowerCase();

	// -- Split to array
	tweet = tweet.split(' ');
	var tweetArray = [];

	// -- Eliminate stop words.
	for (var i = 0; i < tweet.length; i++) {
		if (STOPWORDS.indexOf(tweet[i]) < 0) {
			tweetArray.push(tweet[i]);
		}
	}

	return JSON.stringify(tweetArray);
}

exports.parseTweet = parseTweet

