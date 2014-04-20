// Insert the glyphicons stylesheet.
var head = document.getElementsByTagName("head")[0];
var link = document.createElement("link");
link.id = "glyphs";
link.rel = "stylesheet";
link.type = "text/css";
link.href = "//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css";
link.media = "all";
head.appendChild(link);

function populateTwitterFeed() {
	// Create the new li element
	var upvoteNode = document.createElement("li");
	var downvoteNode = document.createElement("li");

	var feedbackLink = document.createElement("a");
	feedbackLink.setAttribute("role", "button");
	feedbackLink.setAttribute("class", "with-icn js-tooltip");
	feedbackLink.setAttribute("href", "#");

	var upvoteStyle = document.createElement("b");
	var upvoteText = document.createTextNode("Up");
	var upvoteIcon = document.createElement("i");
	upvoteIcon.setAttribute("class", "fa fa-thumbs-up");

	var upvoteLink = feedbackLink.cloneNode();
	upvoteStyle.appendChild(upvoteText);

	upvoteLink.appendChild(upvoteIcon.cloneNode());
	upvoteLink.appendChild(upvoteStyle);
	upvoteNode.appendChild(upvoteLink);

	var downvoteStyle = document.createElement("b");
	var downvoteText = document.createTextNode("Down");
	var downvoteIcon = document.createElement("i");
	downvoteIcon.setAttribute("class", "fa fa-thumbs-down");

	var downvoteLink = feedbackLink.cloneNode();
	downvoteStyle.appendChild(downvoteText);

	downvoteLink.appendChild(downvoteIcon.cloneNode());
	downvoteLink.appendChild(downvoteStyle);
	downvoteNode.appendChild(downvoteLink);


	// Prepare to iterate.
	var streamItems = document.getElementById("stream-items-id");
	var tweets = [];

	// Loop through each of the tweets displayed and display relevant information.
	for (var i = 0; i < streamItems.children.length; i++) {
		var listElementNode = streamItems.children.item(i);

		// If we haven't already marked it.
		if (!listElementNode.hasAttribute("data-already-visited")) {
			var tweet = {};

			// First, mark the tweet as visited.
			listElementNode.setAttribute("data-already-visited", "true");

			// Grab the Tweet ID.
			tweet.id = listElementNode.getAttributeNode("data-item-id").value;

			// Grab the Tweet text.
			var tweetWrapperNode = listElementNode.getElementsByClassName("tweet").item(0);
			var tweetContentNode = tweetWrapperNode.getElementsByClassName("content").item(0);
			var tweetTextNode = tweetContentNode.getElementsByClassName("tweet-text").item(0);
			var tweetText = tweetTextNode.innerHTML;
			tweet.text = tweetText;

			// Push it to the array that we have.
			tweets.push(tweet);

			// Then, add the proper interface.
			var tweetActions = tweetContentNode.getElementsByClassName("tweet-actions").item(0);
			var upvoteNodeClone = upvoteNode.cloneNode(true);
			var downvoteNodeClone = downvoteNode.cloneNode(true);
			tweetActions.insertBefore(downvoteNodeClone, tweetActions.firstChild);
			tweetActions.insertBefore(upvoteNodeClone, tweetActions.firstChild);

		}
		
	}
}

var s_ajaxListener = {};
s_ajaxListener.tempOpen = XMLHttpRequest.prototype.open;
s_ajaxListener.tempSend = XMLHttpRequest.prototype.send;
// callback will be invoked on readystatechange
s_ajaxListener.callback = function () {
	alert("HI");
    // "this" will be the XHR object
    // it will contain status and readystate
    //return populateTwitterFeed();
};

XMLHttpRequest.prototype.open = function(a,b) {
  if (!a) var a='';
  if (!b) var b='';
  s_ajaxListener.tempOpen.apply(this, arguments);
  s_ajaxListener.method = a;  
  s_ajaxListener.url = b;
  if (a.toLowerCase() == 'get') {
    s_ajaxListener.data = b.split('?');
    s_ajaxListener.data = s_ajaxListener.data[1];
  }
};

XMLHttpRequest.prototype.send = function(a,b) {
  if (!a) var a='';
  if (!b) var b='';
  s_ajaxListener.tempSend.apply(this, arguments);
  if(s_ajaxListener.method.toLowerCase() == 'post')s_ajaxListener.data = a;
  // assigning callback to onreadystatechange
  // instead of calling directly
  this.onreadystatechange = s_ajaxListener.callback;
};


populateTwitterFeed();