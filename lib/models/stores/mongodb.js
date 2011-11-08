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

var CIRCLE_REGEXP =  /^\/channel\/([a-zA-Z0-9_-]+)\/circle$/;

var CIRCLE_PEOPLE_REGEXP =  /^\/channel\/([a-zA-Z0-9_-]+)\/circlePeople$/;

var CIRCLE_TASKS_REGEXP =  /^\/channel\/([a-zA-Z0-9_-]+)\/circleTasks$/;

var TASK_EDITOR_REGEXP = /^\/channel\/Tasks$/;

var PERSON_EDITOR_REGEXP = /^\/channel\/People\/person$/;

/*
	Funcion que retorna los sketch.
*/
function getSketches(room, callback) {
  db.collection(room, function(err, collection) {
    collection.find(function(err, cursor) {
      cursor.toArray(function(err, results) {
        callback({ sketches: results || [] });
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
        callback({ tasks: results || []});
      });
    });
  });
}

/*
	Function que retorna una task.
*/
function getOneTask(taskCollection,taskGuid, callback)
{	
	db.collection(taskCollection, function(err, collection)
	{
		collection.find({guid : taskGuid}, function(err, cursor)
		{
			cursor.toArray(function(err, result)
			{
				callback({ task: result || []});
			});
		});
	});
}

/*
	Function que retorna las instanceTasks.
*/
function getInstanceTasks(taskName, callback) {
  db.collection(taskName, function(err, collection) {
    collection.find(function(err, cursor) {
      cursor.toArray(function(err, results) {
        callback({ instanceTasks: results || []});
      });
    });
  });
}

/*
	Function que retorna los roommates.
*/
function getRoommates(roommates, callback) {
  db.collection(roommates, function(err, collection) {
    collection.find(function(err, cursor) {
      cursor.toArray(function(err, results) {
        callback({ roommates: results  || []});
      });
    });
  });
}

/*
 * Funcion que retorna todos los usuarios del sistema que sean follower
 */

function getAllPeople(collectionName,userType, callback)
{
	db.collection(collectionName,userType,function(err, collection)
	{
		collection.find({userType:userType},function(err, cursor)
		{
			cursor.toArray(function(err, results)
			{
				callback({ users: results || []});
			});
		});
	});
}

/*
 * Retorna los circulos 
 */

function getAllCircles(dataBase, callback)
{
	db.collection(dataBase, function(err, collection)
	{
		collection.find(function(err, cursor)
		{
			cursor.toArray(function(err, results)
			{
				callback({ circles: results || []});
			});
		});
	});
}

/*
 * Retorna los circulos en los que se encuentra un usuario específico
 */

function getCircles(dataBase,userGuid , callback)
{
	db.collection(dataBase, function(err, collection)
	{
		collection.find({ people: {$elemMatch :{ guid : userGuid }}},function(err, cursor)
		{
			cursor.toArray(function(err, results)
			{
				callback({ circles: results || []});
			});
		});
	});
}

/*
 * Retorna los datos del usuario si existe
 */

function getPerson(dataBase,userName, userPass, callback)
{
	db.collection(dataBase, function(err, collection)
	{
		collection.find({nick:userName , password: userPass},function(err, cursor)
		{
			cursor.toArray(function(err, results)
			{
				callback({ person: results || []});
			});
		});
	});
}

/*
 * Agrega al usuario. Retorna boolean
 */

function addPerson(dataBase,userName,userNick,userPass,userType,guid,callback)
{
	db.collection(dataBase, function(err, collection)
	{
		sys.log("success");
		collection.insert(
			{
			name:userName
			,nick:userNick
			,password : userPass
			,userType : userType
			,guid : guid
			}
			,callback({bool:true})
 			);
	});
}

/*
	Funcion que reviza todo las llamadas recibidas.
	Identifica si se desea agregar un nuevo overlay o se desea eliminar.
*/
var listener = {
	incoming: function(message, callback)
	{
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
		}
		
		else if(match = TASK_REGEXP.exec(message.channel))
		{
			// Save task
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
		}
		else if(match = INSTANCETASK_REGEXP.exec(message.channel))
		{
			var taskName = match[1];
			// Save task
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
		}
		else if(match = CIRCLE_REGEXP.exec(message.channel))
		{
			var dataBase = match[1];
			// Save the circle
			switch(message.data.status)
			{
				case 'add':
					db.collection(dataBase, function(err, collection)
					{
						collection.insert(message.data);
					});
					break;
				case 'delete':
					db.collection(dataBase, function(err, collection)
					{
						collection.remove({ guid: message.data.guid }, function(err){});
					});
			}
		}
		else if(match = CIRCLE_PEOPLE_REGEXP.exec(message.channel))
		{
			var dataBase = match[1];
			switch(message.data.status)
			{
				case 'add':
					db.collection(dataBase, function(err, collection)
					{
						collection.update(
							{guid: message.data.circleGuid}
							,{"$addToSet": { people : message.data.person}}
						);
					});
					break;
				case 'delete':
					db.collection(dataBase, function(err, collection)
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
			var dataBase = match[1];
			switch(message.data.status)
			{
				case 'add':
					db.collection(dataBase, function(err, collection)
					{
						collection.update(
							{guid: message.data.circleGuid}
							,{"$addToSet": { tasks : message.data.task}}
						);
					});
					break;
				case 'delete':
					db.collection(dataBase, function(err, collection)
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
  	,getOneTask : getOneTask
  	,getRoommates: getRoommates
  	,getAllPeople:getAllPeople
  	,getCircles:getCircles
  	,getAllCircles:getAllCircles
  	,getPerson : getPerson
  	,addPerson : addPerson
  	,listener: listener 
};
