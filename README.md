# liri-node-app

   * LIRI is a _Language Interpretation and Recognition Interface_. LIRI is designed to be a command line node app that takes in parameters and displays data to the console.

   * LIRI will search:

     * Spotify for songs

     * Bands in Town for concerts

     * OMDB for movies.

   * Using Axios to make the calls to Bands In Town API & OMDB API

   * Using the node-spotify-api npm package to make the spotify API calls 

   * Utilizing Inquirer npm  to take in user input for addional searches & Allow more then one command to be ran each execution of the application. 

---

## This application Allows the user to search 3 different API's depending on the selected or Inputted command. 

The liri command line node application allows you to search three separate APIs quickly in one application to display Data, using keywords for the commands to determine which API to search then the app will display the results of that API's response to the console after api request is done. LIRI will then prompt the user to see if they would like to search again. 

      If they select NO the liri.js process will terminate 

      If they select YES
      liri will then display a list of the three possible commands to search from before allowing the user to input a new search after the command is selected.

 _If any of the searches an error occurs the error data will display and prompt the user to select Yes or no to if they would like to ask another question, default: No, closes the app. Answering Yes allows you to search again until you select no to the Search again prompt._ 

### How the liri.js App works

   * node liri spotify-this-song < song name > [Spotify API Track Search Endpoint](https://developer.spotify.com/console/get-search-item/)

   * node liri movie-this < movie name > [OMDB API](http://www.omdbapi.com)

   * node liri concert-this < artist or band > [Bands In Town API](http://www.artists.bandsintown.com/bandsintown-api)

   * node liri do-what-it-says     _(will read from the random.txt file.)_

   *The LIRI application utilizes and requires these npm packages:*

  * [Moment](https://www.npmjs.com/package/moment)

  * [DotEnv](https://www.npmjs.com/package/dotenv)

  * [Axios](https://www.npmjs.com/package/axios)

  * [inquirer](https://www.npmjs.com/package/inquirer)

  * [node-spotify-api](https://www.npmjs.com/package/node-spotify-api)

---

## Getting Started with the LIRI node command line application

_**WARNING: If you are not familiar with the bash/terminal this app may not be suitible for you but feel free to try anyways**_.

Welcome user! So you want to use my command line node app? Okay! lets get started.
 You are going to need to have [Node.js](https://nodejs.org/en/) Installed in order to run this javascript file in the terminal or command line. Assuming you are familiar with node as well as the terminal/cli and are ready to move on continue to the next steps 


 * STEP ONE: You will need to go to my [Github](https://github.com/Vincent440/liri-node-app) repository, you can then either fork the repository and copy the Clone with HTTPS link and run the following command from your terminal or bash window or clone my repository the same way using the link on my Github repo the command will look like this in the terminal:

```
git clone https://github.com/Vincent440/liri-node-app.git
```
 Running that command on your computers terminal or command line will download the repository to your computers local drive. and you should see the following :

 [image of git clone screen shot will go here]


* STEP TWO: You will have to run npm install to download the required npm packages in order for the application to function. that command will look like:

```
npm install
npm i
```
After running that command in the terminal you should have all the required packages installed a package-lock.json file created with a node modules directory made and populated with the required files.

[image of node packages successfully completed install goes here]

* STEP THREE: You are going to need to create a .env file in the same directory (this is where your Spotify api ID & Secret will go later). After you have all the files created you will need to make sure you have an API Key for each of the API's. Two are included in the REPO you will however need a Spotify Key Visit [Spotifys Developer page here](https://developer.spotify.com/my-applications/#!/applications/create) to get one. Your spotify api key will go in the **.env** file which will look like : 

```
# Spotify API keys

SPOTIFY_ID=YOUR SPOTIFY API ID WILL NEED TO BE STORED HERE
SPOTIFY_SECRET=YOUR SPOTIFY SECRET WILL NEED TO BE STORED HERE 

```

Once you have the Spotify ID & Secret in place of the text above after the "=". you will be ready to run the liri.js application in the terminal to use it! Open up your terminal/bash CLI and SEE BELOW for a preview of the application in use to help you get started!

--- 

## Using liri.js & _Example Commands_ 



```
node liri concert-this A Day To Remember
node liri spotify-this-song Wake me up when september ends
node liri movie-this Guardians of the Galaxy Vol.2
node liri do-what-it-says
```