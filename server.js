var Hapi = require('hapi');
var mongoose = require('mongoose');
var server = new Hapi.Server();
mongoose.connect('mongodb://localhost:27017/angular-hapi-db');

var Schema = mongoose.Schema;

var UserSchema = new Schema({fname: {type: String, unique: true, index: true}, lname: String, lname3: String, lname4: Number, button1: String});

var User = mongoose.model('User', UserSchema);

server.connection({ port: 3000 });

server.ext('onRequest', function(request, reply){
  console.log('Request recived: '+ request.path);
  reply.continue();
})

server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: 'public',
      listing: true
    }
  }
});


server.route({
    method: 'POST',
    path: '/',
    handler: function (request, reply) {
        reply('I did something!');
    }
});



server.route({
	path: '/user',
	method: 'GET',
	handler: createUser
})

/*
function createUser(request, reply){
	console.log(request.query);
  fname = request.query.fname;
  lname = request.query.lname;
  lname3 = request.query.lname3;
  lname4 = request.query.lname4;
  button1 = request.query.button1;
  User.find({fname: fname}, function(err, users){
    console.log(users);
    if(users.length == 0){
      return User.create({fname: fname, lname: lname, lname3: lname3, lname4: lname4, button1: button1}, function(err, dbUser){
        reply({message: "User created"});
      });
    }
    user = users[0];
    user.lname = lname;
    user.save(function(err){
      reply({message: "User updated"});
    });
  });
}*/

function createUser(request, reply){
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
      {lname3: lname3}
    ] 
  };

  User.find(mongoQuery, function(err, users){
    console.log(users);
    if(users.length == 0){
      return User.create({fname: fname, lname: lname, lname3: lname3, lname4: lname4, button1: button1}, function(err, dbUser){
      });
    }
    console.log("hi i can find same user");
    user = users[0];
    user.lname4 = lname4;
    user.save(function(err){
      reply({message: "User updated"});
    });
  });
}




server.start(function(){
  console.log("Serer running on port: " + server.info.port);
});
