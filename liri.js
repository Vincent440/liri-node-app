/* eslint-disable no-console */
/* eslint-disable no-undef */
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var inquirer = require('inquirer');
//=================================================== ✓  GLOBAL VARIABLES ✓  ====================================================
var command = process.argv[2];
var inputValue = process.argv;
var search = "";//get search values + add more then one together with "+'s" 
var searchLog ="";
//===============================================================================================================================

for ( var i = 3; i < inputValue.length; i++ ) {//if more then 3 parameters add them together to build search query
  if (i > 3 && i < inputValue.length) {
    search = search + "+" + inputValue[i];
  } else {
    search += inputValue[i];
  }
}
//===============================================================================================================================
function liriCall( command , searchInput ) {

  switch (command) {//switch statement to run command into to determine process to run
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
//===============================================================================================================================
function bandsInTownApi(bands) {
  if (bands === ""){
    console.log("\nEnter a band to search for!\n");
    searchPromt();
    return;
  }

  console.log(bands);
  searchLog = bands.replace(/\+/g, " ");
  console.log(searchLog);

  console.log("=============== SEARCHING Bands In Town API for: " + searchLog + "  ===============");

  //IF STATEMENT TO CATCH IF NO USER INPUT FOR ARTIST TO SEARCH, CALL INQUIRER FUNCTION TO TAKE IN A SEARCH INPUT BEFORE FINISHING THE FUNCTION
  //---------------------------------- BANDS IN TOWN   ------------ app_id=codingbootcamp
  axios
    .get("https://rest.bandsintown.com/artists/" + bands + "/events?app_id=codingbootcamp")
    .then(//.then for server response
      function( response ) {//data handling
        let events = response.data;
        for ( let eventIndex = 0 ; eventIndex < events.length; eventIndex++ ) {
          //Loop through each index of response array

          console.log(
            "\n================|  SHOWING EVENTS FOR: " +
              searchLog +
              " Event #" +
              eventIndex +
              "  |=================\n"
          );

          console.log("Venue Name: " + events[eventIndex].venue.name); //Name of the venue
          console.log(
            "Location: " + events[eventIndex].venue.city + ", " + events[eventIndex].venue.region +
             " " + events[eventIndex].venue.country ); //Venue location
          let eventTime = events[eventIndex].datetime;
          //Date of the Event (use moment to format this as "MM/DD/YYYY")
          console.log("Event Date: " + moment(eventTime).format("MM/DD/YYYY") + "\n");
        }
        searchAgain();
      }

    )
    .catch(
      function( error ) {
        //error handling to .catch errors
        console.log("==========================|  INTO .CATCH ERROR HANDLING  |============================");
        console.log(error);
        console.log("==========================|  END OF .CATCH ERROR HANDLING  |==========================");
        searchAgain();
      }
    );
}
//===============================================================================================================================
function movieDataCall(movieSearch) {

  if (movieSearch === "") {
    movieSearch = "Mr+nobody";
  }
  searchLog = movieSearch.replace(/\+/g, " ");

  console.log("\n========  SEARCHING OMDB FOR: " + searchLog + "  =======================" );
  axios
    .get("http://www.omdbapi.com/?t=" + movieSearch + "&apikey=trilogy")
    .then(
      //.then for server response
      function(response) {
        //data handling
        let movie = response.data;
        console.log(
          "\n================  SHOWING SEARCH RESULTS FROM OMDB FOR: " +
            searchLog +
            "  =======================\n"
        );
        console.log("TITLE: " + movie.Title); //TITLE OF MOVIE
        console.log("RELEASED: " + movie.Released); //YEAR OF RELEASE
        console.log("IMDB RATING: " + movie.imdbRating); //IMDB RATING OF MOVIE
        console.log(movie.Ratings[1].Source + " RATING: " + movie.Ratings[1].Value); //ROTTEN TOMATOES RATING OF MOVIE
        console.log("PRODUCED IN: " + movie.Country); //COUNTRY WHERE MOVIE WAS PRODUCED
        console.log("LAUNGUAGE OF FILM: " + movie.Language); //LANGUAGE OF THE MOVIE
        console.log("PLOT: " + movie.Plot); //PLOT OF THE MOVIE
        console.log("ACTORS: " + movie.Actors); //ACTORS IN THE MOVIE
        console.log("\n==========================================================================\n");
        searchAgain();
      }
    )
    .catch(
      //.catch errors
      function(error) {
        //error handling
        console.log("====================  INTO .CATCH ERROR HANDLING  ==========================");
        console.log(error);
        console.log("====================  END OF .CATCH ERROR HANDLING  ========================");
        searchAgain();
      }
    );
}
//===============================================================================================================================
function spotifyCall(song) {

  if (song === "") {//DEFAULT TO < "The Sign" > song by < "Ace of Base" > artist if no input
    song = "The+Sign+Ace+of+Base";
    searchLog = "The Sign, Ace of Base";
  }
  searchLog = song.replace(/\+/g, " ");

  console.log("\n=================================   SEARCHING SPOTIFY FOR: " + searchLog + "   ===============================\n");
  spotify.search({ type: "track", query: song }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    } 
    let results = data.tracks.items;

    for (let sIndex = 0; sIndex < 5; sIndex++) {// sIndex = Spotify data array index number print 5 songs that match search params.
        console.log( "\n--------------------------  SONG#: " + (sIndex + 1) + " INFO  ----------------------------\n ");
        console.log( "ARTIST NAME:  " + results[sIndex].album.artists[0].name );//ARTIST(s)
        console.log( "\nSONG NAME:  " + results[sIndex].name);//THE SONG'S NAME
        console.log( "\nSPOTIFY TRACK URL:  " + results[sIndex].external_urls.spotify );//PREVIEW LINK OF THE SONG FROM SPOTIFY
        console.log( "\nALBUM NAME:  " + results[sIndex].album.name);//ALBUM NAME THE SONG IS FROM 

    }

    console.log("\n==================================  END OF " + searchLog + " SPOTIFY SEARCH  =================================================\n");
    
    searchAgain();
  });

}
//===============================================================================================================================
function doWhatItSayss() {
    fs.readFile("random.txt", "utf8", function(err, data) {
      if (err) {
        return console.log(err);
      }
      debugger;
      data = data.split(",");//breaks up the command from the input at the "," comma
      let fileCommand = data[0];
      let fileSearch = data[1].slice(1).replace(/ /g, "+");//replace the second array index " " with +'s to create a usable search input
      liriCall( fileCommand , fileSearch );
    });
}
function searchPromt() {//DEFAULT TO THIS, LATER USE INQUIRER FUNCTION TO TAKE IN ANOTHER COMMAND.  
  //IF THE COMMANDS DON'T MATCH A VALID COMMAND.
  console.log("\n\n------- Welcome to the LIRI Application please enter a valid [command] and [search input]  ------\n\n");
  console.log("Valid LIRI Commands are:\n\n node liri < command > < search >\n")
  console.log("concert-this < Artist to search for on Bands In Town >"
    + "\nspotify-this-song < Track to search for on Spotify >\nmovie-this < Movie to search for on OMDB >"+
    "\ndo-what-it-says < executes random.txt command,\"search\" >\n\n"
  );

  inquirer
    .prompt([
      {
      name: "command",
      type: "list",
      message:"Select a Command for what you would like to do:",
      choices:["concert-this","spotify-this-song","movie-this"]
     },
     {
      name: "searchValue",
      message: "Enter what you would like to search for here: ",
      validate: function(value) {
        if(value.length > 0) {
            return true;
        } else {
          console.log(" Please enter something to search for ");
            return false;
        }
    }
     }
    ])
    .then(answers => {
     let inqCommand = answers.command;
     let inqSearch = answers.searchValue.replace(/ /g, "+");
     liriCall(inqCommand,inqSearch);
    });
}
function searchAgain(){
  inquirer
    .prompt([
      {
      name: "continue",
      type: "confirm",
      message:"Would you like to search again? ",
      default: false
     }
    ])
    .then(answers => {
     let searchAgain = answers.continue;
     if (searchAgain){
       searchPromt();
     }
     else {
       console.log("\nThanks for using the LIRI application\n");
       return;
     }
    });
}

liriCall(command, search);

//DO BONUS / add functions for inquirer prompt to keep program alive