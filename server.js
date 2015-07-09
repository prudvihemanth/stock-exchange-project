var Hapi = require('hapi');               /* Importing Modules Hapi, Mongoose,fs*/
var mongoose = require('mongoose');
var server = new Hapi.Server();
mongoose.connect('mongodb://localhost:27017/angular-hapi-db');    /*Establishing a Connection to Mongodb*/
var Schema = mongoose.Schema;
var UserSchema = new Schema({fname: {type: String, unique: true, index: true}, lname: String, lname3: String, lname4: Number, lname5: String, lname6: String, button1: String}); /*Defining Mongo Schema*/
var User = mongoose.model('User', UserSchema);
server.connection({ port: 3000 });   /*Node.js server runs on port 3000*/
var fs = require('fs');
var wstream = fs.createWriteStream('public/tradinghistory.html');     /*Node.js Stream to write to an output file*/

server.route({          /* Creating a Route for home page and handling business logic using createUser*/
  path: '/user',
  method:'GET',
  handler: createUser
})

server.route({                     /*Creating Route for the linked page tradinghistory.html*/
  path: '/user/tradinghistory',
  method:'GET',
  handler:{
    file: 'public/tradinghistory.html'
  }
})

server.route({                       /*creating Route to include all the files present in the Directory*/
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: 'public',
      listing: true
    }
  }
});


server.ext('onRequest', function(request, reply){      /*Tracing all the requests to the server*/
  console.log('Request recived: '+ request.path);
  reply.continue();
})


function createUser(request, reply){                  /*Controller funtion that takes data from the client and processes it to database*/
  var fname = request.query.fname;
  var lname = request.query.lname;
  var lname3 = request.query.lname3;
  var lname4 = request.query.lname4;
  var button1 = request.query.button1;
  console.log("in createUser function");
  var mongoQuery = {
    $and: [
      {fname: fname},
      {lname: lname},
      {lname3: lname3},
    ] 
  };



  User.find(mongoQuery, function(err, users){               /*This piece of code is intended to create and updatee the data from the database*/
    if(users.length == 0){
      var dollar=0;
      return User.create({fname: fname, lname: lname, lname3: lname3, lname4: lname4, button1: button1}, function(err, dbUser){
      });
    }
    if(users.length == 1){
       dollar=1;
       console.log("hi i can find same user");
       var output =users[0].lname4;
       user = users[0];
       if(button1=="buy"){
        user.lname4=parseInt(lname4)+parseInt(output);
        if(user.lname4<0){
          user.lname4=0;
        }
       }
       if(button1=="sell"){
          user.lname4=parseInt(output)-parseInt(lname4);
          if(user.lname4<0){
            user.lname4=0;
          }
       }
       user.button1=button1;
     }
    user.save(function(err){
      reply({message: "User updated"});
    });
  });

  var mongoQuerys = {
    $and: [
      {fname: fname},
      {lname: lname},
    ] 
  };



  User.find(mongoQuerys, function(err, users){     /*This piece of code is used to retrive the data from the database and will output to a file*/
    if(users.length == 0){
      wstream.write(fname+"    "+'have'+"   "+lname4+"   "+'shares for the company'+"   "+lname3);
      wstream.write('<br>')
    }
    else{
      var lengthy = users.length;
      for(i=0; i<lengthy; i++){
        var final=fname +"  "+"already have"+ "  "+users[i].lname4 +"  "+"shares for the company"+''+users[i].lname3;
        wstream.write(final);
        wstream.write('<br>');
      };
    };
  });
};


server.start(function(){                                          /*Start the server*/
  console.log("Serer running on port: " + server.info.port);
});
