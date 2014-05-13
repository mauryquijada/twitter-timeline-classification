// Inspiration from http://ravikiranj.net/drupal/201205/code/machine-learning/how-build-twitter-sentiment-analyzer

function parseTweet (tweet) {
	// Apply pre-processing to the tweet.
	// -- Replace hashtags with their word representation (they give useful info).
	tweet = tweet.replace(/#([^\s]+)/g, "$1");

	// -- Remove additional whitespace.
	tweet = tweet.replace(/[\s]+/, " ");



	// -- Remove links and the description text.


	// -- Convert to lowercase.
	tweet.toLowerCase();

	// -- Eliminate stop words.


	// Only consider unigrams

	return tweet;
}

