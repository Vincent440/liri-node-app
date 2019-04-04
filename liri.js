require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var inquirer = require('inquirer');
var command = process.argv[2];//command starting as the second process 
var search = process.argv.slice(3).join("+");//uses the input after the command for search parameter with + to fill spaces
var searchLog="";//global search log variable to take search and remove the + from spaces and display to the user. 
function liriCall( command , searchInput ) {//switch statement to run command into to determine process to run  
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
function bandsInTownApi(bands) {//bands in town api call, if no input selected calls search prompt 
  if (bands === ""){
   return searchPromt();
  }
  searchLog = bands.replace(/\+/g, " ");
  console.log("\n\n===============  SEARCHING Bands In Town API for: " + searchLog + "  ===============");
  axios.get("https://rest.bandsintown.com/artists/" + bands + "/events?app_id=codingbootcamp").then(response => {//data handling
        let events = response.data;
        for ( let eventIndex = 0 ; eventIndex < events.length; eventIndex++ ) {//Loop through entire response array
          console.log("\n================|  SHOWING EVENTS FOR: " + searchLog 
          +  " Event #" +  (eventIndex +1)+  "  |=================\n");
          console.log("Venue Name: " + events[eventIndex].venue.name); //Name of the venue
          console.log("Location: " + events[eventIndex].venue.city + ", " + events[eventIndex].venue.region 
          + " " + events[eventIndex].venue.country ); //Venue location
          let eventTime = events[eventIndex].datetime;//date of event
          console.log("Event Date: " + moment(eventTime).format("MM/DD/YYYY") + "\n");
        }
        searchAgain();
      }
    ).catch(error => {
        console.log("\nBands In Town Error Data: " + error +"\n\n");
        return searchAgain();
      }
    );
}
function movieDataCall(movieSearch) {//OMDB Axios api call
  if (movieSearch === "") {
    movieSearch = "Mr+nobody";
  }
  searchLog = movieSearch.replace(/\+/g, " ");
  console.log("\n========  SEARCHING OMDB FOR: " + searchLog + "  =======================" );
  axios
    .get("http://www.omdbapi.com/?t=" + movieSearch + "&apikey=trilogy")//.then for server response
    .then(response => {//data handling 
        let movie = response.data;
        console.log("\n========  SHOWING SEARCH RESULTS FROM OMDB FOR: " +  searchLog +
         "  =======================\n" );
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
    ).catch(error => {//error handling display error data and prompt new search
        console.log("An OMDB error occurred error data: "+error+"\n\n");
        return searchAgain();
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
  spotify.search({ type: "track", query: song }, (err, data) =>{
    if (err) {
      console.log("A Spotify error occurred: " + err +"\n\n");
      return searchAgain();
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
function doWhatItSayss() {
  console.log("...\n\nReading <command>,<\"search\"> from random.txt file: \n");
    fs.readFile("random.txt", "utf8", (err, data)=> {
      if (err) {
        console.log("Error reading from random.txt file error: "+err);
        return searchAgain();
        
      }
      data = data.split(",");//breaks up the command from the input at the "," comma
      let fileCommand = data[0];
      let fileSearch = data[1].slice(1,-1).replace(/ /g, "+");//replace the second array index " " with +'s to create a usable search input
      liriCall( fileCommand , fileSearch );
    });
}
function searchPromt() {//inquirer search prompt to allow multiple searches and default to if there is no input. 
  console.log("\n\n\n\n\n\n\n\n-------  Welcome to the LIRI Application please enter a valid [command] and [search input]  ------\n");
  console.log("Valid LIRI Commands are:\nnode liri < command > < search >\n")
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
      validate: value => {
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
      message:"\nWould you like to search again? ",
      default: false
     }
    ])
    .then(answers => {
     let searchAgain = answers.continue;
     if (searchAgain){
       searchPromt();
     }
     else {
      return console.log("\nThanks for using the LIRI application\n");
     }
    });
}
liriCall(command, search);