// Load the modules
var express = require('express'); //Express - a web application framework that provides useful utility functions like 'http'
var app = express();
var path = require('path');
var bodyParser = require('body-parser'); // Body-parser -- a library that provides functions for parsing incoming requests
app.use(bodyParser.json());              // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies
const axios = require('axios');
const qs = require('query-string');

// Set the view engine to ejs
app.set('views', path.join(__dirname, '/views')); // Sets the view path since I added a src folder. App cannot find views path without this
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));// Set the relative path; makes accessing the resource directory easier
console.log(__dirname)

//Create Database Connection
var pgp = require('pg-promise')();

const dev_dbConfig = {
	host: 'db',
	port: 5432,
	database: process.env.POSTGRES_DB,
	user:  process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD
};

/** If we're running in production mode (on heroku), the we use DATABASE_URL
 * to connect to Heroku Postgres.
 */
const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;

// Heroku Postgres patch for v10
// fixes: https://github.com/vitaly-t/pg-promise/issues/711
if (isProduction) {
  pgp.pg.defaults.ssl = {rejectUnauthorized: false};
}

const db = pgp(dbConfig);
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
  let query = 'select * from reviews;';
	db.any(query)
        .then(function (rows) {
          console.log(rows)
          res.render('pages/reviews',{
				  rows: rows
			})

        })
        .catch(function (err) {
            console.log('error', err);
            res.render('pages/reviews', {
                rows: rows
            })
        })
})

app.post('/reviews', function(req, res) {
    //Create date for database insert
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let formattedDate = year + '-' + month + '-' + day

    let insertQuery = `INSERT INTO reviews(artist, review, review_date) VALUES ('${req.body.artist}','${req.body.review}','${formattedDate}');`
    let query = 'SELECT * FROM reviews;';

    db.any(insertQuery)
    .then(db.any(query)
    .then(function(rows) {
      //console.log(rows)
      res.render('pages/reviews',{
      rows: rows
      })
    })
    .catch(function (err) {
        console.log('error', err);
        res.render('pages/reviews', {
            rows: rows
        })
    }))
  
})

app.post('/reviews/filter', function(req, res) {
  let artist = req.body.filter.toLowerCase();
  let query = `SELECT * FROM reviews WHERE lower(artist) = '${artist}'`
  console.log(query)

  db.any(query)
  .then(function (rows) {
    console.log(rows)
    res.render('pages/reviews',{
    rows: rows
})

  })
  .catch(function (err) {
      console.log('error', err);
      res.render('pages/reviews', {
          rows: rows
      })
  })
})

app.listen(3000);
console.log('listening on port 3000');