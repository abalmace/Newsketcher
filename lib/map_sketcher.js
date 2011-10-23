var http    = require('http')
,   static  = require('node-static')
,   sys     = require('sys')
,   express = require('express')
,   faye    = require('faye')
,   store   = require('models/stores/mongodb');
;

function MapSketcher(options) {
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.settings = {
    port: options.port
  };

  self.init();
}

MapSketcher.prototype.init = function() {
  self = this; 
  self.bayeux = createBayeuxServer(self);
  self.app = createExpressApp(self);

  self.bayeux.attach(self.app);
  self.app.listen(self.settings.port);
  
  self.app.get('/', function(req, res){
  res.render('index.ejs');
});
  
  self.app.get(/^\/partialView\/([a-zA-Z0-9_-]+)(\.ejs)$/, function(req, res){
	   
  res.render('./partialView/'+req.params[0]+req.params[1]);
});

  /^\/users?(?:\/(\d+)(?:\.\.(\d+))?)?/
  
  self.app.get('/config.json', function(req, res){
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });

    res.write(JSON.stringify({
      port: self.settings.port
    }));
    res.end();
  });
  
  self.app.get('/rooms/:room/sketches.json', function(req,res) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    store.getSketches(req.params.room, function(sketches) {
      res.write(JSON.stringify(sketches));
      res.end();
    });
  });
  
  self.app.get('/room/:taskCollection/tasks.json', function(req,res) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    store.getTasks(req.params.taskCollection, function(tasks) {
      res.write(JSON.stringify(tasks));
      res.end();
    });
  });
  
  self.app.get('/room/:taskName/instanceTasks.json', function(req,res) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    store.getInstanceTasks(req.params.taskName, function(taskName) {
      res.write(JSON.stringify(taskName));
      res.end();
    });
  });
  
    self.app.get('/rooms/:task/roommates.json', function(req,res) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    store.getRoommates(req.params.task, function(groupUsers) {
      res.write(JSON.stringify(groupUsers));
      res.end();
    });
  });
    //TODO borrar despues, por que tengo la funcion people
    self.app.get('/rooms/users.json', function(req,res) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    store.getAllUsers('Users', function(users) {
      res.write(JSON.stringify(users));
      res.end();
    });
  });
	//Obtiene todos los usuarios de la DB
	self.app.get('/channel/allUsers/people.json', function(req,res)
	{
		res.writeHead(200,{'Content-Type': 'application/json'});
		store.getAllPeople('Person', function(users)
		{
			res.write(JSON.stringify(users));
			res.end();
		});
	});
	
	//Obtiene todos los circulos  de la DB para una actividad dada
	self.app.get('/channel/:dataBase/circles.json', function(req,res)
	{
		sys.log("probando la entrada de datos");
		res.writeHead(200,{'Content-Type': 'application/json'});
		store.getAllCircles(req.params.dataBase, function(circles)
		{
			res.write(JSON.stringify(circles));
			res.end();
		});
	});
	
	//Obtiene los datos del usuario si existe
	self.app.get('/channel/:dataBase/:userName/:userPass/person.json', function(req,res)
	{
		res.writeHead(200,{'Content-Type': 'application/json'});
		store.getPerson(req.params.dataBase,req.params.userName,req.params.UserPass, function(user)
		{
			res.write(JSON.stringify(user));
			res.end();
		});
	});
	
  
  self.bayeux.addExtension(store.listener);

  sys.log('Server started on PORT ' + self.settings.port);
}

function createBayeuxServer(self) {
  var bayeux = new faye.NodeAdapter({
    mount: '/socket',
    timeout: 45
  });
  
  return bayeux;

}

function createExpressApp(self) {
  var app = express.createServer();

  app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static('./public'));
    
     app.set('views','./public');
     app.set('view options', {
  layout: false
});
  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function(){
    app.use(express.errorHandler());
  });
  
  

  return app;
}

function createHTTPServer(self) {
  var server = http.createServer(function(request, response) {
    var file = new static.Server('./public', {
      cache: false
    });

    request.addListener('end', function() {
      file.serve(request, response);
    });
  });
  
  return server;
}

module.exports = MapSketcher;
