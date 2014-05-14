// Inspiration from http://ravikiranj.net/drupal/201205/code/machine-learning/how-build-twitter-sentiment-analyzer
var fs = require('fs');
var stemmer = require('./stemmer');
var STOPWORDS = JSON.parse(fs.readFileSync('stopwords.json', 'ascii'));

// Pre-process a given tweet input.
function parseTweet (tweet) {
	// Initialize the tweet word array.
	var tweetArray = [];

	// -- Convert to lowercase.
	tweet = tweet.toLowerCase();

	// -- Delete the hashtags and @-reply HTML tags.
	tweet = tweet.replace(/<[sb]>([^<]*)<\/[sb]>/g, '$1')

	// -- Add hashtags and AT-users to the array of what to keep; they'll be deleted.
	// Use RegExp option to return captured groups.
	// TODO: Support more than one in one tweet string.
	var pattern = /[#@]([_a-z0-9]+)/g
	var matches = pattern.exec(tweet);
	console.log(matches);
	if (matches) {
		// Remove the first match (which is the entire match) and add the rest.
		matches.splice(0, 1);
		tweetArray = tweetArray.concat(matches);
	}
	
	// Extract the domains of sites that appear; we want to keep those for added metadata.
	// TODO: Use data-expanded-url.

	// -- Remove miscellaneous types of tags.
	// TODO: Refine. tweet.replace(/<(?:a|span|img)(?: [\-a-z]+="[^"]+")*>.*<\/(?:a|span)>/g, '')
	tweet = tweet.replace(/<[^>]+>/g, '');

	// -- Eliminate 'RT' or retweet.
	tweet = tweet.replace(/RT/g, '');

	// -- Replace periods with spaces so that sentences still hold.
	tweet = tweet.replace(/\./g, ' ');

	// -- Remove additional whitespace and other punctuation.
	tweet = tweet.replace(/[\s]+/g, ' ');
	tweet = tweet.replace(/(:?[!"?,:\*\(\)]|&nbsp;)/g, '');

	// -- Split what remains into an array.
	tweet = tweet.split(' ');

	// -- Eliminate stop words.
	for (var i = 0; i < tweet.length; i++) {
		if (STOPWORDS.indexOf(tweet[i]) < 0 && tweet[i].length > 0) {
			tweetArray.push(tweet[i]);
		}
	}

	// -- Stem them.
	tweetArray.map(stemmer.stem);

	return JSON.stringify(tweetArray);
}

exports.parseTweet = parseTweet

