//declaring our variables and our required parameters from our node modules

require("dotenv").config();
var moment = require("moment")
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api")
const chalk = require("chalk")
const chalkAnimation = require('chalk-animation')
const gradient = require('gradient-string');
var spotify = new Spotify(keys.spotify)
var fs = require("fs")

//taking the process and striking the default inputs to make sure that we are making the array the first things that are inputted in the terminal
var fromTheTop = process.argv
var newInput = fromTheTop.slice(2)



var test=newInput.slice(1).join(" ")

var param=newInput[0]
// made a constant for console log to be able to use chalk easier
const log = console.log;
//created some stored variables with chalk parameters
var bandDisplay = chalk.blue.bgRed
var spotifyDisplay = chalk.bgBlack
var omdbDisplay = chalk.yellow.bgMagenta
//calling the functions of everything at the start of the program and passing in the command & search
concert(param,test)
spotSearch(param,test);
omdb(param,test);
read(param,test);

//reading the file random.txt and executing the function automatically based on response.
function read() {
  if (param === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (err, data) {
      //striking our initial input from the array
      fromTheTop.slice(2)
      test = data.split(",")
      var readParam1=test[0]
      var readParam2=test[1]
      //calling all of the functions and passing the parameters
      spotSearch(readParam1,readParam2)
      omdb(readParam1,readParam2)
      concert(readParam1,readParam2)
      if (err) {
        return console.log(err)
      }

    })
  }
}
//spotify search
function spotSearch(param,test) {
  //making sure that the parameter equals the song command then we run through and make an axios call
  if(param==="spotify-this-song"){
  logText();
  if (test.length>0) {
    var song = test

    spotify.search({
        type: 'track',
        query: song
      })
      .then(function (response) {
        //made a log function for spotify because of the many lines it took.
        //had to do a loop because we were pulling multiple searches
        // limited the results to 5 because it was appending too many results
        for (let index = 0; index < 5; index++) {
          var spotifyResponse = response.tracks.items[index]
          logSpotify(spotifyResponse)
        }

      })
  } else{

    //default search condition made with same context of regular search
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
//function concert
function concert(param,test) {
//axios call to bands in town api to get a result
  if (param=== "concert-this") {
    var artist = test
    logText();
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
      function (response) {
        var bandData = response.data
          //looping through the results and displaying the information requested
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
  //omdb call 
  if (param === "movie-this") {
    logText();

    if (test.length>0) {
      var movie = test
      axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + movie).then(
        function (movieResponse) {
          var movieInfo = movieResponse.data
          //we are calling the omdbLog function and passing in the result we get from axios
          //this will display the lines of information requested.
          omdbLog(movieInfo)
        }
      )
    } else {

      // placeholder for if they type in the command with no search does a default search for Mr Nobody
      var nobody = "Mr+Nobody"
      axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + nobody).then(
        function (movieResponse) {
          
          var movieInfo = movieResponse.data
          omdbLog(movieInfo)
        })
    }
  }

}
// we call this function to log all commands that node enters in the entirety of its existence
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
  if(movieInfo.Ratings[1]){
  log(omdbDisplay.bold("Rotten Tomatoes : " + movieInfo.Ratings[1].Value))
  }
  log(omdbDisplay.bold("Country : " + movieInfo.Country))
  log(omdbDisplay.bold("Language : " + movieInfo.Language))
  log(omdbDisplay.bold("Plot : " + movieInfo.Plot))
  log(omdbDisplay.bold("Actors : " + movieInfo.Actors))
  console.log(movieInfo)
  console.log("------------------------")
}
function logSpotify(spotifyResponse,){
  
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