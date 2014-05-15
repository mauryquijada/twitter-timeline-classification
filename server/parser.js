var fs = require('fs');
var stemmer = require('./stemmer');
var STOPWORDS = JSON.parse(fs.readFileSync('stopwords.json', 'ascii'));

// Pre-process a given tweet input.
function parseTweet (tweet) {
	// Initialize the tweet word object.
	var unigrams = {};

	// -- Convert to lowercase.
	tweet = tweet.toLowerCase();

	// -- Delete the hashtags and @-reply HTML tags.
	tweet = tweet.replace(/<[sb]>([^<]*)<\/[sb]>/g, '$1')

	// -- Add hashtags and AT-users to the array of what to keep; they'll be deleted.
	// Use RegExp option to return captured groups.
	// TODO: Support more than one in one tweet string.
	var pattern = /[#@]([_a-z0-9]+)/g
	var matches = pattern.exec(tweet);

	if (matches) {
		// Remove the first match (which is the entire match) and add the rest.
		matches.splice(0, 1);
		matches.forEach(function (match) {
			// Assign the match a score of one (for now).
			unigrams[match] = 1;
		});
	}
	
	// Extract the domains of sites that appear; we want to keep those for added metadata.
	// TODO: Use data-expanded-url.

	// -- Remove miscellaneous types of tags.
	tweet = tweet.replace(/<.*>/g, '');

	// -- Eliminate 'RT' or retweet.
	tweet = tweet.replace(/RT/g, '');

	// -- Replace periods with spaces so that sentences still hold.
	tweet = tweet.replace(/\./g, ' ');

	// -- Remove additional whitespace and other punctuation.
	tweet = tweet.replace(/[\s]+/g, ' ');
	tweet = tweet.replace(/(:?[!"?,:\+\*\(\)]|&[a-z]+;)/g, '');

	// -- Split what remains into an array.
	tweet = tweet.split(' ');

	// -- Eliminate stop words.
	for (var i = 0; i < tweet.length; i++) {
		if (STOPWORDS.indexOf(tweet[i]) < 0 && tweet[i].length > 0) {
			// -- Stem them.
			var stemmed = stemmer.stem(tweet[i]);

			// -- Assign them a score of one (for now).
			unigrams[stemmed] = 1;
		}
	}

	return unigrams;
}

exports.parseTweet = parseTweet
