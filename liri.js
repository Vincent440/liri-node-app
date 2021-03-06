require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const fs = require("fs");
const axios = require("axios");
const moment = require("moment");
const inquirer = require('inquirer');
const command = process.argv[2];//command starting as the second process
let search = process.argv.slice(3).join("+");//uses the input after the command for search parameter with + to fill spaces
let searchLog = "";//global search log variable to take search and remove the + from spaces and display to the user.
function liriCall(command, searchInput) {//switch statement to run command into to determine process to run
  switch (command) {
    case "concert-this":
      bandsInTownApi(searchInput);
      break;
    case "spotify-this-song":
      spotifyCall(searchInput);
      break;
    case "movie-this":
      movieDataCall(searchInput);
      break;
    case "do-what-it-says":
      doWhatItSayss();
      break;
    default:
      searchPromt();
  }
}
function bandsInTownApi(bands) {
  if (bands === "") {
    return searchPromt();
  }
  searchLog = bands.replace(/\+/g, " ");
  console.log(`\n\n=============== SEARCHING Bands In Town API FOR: ${searchLog} ===============`);
  axios.get(`https://rest.bandsintown.com/artists/${bands}/events?app_id=codingbootcamp`).then(response => {
    let events = response.data;
    for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
      let eventDate = moment(events[eventIndex].datetime).format("MM/DD/YYYY")
      console.log(`
        ================|  SHOWING EVENTS FOR: ${searchLog} Event #${(eventIndex + 1)} |=================
        Venue Name: ${events[eventIndex].venue.name}
        Location: ${events[eventIndex].venue.city}, ${events[eventIndex].venue.region} ${events[eventIndex].venue.country}
        Event Date: ${eventDate}`
      );
    }
    searchPromt();
  }).catch(error => {
    console.log("\nBands In Town Error Data: ",error);
    return searchPromt();
  });
}
function movieDataCall(movieSearch) {//OMDB Axios api call
  if (movieSearch === "") {
    movieSearch = "Mr+nobody";
  }
  searchLog = movieSearch.replace(/\+/g, " ");
  console.log("\n========  SEARCHING OMDB FOR: " + searchLog + "  =======================");
  axios
    .get("http://www.omdbapi.com/?t=" + movieSearch + "&apikey=trilogy")//.then for server response
    .then(response => {//data handling
      let movie = response.data;
      console.log("\n========  SHOWING SEARCH RESULTS FROM OMDB FOR: " + searchLog +
        "  =======================\n");
      console.log("TITLE: " + movie.Title); //TITLE OF MOVIE
      console.log("RELEASED: " + movie.Released); //YEAR OF RELEASE
      console.log("IMDB RATING: " + movie.imdbRating); //IMDB RATING OF MOVIE
      console.log(movie.Ratings[1].Source + " RATING: " + movie.Ratings[1].Value); //ROTTEN TOMATOES RATING OF MOVIE
      console.log("PRODUCED IN: " + movie.Country); //COUNTRY WHERE MOVIE WAS PRODUCED
      console.log("LAUNGUAGE OF FILM: " + movie.Language); //LANGUAGE OF THE MOVIE
      console.log("PLOT: " + movie.Plot); //PLOT OF THE MOVIE
      console.log("ACTORS: " + movie.Actors); //ACTORS IN THE MOVIE
      console.log("\n==========================================================================\n");
      searchPromt();
    }
    ).catch(error => {//error handling display error data and prompt new search
      console.log("An OMDB error occurred error data: " + error + "\n\n");
      return searchPromt();
    }
    );
}
function spotifyCall(song) {
  if (song === "") {//DEFAULT TO < "The Sign" > song by < "Ace of Base" > artist if no input
    song = "The+Sign+Ace+of+Base";
    searchLog = "The Sign, Ace of Base";
  }
  searchLog = song.replace(/\+/g, " ");
  console.log("\n=================================   SEARCHING SPOTIFY FOR: " + searchLog + "   ===============================\n");
  spotify.search({ type: "track", query: song }, (err, data) => {
    if (err) {
      console.log("A Spotify error occurred: " + err + "\n\n");
      return searchPromt();
    }
    let results = data.tracks.items;
    for (let sIndex = 0; sIndex < 5; sIndex++) {// sIndex = Spotify data array index number print 5 songs that match search params.
      console.log("\n--------------------------  SONG#: " + (sIndex + 1) + " INFO  ----------------------------\n ");
      console.log("ARTIST NAME:  " + results[sIndex].album.artists[0].name);//ARTIST(s)
      console.log("\nSONG NAME:  " + results[sIndex].name);//THE SONG'S NAME
      console.log("\nSPOTIFY TRACK URL:  " + results[sIndex].external_urls.spotify);//PREVIEW LINK OF THE SONG FROM SPOTIFY
      console.log("\nALBUM NAME:  " + results[sIndex].album.name);//ALBUM NAME THE SONG IS FROM
    }
    console.log("\n==================================  END OF " + searchLog + " SPOTIFY SEARCH  =================================================\n");
    searchPromt();
  });
}
function doWhatItSayss() {
  console.log("...\n\nReading <command>,<\"search\"> from random.txt file: \n");
  fs.readFile("random.txt", "utf8", (err, data) => {
    if (err) {
      console.log("Error reading from random.txt file error: " + err);
      return searchPromt();
    }
    data = data.split(",");//breaks up the command from the input at the "," comma
    let fileCommand = data[0];
    let fileSearch = data[1].slice(1, -1).replace(/ /g, "+");//replace the second array index " " with +'s to create a usable search input
    liriCall(fileCommand, fileSearch);
  });
}
function searchPromt() {//inquirer search prompt to allow multiple searches and default to if there is no input.
  console.log("\n-------  Welcome to the LIRI Application please enter a valid [command] and [search input]  ------\n");
  console.log("Valid LIRI Commands are:\nnode liri < command > < search >\n")
  console.log("concert-this < Artist to search for on Bands In Town >"
    + "\nspotify-this-song < Track to search for on Spotify >\nmovie-this < Movie to search for on OMDB >" +
    "\ndo-what-it-says < executes random.txt command,\"search\" >\n\n"
  );
  inquirer
    .prompt([
      {
        name: "command",
        type: "list",
        message: "Select a Command for what you would like to do:",
        choices: ["concert-this", "spotify-this-song", "movie-this", "EXIT LIRI"]
      },
      {
        name: "searchValue",
        message: "Enter what you would like to search for here: ",
        validate: value => {
          if (value.length > 0) {
            return true;
          } else {
            return console.log(" Please enter something to search for ");
          }
        }, when: answers => {
          if (answers.command === "EXIT LIRI") {
            return false;
          }
          return true;
        }
      }
    ])
    .then(answers => {
      let inqCommand = answers.command;
      if (inqCommand === "EXIT LIRI") {
        return console.log("\nGoodbye! Thanks for using the LIRI application\n");
      }
      let inqSearch = answers.searchValue.replace(/ /g, "+");
      liriCall(inqCommand, inqSearch);
    });
}
liriCall(command, search);