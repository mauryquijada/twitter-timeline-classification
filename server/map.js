var tweetParser = require('./parser');

function train (tweet, response) {
	response.writeHead(200);
	response.end('hai');

	return true;
}

function map (tweet, response, origin) {
	//var result = tweetParser.parseTweet(tweet.text);

	response.writeHead(200, {'Content-Type': 'text/plain', 'access-control-allow-origin': origin});
	response.end("hai");
	return true;
}

exports.train = train;
exports.map = map;