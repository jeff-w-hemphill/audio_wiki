// Load the modules
var express = require('express'); //Express - a web application framework that provides useful utility functions like 'http'
var app = express();
var bodyParser = require('body-parser'); // Body-parser -- a library that provides functions for parsing incoming requests
app.use(bodyParser.json());              // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies
const axios = require('axios');
const qs = require('query-string');

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));// Set the relative path; makes accessing the resource directory easier


// Home page - DON'T CHANGE
app.get('/', function(req, res) {
    axios({
      url: `https://www.theaudiodb.com/api/v1/json/2/search.php?s=red_hot_chili_peppers`,
        method: 'GET',
        dataType:'json',
      })
      .then(items => {
          console.log("Loading RHCP")
          artistName = items.data.artists[0].strArtist
          banner = items.data.artists[0].strArtistBanner
          website = items.data.artists[0].strWebsite
          year = items.data.artists[0].intFormedYear
          genres = items.data.artists[0].strGenre
          bio = items.data.artists[0].strBiographyEN

          res.render('pages/main', { 
            artistName: artistName,
            banner: banner,
            website: website,
            year: year,
            genres: genres,
            bio: bio
           } )
           console.log('Done')
        })
        .catch(error => {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
          }
        });
});

app.post('/', function(req, res) {
    let artist = req.body.artist
    axios({
      url: `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${artist}`,
        method: 'GET',
        dataType:'json',
      })
      .then(items => {
          console.log(`Loading ${artist}`)
          if (items.data.artists != null) {
          artistName = items.data.artists[0].strArtist
          banner = items.data.artists[0].strArtistBanner
          website = items.data.artists[0].strWebsite
          year = items.data.artists[0].intFormedYear
          genres = items.data.artists[0].strGenre
          bio = items.data.artists[0].strBiographyEN
          } else {
            console.log('error, no matching artist')

            artistName = 'Artist does not exist'
            banner = ''
            website = '-'
            year = '-'
            genres = '-'
            bio = '-'
          }
          console.log(website)
    
          res.render('pages/main', { 
            artistName: artistName,
            banner: banner,
            website: website,
            year: year,
            genres: genres,
            bio: bio
           } )
           console.log('Done')
        })
        .catch(error => {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
          }
        });
})

app.get('/reviews', function(req, res) {
  res.render('pages/reviews', {
    my_title: "reviews",
    items: '',
    error: false,
    message: ''
  })
})

app.put('/reviews', function(req, res) {

})

app.listen(3000);
console.log('listening on port 3000');