require("dotenv").config();
var moment = require("moment")
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api")
const chalk = require("chalk")
const chalkAnimation=require("chalk-animation")
const gradient = require('gradient-string');
var spotify = new Spotify(keys.spotify)
var fs = require("fs")
var fromTheTop = process.argv
var newInput = fromTheTop.slice(2)
const log = console.log;

var bandDisplay = chalk.blue.bgRed
var spotifyDisplay = chalk.bgBlack
var omdbDisplay=chalk.yellow.bgMagenta

concert()
spotSearch();
omdb();
read();

function read(){
  if(newInput[0]==="do-what-it-says"){
fs.readFile("random.txt", "utf8", function (err, data) {
  console.log(data)
  fromTheTop.slice(2)
  newInput=data.split(",")
  
  spotSearch()
  omdb()
  concert()
  if (err) {
    return console.log(err)
  }

})
}
}
function spotSearch() {
  logText();
  if (newInput[0].toLowerCase() === "spotify-this-song") {
    var song = newInput[1]
    spotify.search({
        type: 'track',
        query: song
      })
      .then(function (response) {

        for (let index = 0; index < 5; index++) {
          var spotifyResponse = response.tracks.items[index]


          log(spotifyDisplay.bold(gradient.rainbow("Song Name : " + spotifyResponse.name)))
          log(spotifyDisplay.bold(gradient.rainbow("Artist Name : " + spotifyResponse.artists[0].name)))
          log(spotifyDisplay.bold(gradient.rainbow("Album Name : " + spotifyResponse.album.name)))
          log(spotifyDisplay.bold(gradient.rainbow("Spotify Preview Link : " + spotifyResponse.external_urls.spotify)))
          log("\n-------------------")


        }

      })
  }
}

function concert() {

  if (newInput[0].toLowerCase() === "concert-this") {
    var artist = newInput[1]
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
function omdb(){
logText();
if (newInput[0].toLowerCase() === "movie-this") {
  var movie = newInput[1]
  

axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + movie).then(
  function (movieResponse) {
    var movieInfo=movieResponse.data
    log(omdbDisplay.bold("Title : " +movieInfo.Title))
    log(omdbDisplay.bold("Year : "+movieInfo.Year))
    log(omdbDisplay.bold("IMDB rating : " +movieInfo.imdbRating))
    log(omdbDisplay.bold("Country : "+movieInfo.Country))
    log(omdbDisplay.bold("Language : "+movieInfo.Language))
    log(omdbDisplay.bold("Plot : " +movieInfo.Plot))
    log(omdbDisplay.bold("Actors : " +movieInfo.Actors))
  }
)
}else if(newInput[1]===undefined&&newInput[0].toLowerCase() === "movie-this"){
  var nobody="Mr.Nobody"
  axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + nobody).then(
  function (movieResponse) {
    console.log(movieResponse)
    var movieInfo=movieResponse.data
    console.log("------------------------")
    log(omdbDisplay.bold("Title : " + movieInfo.Title))
    log(omdbDisplay.bold("Year : "+movieInfo.Year))
    log(omdbDisplay.bold("IMDB rating : " +movieInfo.imdbRating))
    log(omdbDisplay.bold("Country : "+movieInfo.Country))
    log(omdbDisplay.bold("Language : "+movieInfo.Language))
    log(omdbDisplay.bold("Plot : " +movieInfo.Plot))
    log(omdbDisplay.bold("Actors : " +movieInfo.Actors))
    console.log("------------------------")
  })
}

}

console.log("here are the commands!")
console.log("concert-this [enter artist name]")
console.log("spotify-this-song [enter song name]")
console.log("movie-this [enter movie title]")
console.log("do-what-it-says[edit random.txt with song name]")
console.log("\n")
function logText() {
  fs.appendFile("log.txt", newInput + "\n", function (err) {
    if (err) {
      console.log(err);
    }
  })
}
// concert-this
// spotify-this-song
// movie-this
// do-what-it-says