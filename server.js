var express = require('express');
var cors = require('cors');
var AWS = require('aws-sdk');

var app = express();
var db = new AWS.DynamoDB();
var s3 = new AWS.S3();

app.use(cors());

app.get('/', function(req, res) {
   res.send('Welcome to Spooterfy')
});

app.get('/music', function(req, res) {
   s3.listObjects({
     Bucket: 'testy-tester-351541531532'
   }, function(err, data) {
      if (err) return res.status(400).send({ message: err.message });
      var response = {
         statusCode: 200,
         body: {
            records: data.Contents
         }
      }
      return res.send(response);
   });
});

app.get('/genres', function(req, res) {
   db.scan({
      TableName: 'music',
   }, function(err, data) {
      if (err) return res.status(400).send({ message: err.message });

      let allGenreItems = data.Items.map(item => item.genre.S);
      let genres = [...new Set(allGenreItems)];

      var response = {
         statusCode: 200,
         body: {
            records: genres
         }
      };
      return res.send(response);
   });
});

app.get('/artists/for/genre', function(req, res) {
   db.query({
      TableName: 'music',
      KeyConditionExpression: 'genre = :genre',
      ExpressionAttributeValues: {
         ':genre': {
            S: req.query.genre
         }
      }
   }, function(err, data) {
      if (err) return res.status(400).send({ message: err.message });

      let allArtistItems = data.Items.map(item => item.artist.S);
      let artists = [...new Set(allArtistItems)];

      var response = {
         statusCode: 200,
         body: {
            records: artists
         }
      };
      return res.send(response);
   });
});

app.get('/albums/for/artist', function(req, res) {
   db.query({
      TableName: 'music',
      IndexName: 'artist-index',
      KeyConditionExpression: 'artist = :artist',
      ExpressionAttributeValues: {
         ':artist': {
            S: req.query.artist
         }
      }
   }, function(err, data) {
      if (err) return res.status(400).send({ message: err.message });

      let allAlbumItems = data.Items.map(item => item.album.S);
      let albums = [...new Set(allAlbumItems)];

      var response = {
         statusCode: 200,
         body: {
            records: albums
         }
      };
      return res.send(response);
   });
});

app.get('/songs/for/album', function(req, res) {
   db.query({
      TableName: 'music',
      IndexName: 'album-index',
      KeyConditionExpression: 'album = :album',
      ExpressionAttributeValues: {
         ':album': {
            S: req.query.album
         }
      }
   }, function(err, data) {
      if (err) return res.status(400).send({ message: err.message });

      let songs = data.Items.map(item => item.song.S);

      var response = {
         statusCode: 200,
         body: {
            records: songs
         }
      };
      return res.send(response);
   });
});

app.get('/song', function(req, res) {
   db.query({
      TableName: 'music',
      IndexName: 'song-index',
      KeyConditionExpression: 'song = :song',
      ExpressionAttributeValues: {
         ':song': {
            S: req.query.song
         }
      }
   }, function(err, data) {
      if (err) return res.status(400).send({ message: err.message });

      let songURL = data.Items && data.Items.length > 0 ? data.Items[0].url.S : null;

      var response = {
         statusCode: 200,
         body: {
            records: songURL
         }
      };
      return res.send(response);
   });
});

var server = app.listen(8081, function() {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
});