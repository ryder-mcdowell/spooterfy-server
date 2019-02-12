var express = require('express');
var app = express();
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

app.get('/', function(req, res) {
   res.send('Welcome to Spooterfy')
});

app.get('/songs', function(req, res) {
   s3.listObjects({
     Bucket: 'testy-tester-351541531532',
     Delimiter: '/'
   }, function(err, data) {
      if (err) return res.status(400).send({ message: err.message });
      var response = {
         statusCode: 200,
         body: {
            artists: data.CommonPrefixes
         }
      }
      return res.send(response);
   });
});

var server = app.listen(8081, function() {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
});