require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var fs = require("fs");
var command = process.argv[2];
var output;

//imdb
var movie = process.argv[3];

//spotify
var spotifyrequire = require("node-spotify-api");
var song = process.argv[3];
var spotify = new spotifyrequire({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

//twitter
var Twitter = require("twitter");
var client = new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret
});

//node liri.js my-tweets
function myTweets() {
    var params = {
        screen_name: "nbc",
        count: 20
    };

    logThatShit("---------------------------------\r\nTweet tweet\r\n---------------------------------\r\n\r\n");

    client.get("statuses/user_timeline", params, function (error, tweets) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                output = tweets[i].text + "\r\ncreated at " + tweets[i].created_at + "\r\n\r\n";
                console.log(output);
                logThatShit(output);
            }
        }
    });
};

//node liri.js spotify-this-song '<song name here>'
function spotifyThisSong(song) {

    logThatShit("---------------------------------\r\nExcellent Song\r\n---------------------------------\r\n\r\n");

    if (process.argv.length > 3) {
        spotify.search({ type: "track", query: song }, function (error, data) {
            var songObj = data.tracks.items[0];
            if (error) {
                return console.log("Error occurred: " + error);
            }
            output = "Artist(s): " + songObj.artists[0].name + "\r\nSong: " + songObj.name + "\r\nSong Preview: " + songObj.preview_url + "\r\nAlbum: " + songObj.album.name + "\r\n\r\n";
            console.log(output);
            logThatShit(output);
        });
    } else {
        spotify.request("https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE")
            .then(function (data) {
                output = "Artist(s): " + data.artists[0].name + "\r\nSong: " + data.name + "\r\nSong Preview: " + data.preview_url + "\r\nAlbum: " + data.album.name + "\r\n\r\n";
                console.log(output);
                logThatShit(output);
            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });
    }
}

//node liri.js movie-this '<movie name here>'
function movieThis(movie) {

    logThatShit("---------------------------------\r\nNetflix and Chill\r\n---------------------------------\r\n\r\n");

    if (process.argv.length > 3) {
        request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
            if (!error && response.statusCode === 200) {
                output = "Title: " + JSON.parse(body).Title + "\r\nYear: " + JSON.parse(body).Year + "\r\nIMDB Rating: " + JSON.parse(body).imdbRating + "\r\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\r\nCountry: " + JSON.parse(body).Country + "\r\nLanguage: " + JSON.parse(body).Language + "\r\nPlot: " + JSON.parse(body).Plot + "\r\nActors: " + JSON.parse(body).Actors;
                console.log(output);
                logThatShit(output);
            }
        });
    } else {
        request("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy", function (error, response) {
            if (!error && response.statusCode === 200) {
                output = "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/\r\nIt's on Netflix!";
                console.log(output);
                logThatShit(output);
            }
        });
    }
}

// node liri.js do-what-it-says
function doWhatItSays() {
    
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log("Error occurred: " + error);
        } else {
            var dataArr = data.split(",");
            if (dataArr[0] === "my-tweets") {
                myTweets();
            } else if (dataArr[0] === "spotify-this-song") {
                spotifyThisSong(dataArr[1]);
            } else if (dataArr[0] === "movie-this") {
                movieThis(dataArr[1]);
            }
        }
    });
}

function logThatShit(output) {
    fs.appendFile("log.txt", output, function (error) {
        if (error) {
            console.log(error);
        }
    });
}

if (command === "my-tweets") {
    myTweets();
} else if (command === "spotify-this-song") {
    spotifyThisSong(song);
} else if (command === "movie-this") {
    movieThis(movie);
} else if (command === "do-what-it-says") {
    doWhatItSays();
}