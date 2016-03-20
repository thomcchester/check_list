var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var pg = require('pg');
var taskRouter = require('./routes/task.js');

var connectionString;

if(process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/check_list';
}

pg.connect(connectionString, function(err, client,done){
  if (err){
    var query = client.query(

      'CREATE TABLE IF NOT EXISTS tasks(' +
      'task varchar(20) NOT NULL'+
      'description varchar(20) NOT NULL'+
      'complete BOOLEAN NOT NULL);');


    query.on('end',function(){

      done();

    });
    //3)'end' doesnt run
    query.on('error', function(error){
      console.log('sandwich');// 5)this does not run so it is not this error either
      console.log(error);
      done();
    });
    //4)it might be over where an individual one is but no table exists yet
  }
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/",taskRouter);

app.set("port",(process.env.PORT || 3000));

app.get("/*", function(req,res){
  var file = req.params[0] || "/views/index.html";
  res.sendFile(path.join(__dirname,"./public/", file));
});

app.listen(app.get("port"),function(){
  console.log("Listening on port: ", app.get("port"));
});

module.exports = app;
