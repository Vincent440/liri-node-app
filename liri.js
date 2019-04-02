require( "dotenv" ).config();

var keys = require( "./keys.js" );
var Spotify = require( 'node-spotify-api' );
var spotify = new Spotify( keys.spotify );
var fs = require( "fs" );
var axios = require( "axios" );
var moment = require('moment');

//============================================  GLOBAL VARIABLES  ====================================================
var command = process.argv[2];
var inputValue = process.argv;
var search = "";
var searchLog = "";

for (var i = 3 ; i < inputValue.length ; i++ ) {

    if ( i > 3 && i < inputValue.length ) {
      search = search + "+" + inputValue[ i ];
      searchLog = searchLog + " " + inputValue[ i ];
    }
    else {
      search += inputValue[ i ];
      searchLog += inputValue[ i ];
    }
}


switch( command ) {
case "concert-this":
     bandsInTownApi();
    break;
case "spotify-this-song":
     spotifyCall();
    break;
case "movie-this":
     movieDataCall();
    break;
case "do-what-it-says":
     console.log( " DO WHAT IT SAYS work in progress " );
    break;
default:
    console.log( "\n\n---  Please Enter Valid Input  ---\n\nCommands are:\nconcert-this\nspotify-this-song\nmovie-this\ndo-what-it-says" );
}
//=================================================================================================================================

function bandsInTownApi() {
    //---------------------------------- BANDS IN TOWN   ------------ app_id=codingbootcamp
    axios.get( "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp" )
        .then(//.then for server response 
            function ( response ) { //data handling
                var events = response.data;
                for (let eventIndex = 0 ; eventIndex < events.length ; eventIndex ++ ) {
                    //Loop through each index of response array

                    console.log( "\n================ EVENS FOR:" + searchLog + " Event #" + eventIndex + "  =================\n" );
                    console.log( "Venue Name: " + events[eventIndex].venue.name ); //Name of the venue
                    console.log( "Location: " + events[eventIndex].venue.city + ", " + events[eventIndex].venue.country );//Venue location
                    let eventTime = events[eventIndex].datetime;
                    //Date of the Event (use moment to format this as "MM/DD/YYYY")
                    console.log( "EVENT TIME: " + moment( eventTime ).format( "MM/DD/YYYY" ) + "\n" );
                }
            }
        )
        .catch(//.catch errors 
            function ( error ) {//error handling
                console.log( "====================  INTO .CATCH ERROR HANDLING  ==========================" );
                console.log( error );
                console.log( "====================  END OF .CATCH ERROR HANDLING  ========================" );
            }
        );
}
//==================================================================================================================================
function movieDataCall(){

    if ( search === "" )  {
        search = "Mr+nobody";  
        searchLog = "Mr Nobody"; 
    }
    console.log( "\nSEARCHING OMDB FOR: " + searchLog );

    axios.get( "http://www.omdbapi.com/?t=" + search + "&apikey=trilogy" )
        .then(//.then for server response 
            function ( response ) { //data handling
                let movie = response.data
                console.log( "\n===========  SHOWING SEARCH RESULTS FROM OMDB FOR: " + searchLog + "  ===================\n" );
                console.log( "TITLE: " + movie.Title );//TITLE OF MOVIE                
                console.log( "RELEASED: " + movie.Released );//YEAR OF RELEASE
                console.log( "IMDB RATING: " + movie.imdbRating);//IMDB RATING OF MOVIE
                console.log(  movie.Ratings[1].Source + " RATING: " + movie.Ratings[1].Value );//ROTTEN TOMATOES RATING OF MOVIE
                console.log( "PRODUCED IN: " + movie.Country ); //COUNTRY WHERE MOVIE WAS PRODUCED
                console.log( "LAUNGUAGE OF FILM: " + movie.Language );//LANGUAGE OF THE MOVIE
                console.log( "PLOT: " + movie.Plot );//PLOT OF THE MOVIE      
                console.log( "ACTORS: " + movie.Actors ); //ACTORS IN THE MOVIE
                console.log( "\n==========================================================================" );   
            }
        )
        .catch(//.catch errors 
            function ( error ) {//error handling
                console.log( "====================  INTO .CATCH ERROR HANDLING  ==========================" );
                console.log( error );
                console.log( "====================  END OF .CATCH ERROR HANDLING  ========================" );
            }
        );
}
//===================================================================================================================================
function spotifyCall(){
    search = "yellow+submarine";

    if ( search === "" )  {
        search = "The+Sign";  
        searchLog = "The Sign"; 
    }

    console.log("SEARCHING SPOTIFY FOR:" + search);

    spotify
        .request('https://api.spotify.com/v1/search?q=' + search + "&type=track")
        .then(function ( data ) {

            console.log( "\n=========  SPOTIFY DATA  ==================\n" );

            let results = data.tracks.items;
            console.log(results[0]);
            /*
            for ( let spotifiyIndex = 0 ; spotifiyIndex < results.legnth ; spotifiyIndex ++ ) {
                console.log( "DATA INDEX: " + results[spotifiyIndex] );
            }
            */
           //RESULTS DISPLAYED
           //ARTIST(s)
           //THE SONG'S NAME
           //A PREVIEW LINK OF THE SONG FROM SPOTIFY
           //THE ALBUM NAME THE SONG IS FROM 

           //DEFAULT TO < "The Sign" > song by < "Ace of Base" > artist if no input

        })
        .catch(function ( err ) {
            console.error( 'Error occurred: ' + err );
        });
}
//=====================================================================================================================================