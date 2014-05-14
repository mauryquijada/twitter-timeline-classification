// Initialize configuration variables.
var SERVER = "https://127.0.0.1:1337";

// Insert the glyphicons stylesheet.
var head = document.getElementsByTagName("head")[0];
var link = document.createElement("link");
link.id = "glyphs";
link.rel = "stylesheet";
link.type = "text/css";
link.href = "//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css";
link.media = "all";
head.appendChild(link);

function processFeedback (action, tweet, icon, otherIcon) {
    // Make the change only if we haven't seen a vote cast before.
    var newClass = "fa fa-check";
    if (icon.className != newClass && otherIcon.className != newClass) {
        icon.className = newClass;
    } else {
        alert("You've already cast your vote!");
        return false;
    }

    // Otherwise, send it to the server and change the indication when we receive
    // a good response.
    var request = new XMLHttpRequest();
    request.open("POST", SERVER + "/map", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
             icon.className = newClass;
        } else {
            icon.className = "fa fa-frown-o";
        }
    }

    request.send("data=" + encodeURIComponent(JSON.stringify(tweet)));
    
    return true;
}

function populateTwitterFeed () {
    // Create the new li elements that contain our upvote-downvote code.
    var elements = "<li><a role=\"button\" class=\"with-icn js-tooltip upvote-link\" href=\"#\"><i class=\"fa fa-thumbs-up\" style=\"margin-right: 7px;\"></i><b>Up</b></a></li><li><a role=\"button\" class=\"with-icn js-tooltip downvote-link\" href=\"#\"><i class=\"fa fa-thumbs-down\" style=\"margin-right: 7px;\"></i><b>Down</b></a></li>";

    // Prepare to iterate.
    var streamItems = document.getElementById("stream-items-id");
    var tweets = [];

    // Loop through each of the tweets displayed and display relevant information.
    Array.prototype.slice.call(streamItems.children).forEach(function (listElementNode) {
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

            // Get the proper HTML nodes and add the proper event listeners.
            var upvoteLink = tweetActions.getElementsByClassName("upvote-link")[0];
            var upvoteIcon = tweetActions.getElementsByClassName("fa-thumbs-up")[0];
            upvoteLink.addEventListener("click", function (e) {
               processFeedback('upvote', tweet, upvoteIcon, downvoteIcon);
               e.preventDefault();
            });

            var downvoteLink = tweetActions.getElementsByClassName("downvote-link")[0];
            var downvoteIcon = tweetActions.getElementsByClassName("fa-thumbs-down")[0];
            downvoteLink.addEventListener("click", function (e) {
               processFeedback('downvote', tweet, downvoteIcon, upvoteIcon);
               e.preventDefault();
            });

            // TODO: Run the element through the self-organizing map and change its background.
            if (Math.random() > 0.5) listElementNode.style.backgroundColor = "rgb(245, 255, 239)";
        }
    });
}

// Every 2.5 seconds, loop through and make sure all tweets have that tag.
window.setInterval(function () {
    populateTwitterFeed();
}, 2500);