var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');

var connectionString;

if(process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/check_list';//6) this was named wrong
}

router.post("/task", function(req,res){
  console.log("Attempting to post to Task");
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("not writing to db");
      res.status(300).send(err);
    }else{
      console.log('booger');//7) from this I have discovered where the problem is likely to be:
      var result = [];
      var query = client.query('INSERT INTO tasks (task, description, complete) VALUES ($1, $2, $3 ) ', [req.body.Task, req.body.Description, req.body.Complete]);//8)fixed this, got different error, that is cool. 10) I removed one item from the insert to coorespond to removing id
      //11) FINALLY SENDING TO THE ZOO. however not the quantity, so time to go back to that.
      //12) if have figured out that it is sending the quantity to the the server, server is not putting it on the DB

      query.on('row', function(row){
        result.push(row);
        console.log("something");
        done();
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ' , err);
        res.status(500).send(err);
      });
      query.on('end', function(end){
        done();
        res.send(result);
      });
    }
  });
});

router.get("/oldTask", function(req,res){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("not writing to db");
      res.status(500).send(err);
    }else{
      var result = [];

      var query = client.query('SELECT * FROM tasks');
      query.on('row', function(row){
        result.push(row);
        done();
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ' , err);
        res.status(500).send(err);
      });
      query.on('end', function(end){
        done();
        res.send(result);
      });
    }
  });
});


router.post("/change_to_completed", function(req,res){
  console.log("Attempting to change");
  console.log(req.body);
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("not writing to db");
      res.status(300).send(err);
    }else{
      console.log('booger');
      var result = [];
      console.log("req.body", req.body.task);
      var query = client.query("UPDATE tasks SET complete=true WHERE task='"+req.body.task+"' AND description='"+req.body.description+"'");


      query.on('row', function(row){
        result.push(row);
        console.log("something");
        done();
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ' , err);
        res.status(500).send(err);
      });
      query.on('end', function(end){
        done();
        res.send(result);
      });
    }
  });
});

router.post("/change_to_uncompleted", function(req,res){
  console.log("Attempting to change");
  console.log(req.body);
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("not writing to db");
      res.status(300).send(err);
    }else{
      console.log('booger');
      var result = [];
      console.log("req.body", req.body.task);
      var query = client.query("UPDATE tasks SET complete=false WHERE task='"+req.body.task+"' AND description='"+req.body.description+"'");


      query.on('row', function(row){
        result.push(row);
        console.log("something");
        done();
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ' , err);
        res.status(500).send(err);
      });
      query.on('end', function(end){
        done();
        res.send(result);
      });
    }
  });
});

router.get("/clearform", function(req,res){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("not writing to db");
      res.status(500).send(err);
    }else{
      var result = [];

      var query = client.query('DELETE FROM tasks');
      query.on('row', function(row){
        result.push(row);
        done();
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ' , err);
        res.status(500).send(err);
      });
      query.on('end', function(end){
        done();
        res.send(result);
      });
    }
  });
});

module.exports = router;
