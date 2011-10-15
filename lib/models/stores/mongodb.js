var sys     = require('sys')
,   mongodb = require('mongodb')
,   db      = new mongodb.Db('mapsketcher', new mongodb.Server("127.0.0.1", 12345, {}))
;
db.open(function(){});

var SKETCH_REGEXP = /^\/room\/([a-zA-Z0-9_-]+)\/sketches$/;

var TASK_REGEXP = /^\/room\/Tasks$/;

var INSTANCETASK_REGEXP = /^\/room\/([a-zA-Z0-9_-]+)\/instanceTasks$/;

var ROOMMATES_REGEXP = /^\/roommates\/([a-zA-Z0-9_-]+)$/;

var USER_REGEXP = /^\/room\/Users$/;

var CIRCLE_REGEXP =  /^\/channel\/circles\/circle$/;

var CIRCLE_PEOPLE_REGEXP =  /^\/channel\/circles\/circlePeople$/;

var CIRCLE_TASKS_REGEXP =  /^\/channel\/circles\/circleTasks$/;

var TASK_EDITOR_REGEXP = /^\/channel\/Tasks$/;

var PERSON_EDITOR_REGEXP = /^\/channel\/People\/person$/;

/*
	Funcion que retorna los sketch.
*/
function getSketches(room, callback) {
  db.collection(room, function(err, collection) {
    collection.find(function(err, cursor) {
      cursor.toArray(function(err, results) {
        callback({ sketches: results });
      });
    });
  });
}
/*
	Function que retorna las Task.
*/
function getTasks(taskCollection, callback) {
	
  db.collection(taskCollection, function(err, collection) {
    collection.find(function(err, cursor) {
      cursor.toArray(function(err, results) {
        callback({ tasks: results });
      });
    });
  });sys.log('getTasks');
}
/*
	Function que retorna las instanceTasks.
*/
function getInstanceTasks(taskName, callback) {
  db.collection(taskName, function(err, collection) {
    collection.find(function(err, cursor) {
      cursor.toArray(function(err, results) {
        callback({ instanceTasks: results });
      });
    });
  });sys.log('getInstanceTasks');
}

/*
	Function que retorna los roommates.
*/
function getRoommates(roommates, callback) {
  db.collection(roommates, function(err, collection) {
    collection.find(function(err, cursor) {
      cursor.toArray(function(err, results) {
        callback({ roommates: results });
      });
    });
  });sys.log('getroommates');
}

/*
 * Funcion que retorna todos los usuarios del sistema
 */

function getAllPeople(collectionName, callback)
{
	db.collection(collectionName, function(err, collection)
	{
		collection.find(function(err, cursor)
		{
			cursor.toArray(function(err, results)
			{
				callback({ users: results });
			});
		});
	});
}

/*
 * Retorna los circulos de una actividad definida
 */

function getCircles(activity, callback)
{
	db.collection('Circle', function(err, collection)
	{
		collection.find(function(err, cursor)
		{
			cursor.toArray(function(err, results)
			{
				callback({ circles: results});
			});
		});
	});
}


/*
	Funcion que reviza todo las llamadas recibidas.
	Identifica si se desea agregar un nuevo overlay o se desea eliminar.
*/
var listener = {
	incoming: function(message, callback)
	{
		sys.log(message.channel);
		sys.log("valor de salida");
		callback(message);      
		var match;
		if (match = SKETCH_REGEXP.exec(message.channel))
		{
			var room = match[1];

			// Save the sketch
			switch(message.data.type)
			{
				case 'new':
					db.collection(room, function(err, collection)
					{
						collection.insert(message.data);
					});
					break;
				case 'delete':
					db.collection(room, function(err, collection)
					{
						collection.remove({ id: message.data.id }, function(err){});
					});
			}
			sys.log('sketch');
		}
		
		else if(match = TASK_REGEXP.exec(message.channel))
		{
			// Save task
			sys.log('enterTasks');
			switch(message.data.status)
			{
				case 'join':
					db.collection('Task', function(err, collection)
					{
						collection.insert(message.data);
					});
					break;
				case 'delete':
					//eliminar la task
					db.collection('Task', function(err, collection)
					{
						collection.remove({ roomName: message.data.roomName }, function(err){});
					});
			}
			sys.log('leaveTask');
		}
		else if(match = INSTANCETASK_REGEXP.exec(message.channel))
		{
			var taskName = match[1];
			// Save task
			sys.log('enterInstanceTasks');
			switch(message.data.status)
			{
				case 'join':
					db.collection(taskName, function(err, collection)
					{
						collection.insert(message.data);
					});
					break;
				case 'delete':
					//eliminar la task
					db.collection(taskName, function(err, collection)
					{
						collection.remove({ roomName: message.data.roomName }, function(err){});
					});
			}
			sys.log('leaveInstanceTask');
		}
		else if(match = ROOMMATES_REGEXP.exec(message.channel))
		{
			var room = match[1];

			// Save the roommates
			if(message.data.status =='quit')
			{	
				db.collection(room, function(err, collection)
					{
						collection.remove({ id: message.data.id }, function(err){});
					});	
			}
			else
			{
				db.collection(room, function(err, collection)
				{
					collection.update(
						{id: message.data.id}
						/*,{$set:
							{
								working: message.data.working
								,roomName: message.data.roomName
								,name : message.data.name
								,enabled: message.data.enabled
								,userType: message.data.userType
							}}*/
						,message.data
						,{upsert:true}
					);
				});
			}
		}
		else if(match = USER_REGEXP.exec(message.channel))
		{
			db.collection('Users', function(err,collection)
			{
				collection.update(
					{guid: message.data.guid}
					,message.data
					,{upsert:true}
				);
			});
			sys.log('leaveUsers');
		}
		else if(match = CIRCLE_REGEXP.exec(message.channel))
		{
			// Save the circle
			switch(message.data.status)
			{
				case 'add':
					db.collection('Circle', function(err, collection)
					{
						collection.insert(message.data);
					});
					break;
				case 'delete':
					db.collection('Circle', function(err, collection)
					{
						collection.remove({ guid: message.data.guid }, function(err){});
					});
			}
			sys.log('circle');	
		}
		else if(match = CIRCLE_PEOPLE_REGEXP.exec(message.channel))
		{
			sys.log('Enter personToCircle');
			switch(message.data.status)
			{
				case 'add':
					db.collection('Circle', function(err, collection)
					{
						sys.log('personToCircle 1');
						collection.update(
							{guid: message.data.circleGuid}
							,{"$addToSet": { people : message.data.person}}
						);
						sys.log('personToCircle 2');
					});
					sys.log('personToCircle');
					break;
				case 'delete':
					db.collection('Circle', function(err, collection)
					{
						collection.update(
							{guid: message.data.circleGuid}
							,{$pull : { people : {guid: message.data.person.guid} }}
						);
					});
					break;
			}
		}
		else if(match = CIRCLE_TASKS_REGEXP.exec(message.channel))
		{
			sys.log('Enter TaskToCircle');
			switch(message.data.status)
			{
				case 'add':
					db.collection('Circle', function(err, collection)
					{
						collection.update(
							{guid: message.data.circleGuid}
							,{"$addToSet": { tasks : message.data.task}}
						);
					});
					sys.log('TaskToCircle');
					break;
				case 'delete':
					db.collection('Circle', function(err, collection)
					{
						collection.update(
							{guid: message.data.circleGuid}
							,{$pull : { tasks : {guid: message.data.task.guid} }}
						);
					});
					break;
			}
		}
		else if(match = TASK_EDITOR_REGEXP.exec(message.channel))
		{
			
			sys.log('Enter TaskCreator');
			switch(message.data.status)
			{
				case 'add':
					db.collection('Task', function(err, collection)
					{
						collection.update(
							{guid: message.data.guid}
							,message.data
							,{upsert:true}
						);
					});
					break;
				case 'delete':
					db.collection('Task', function(err, collection)
					{
						collection.remove({ guid: message.data.guid }, function(err){});
					});
					break;
			}
		}
		else if(match = PERSON_EDITOR_REGEXP.exec(message.channel))
		{
			switch(message.data.status)
			{
				case 'new':
					db.collection('Person', function(err, collection)
					{
						collection.update(
							{guid: message.data.guid}
							,message.data
							,{upsert:true}
						);
					});
					break;
				case 'delete':
					db.collection('Person', function(err, collection)
					{
						collection.remove({ guid: message.data.guid }, function(err){});
					});
					break;
			}
		}
		
	}
};

module.exports =
{
  	getSketches: getSketches
  	,getInstanceTasks: getInstanceTasks
  	,getTasks: getTasks
  	,getRoommates: getRoommates
  	,getAllPeople:getAllPeople
  	,getCircles:getCircles
  	,listener: listener 
};
