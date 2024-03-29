// Initialize configuration variables.
var SERVER = "https://cs.hmc.edu:47474";
var USER = "mauryquijada";

// Insert the glyphicons stylesheet.
var head = document.getElementsByTagName("head")[0];
var link = document.createElement("link");
link.id = "glyphs";
link.rel = "stylesheet";
link.type = "text/css";
link.href = "//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css";
link.media = "all";
head.appendChild(link);

// Send the training data to the server for processing.
function processFeedback (action, tweet, icon, otherIcon) {
    // Send the associated action along with the tweet.
    tweet.action = action;

    // Make the change only if we haven't seen a vote cast before.
    var newClass = "fa fa-check";
    if (icon.className != newClass && otherIcon.className != newClass) {
        icon.className = newClass;
    } else {
        alert("You have already cast your vote!");
        return false;
    }

    // Otherwise, send it to the server and change the indication when we receive
    // a good response.
    var request = new XMLHttpRequest();
    request.open("POST", SERVER + "/train", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
             icon.className = newClass;
             return true;
        } else {
            icon.className = "fa fa-frown-o";
            return false;
        }
    };

    request.send("user=" + encodeURIComponent(USER) + "&data=" + encodeURIComponent(JSON.stringify(tweet)));
}

// For a given list of tweets, determine their relevance and change their background.
function determineRelevanceOfTweets (tweets) {
    if (tweets.length > 0) {
        var request = new XMLHttpRequest();
        request.open("POST", SERVER + "/map", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                var response = JSON.parse(request.responseText);
                response.forEach(function(item) {
                    // Change the background color depending on its relevance.
                    var selector = "[data-item-id='" + item.id + "']";
                    var tweetNode = document.querySelector(selector);

                    switch (item.result) {
                        case "up":
                            tweetNode.style.backgroundColor = "rgb(245, 255, 239)";
                            break;
                        case "down":
                            tweetNode.style.backgroundColor = "rgb(255, 214, 224)";
                            break;
                        case "none":
                            break;
                    }
                });
            }
        };
        request.send("user=" + encodeURIComponent(USER) + "&data=" + encodeURIComponent(JSON.stringify(tweets)));
    }
}

function populateTwitterFeed () {
    // Create the new li elements that contain our upvote-downvote code.
    var elements = "<li><a role='button' class='with-icn js-tooltip upvote-link'\
    href='#'><i class='fa fa-thumbs-up' style='margin-right: 7px;'></i><b>Up</b>\
    </a></li><li><a role='button' class='with-icn js-tooltip downvote-link' href='#'>\
    <i class='fa fa-thumbs-down' style='margin-right: 7px;'></i><b>Down</b></a></li>";

    // Prepare to iterate.
    var streamItems = document.getElementById("stream-items-id");
    var tweets = [];

    // Loop through each of the tweets displayed and display relevant information.
    Array.prototype.slice.call(streamItems.children).forEach(function (tweetNode) {
        // If we haven't already marked it...
        if (!tweetNode.hasAttribute("data-already-visited")) {
            var tweet = {};

            // First, mark the tweet as visited.
            tweetNode.setAttribute("data-already-visited", "true");

            // Grab the Tweet ID.
            tweet.id = tweetNode.getAttributeNode("data-item-id").value;

            // Grab the Tweet text.
            var tweetWrapperNode = tweetNode.getElementsByClassName("tweet")[0];
            var tweetContentNode = tweetWrapperNode.getElementsByClassName("content")[0];
            var tweetTextNode = tweetContentNode.getElementsByClassName("tweet-text")[0];
            var tweetText = tweetTextNode.innerHTML;
            tweet.text = tweetText;

            // Push it to the array that we have.
            tweets.push(tweet);

            // Then, add the proper HTML.
            var tweetActions = tweetContentNode.getElementsByClassName("tweet-actions")[0];
            tweetActions.innerHTML = elements + tweetActions.innerHTML;

            // Get the proper HTML nodes and attach the proper event listeners.
            var upvoteLink = tweetActions.getElementsByClassName("upvote-link")[0];
            var upvoteIcon = tweetActions.getElementsByClassName("fa-thumbs-up")[0];
            upvoteLink.addEventListener("click", function (e) {
               e.preventDefault();
               processFeedback("up", tweet, upvoteIcon, downvoteIcon);
            });

            var downvoteLink = tweetActions.getElementsByClassName("downvote-link")[0];
            var downvoteIcon = tweetActions.getElementsByClassName("fa-thumbs-down")[0];
            downvoteLink.addEventListener("click", function (e) {
               e.preventDefault();
               processFeedback("down", tweet, downvoteIcon, upvoteIcon);
            });
        }
    });

    // Send all of the unseen tweets to the server to determine relevance.
    determineRelevanceOfTweets(tweets);
}

populateTwitterFeed();

// Every 2.5 seconds, loop through and make sure all tweets have that tag.
window.setInterval(function () {
    populateTwitterFeed();
}, 2500);