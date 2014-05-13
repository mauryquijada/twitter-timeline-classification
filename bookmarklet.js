// Insert the glyphicons stylesheet.
var head = document.getElementsByTagName("head")[0];
var link = document.createElement("link");
link.id = "glyphs";
link.rel = "stylesheet";
link.type = "text/css";
link.href = "//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css";
link.media = "all";
head.appendChild(link);

function processFeedback(obj) {
    var target = obj.target;

    // Decide what to do depending on whether the icon or link was clicked.
    if (target.nodeName == "B") {
        // Get the icon clicked on.
        var icon = target.parentNode.children.item(0);
    } else if (target.nodeName == "I") {
        // Stay put.
        var icon = target;
    }

    // Get the one we didn't click.
    if (icon.className == "fa fa-thumbs-up") {
        var otherIcon = target.parentNode.parentNode.nextSibling.firstChild.firstChild;
    } else if (icon.className == "fa fa-thumbs-down") {
        var otherIcon = target.parentNode.parentNode.previousSibling.firstChild.firstChild;
    }

    // Make the change only if we haven't seen a vote cast before.
    var newClass = "fa fa-check";
    if (icon.className != newClass && otherIcon.className != newClass) {
        icon.className = newClass;
    } else {
        alert("You've already cast your vote!");
    }

    // TODO: Send to server.
    
    return false;
}

function populateTwitterFeed() {
	// Create the new li elements that contain our upvote-downvote code.
	var elements = "<li><a role=\"button\" class=\"with-icn js-tooltip\" href=\"javascript:;\"><i class=\"fa fa-thumbs-up\" style=\"margin-right: 7px;\"></i><b>Up</b></a></li><li><a role=\"button\" class=\"with-icn js-tooltip\" href=\"javascript:;\"><i class=\"fa fa-thumbs-down\" style=\"margin-right: 7px;\"></i><b>Down</b></a></li>";

	// Prepare to iterate.
	var streamItems = document.getElementById("stream-items-id");
	var tweets = [];

	// Loop through each of the tweets displayed and display relevant information.
	for (var i = 0; i < streamItems.children.length; i++) {
		var listElementNode = streamItems.children.item(i);

		// If we haven't already marked it...
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

			// Then, add the proper HTML.
			var tweetActions = tweetContentNode.getElementsByClassName("tweet-actions").item(0);
			tweetActions.innerHTML = elements + tweetActions.innerHTML;

			// Traverse to dd the event listeners.
			for (var i = 0; i < 2; i++) {
				var voteLink = tweetActions.children.item(i).children.item(0);
				voteLink.addEventListener("click", processFeedback);
			}
		}
	}
}

// Every 2.5 seconds, loop through and make sure all tweets have that tag.
window.setInterval(function() {
	populateTwitterFeed();
}, 2500);