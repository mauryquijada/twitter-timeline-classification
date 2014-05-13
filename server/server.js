var https = require('https');
var fs = require('fs');
var qs = require('querystring');

var map = require('./map');

var options = {
	key: fs.readFileSync('privatekey.pem'),
	cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, function (req, res) {
	// Capture the origin to enable CORS.
	var origin = (req.headers.origin || '*');
	console.log("origin is: " + origin);

	// Send the appropriate header if the browser is making a security check.
	if (req.method.toUpperCase() === 'OPTIONS') {
		console.log('Browser security check!');
		res.writeHead('204', 'No Content',
		{
			'access-control-allow-origin': origin,
			'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'access-control-allow-headers': 'content-type, accept',
			'access-control-max-age': 10, // Seconds.
			'content-length': 0
		}
		);

		return res.end();
	}

	// Function to handle POST data.
	function handlePostData (fn) {
		var body = '';
        req.on('data', function (data) {
            body += data;
        });

        req.on('end', function () {
        	console.log(body);
        	var tweet = qs.parse(body).data;
			fn(tweet, res, origin);
        });
	}

	// Route the request based on what's being asked of us.
	switch (req.url) {
		case '/map':
			console.log('We hit the map page!');

			if (req.method == 'POST') {
				handlePostData(map.map);
			} else {
        		res.writeHead(405, {'Content-Type': 'text/plain', 'access-control-allow-origin': origin});
        		res.end();
    		}
			
			
			break;
		case '/train':
			console.log('We hit the train page!');
			res.writeHead(200);
			if (req.method == 'POST') {
				handlePostData(map.train);
			} else {
        		res.writeHead(405, {'Content-Type': 'text/plain', 'access-control-allow-origin': origin});
        		res.end();
    		}

			break;
		default:
			console.log('Unrecognized URL ' + req.url);
			res.writeHead(400, {'Content-Type': 'text/plain', 'access-control-allow-origin': origin});
			res.end('Unrecognized URL ' + req.url);
	}
}).listen(1337, '127.0.0.1');

console.log('Server running at https://127.0.0.1:1337/');