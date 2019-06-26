require("dotenv").config();
var moment = require("moment")
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api")
const chalk = require("chalk")
const chalkAnimation = require("chalk-animation")
const gradient = require('gradient-string');
var spotify = new Spotify(keys.spotify)
var fs = require("fs")
var fromTheTop = process.argv
var newInput = fromTheTop.slice(2)



var test=newInput.slice(1).join(" ")
console.log(test)
var param=newInput[0]

const log = console.log;

var bandDisplay = chalk.blue.bgRed
var spotifyDisplay = chalk.bgBlack
var omdbDisplay = chalk.yellow.bgMagenta

concert(param,test)
spotSearch(param,test);
omdb(param,test);
read(param,test);

function read() {
  if (param === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (err, data) {
     
      fromTheTop.slice(2)
      test = data.split(",")
      var readParam1=test[0]
      var readParam2=test[1]
      spotSearch(readParam1,readParam2)
      omdb(readParam1,readParam2)
      concert(readParam1,readParam2)
      if (err) {
        return console.log(err)
      }

    })
  }
}

function spotSearch(param,test) {
  if(param==="spotify-this-song"){
  logText();
  if (test.length>0) {
    var song = test

    spotify.search({
        type: 'track',
        query: song
      })
      .then(function (response) {

        for (let index = 0; index < 5; index++) {
          var spotifyResponse = response.tracks.items[index]
          logSpotify(spotifyResponse)
        }

      })
  } else{
    var placeholder = "The Sign ace of base"
    spotify.search({
        type: 'track',
        query: placeholder
      })
      .then(function (response) {

        for (let index = 0; index < 5; index++) {
          var spotifyResponse = response.tracks.items[index]
          logSpotify(spotifyResponse)
        }

      })
  }
}
}

function concert(param,test) {

  if (param=== "concert-this") {
    var artist = test
    logText();
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
      function (response) {
        var bandData = response.data

        for (let index = 0; index < 5; index++) {
          var date = bandData[index].datetime
          var showTime = moment(date).format("MM-DD-YYYY hh:MM")
          log(bandDisplay.bold("Date/Time playing: " + showTime))
          log(bandDisplay.bold("Venue Name: " + bandData[index].venue.name))
          log(bandDisplay.bold("Country: " + bandData[index].venue.country))
          log(bandDisplay.bold("City: " + bandData[index].venue.city))
          console.log("------------------------")
          console.log("\n")

        }
      }
    )
  }
}

function omdb() {
  
  if (param === "movie-this") {
    logText();

    if (test.length>0) {
      var movie = test
      axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + movie).then(
        function (movieResponse) {
          var movieInfo = movieResponse.data
          omdbLog(movieInfo)
        }
      )
    } else {
      var nobody = "Mr+Nobody"
      axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + nobody).then(
        function (movieResponse) {
          
          var movieInfo = movieResponse.data
          omdbLog(movieInfo)
        })
    }
  }

}

function logText() {
  fs.appendFile("log.txt", newInput + "\n", function (err) {
    if (err) {
      console.log(err);
    }
  })
}

function omdbLog(movieInfo) {
  console.log("------------------------")
  log(omdbDisplay.bold("Title : " + movieInfo.Title))
  log(omdbDisplay.bold("Year : " + movieInfo.Year))
  log(omdbDisplay.bold("IMDB rating : " + movieInfo.imdbRating))
  log(omdbDisplay.bold("Country : " + movieInfo.Country))
  log(omdbDisplay.bold("Language : " + movieInfo.Language))
  log(omdbDisplay.bold("Plot : " + movieInfo.Plot))
  log(omdbDisplay.bold("Actors : " + movieInfo.Actors))
  console.log("------------------------")
}
function logSpotify(spotifyResponse){
  
  log(spotifyDisplay.bold(gradient.rainbow("Song Name : " + spotifyResponse.name)))
  log(spotifyDisplay.bold(gradient.rainbow("Artist Name : " + spotifyResponse.artists[0].name)))
  log(spotifyDisplay.bold(gradient.rainbow("Album Name : " + spotifyResponse.album.name)))
  log(spotifyDisplay.bold(gradient.rainbow("Spotify Preview Link : " + spotifyResponse.external_urls.spotify)))
  log("\n-------------------")


}
// concert-this
// spotify-this-song
// movie-this
// do-what-it-says