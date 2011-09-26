function MapSketcherClient(options, data)
{
	if (! (this instanceof arguments.callee))
	{
		return new arguments.callee(arguments);
	}

	var self = this;
	
	self.settings =
		{  
			port: options.port
			,hostname: options.hostname
		};

	var init = function()
	{
		setupBayeuxClient();
		self.guid = data.username || Utils.guid();
		self.name = data.name || "unknow";
		self.userType = data.usertype || "follower";
	}

	var setupBayeuxClient = function()
	{
		self.socket = new Faye.Client("http://"
			+ self.settings.hostname
			+ ':' + self.settings.port 
			+ '/socket', {
			timeout: 120
		});
	}

	init();
}

/*
	Para subscribirse a una canal
*/
MapSketcherClient.prototype.subscribe = function(chanel,callback)
{
	return this.socket.subscribe(chanel,callback);
}
MapSketcherClient.prototype.sendUser = function()
{
	var self = this;
	var data = 
	{
	name:self.guid
	,guid:self.guid
	,nick:null
	,currentInstanceTask:null
	,userType:self.userType
	,selected:true			//el usuario esta agregado por default a los grupos.
	,working:false			//por default los usuarios no estan trabajando en la task.
	};
	self.sendSignal('/room/Users',data);
}

MapSketcherClient.prototype.launch = function()
{
	
	//this.createContainers();
	this.initContainerTask();
	this.roommates = new Roommates();
	this.sendUser();
}

/*
	Path del canal de subscripción
*/
MapSketcherClient.prototype.subscribePath = function(zone)
{
	return '/room/'+ zone;
}

/*
	Obtener el DOM element para el mapa de google maps
*/
MapSketcherClient.prototype.getWorkspaceMapDom = function()
{
	return document.getElementById('map');
}

MapSketcherClient.prototype.removePersonalRoom = function()
{
	var data = [];
	data.roomName = this.currentRoomId;
	this.removeRoom(data);
}
/*
	Elimina una room
*/
MapSketcherClient.prototype.removeRoom = function(data)
{	
	var node = document.getElementById(data.roomName);
	var father = node.parentNode;
	var self = this;
	father.removeChild(node);
	
	for ( container in self.rooms)
	{
		var room = _.detect(self.rooms[container], function(s) { return s.name == data.roomName });
	
		if(room)
		{
			self.rooms[container] = _.without(self.rooms[container], room);
			if(self.currentRoomId == data.roomName)
			{
				self.openOtherRoom(self.rooms[container]);
				room.stop();
			}
			return;
		}			
	}
}

MapSketcherClient.prototype.openRoom = function(roomName, array)
{
	var room = _.detect(array, function(s) { return s.name == roomName });
	if(room)
	{
		room.setActive(true);
	}
}

/*
	Se utiliza cuando se elimina la room actualmente en uso.
	De esta manera se abre una room disponible.
*/
MapSketcherClient.prototype.openOtherRoom = function(array)
{
	var self = this;
	
	if(array.length>0)
	{
		var room =array[array.length-1];
		self.openRoom(room.name,array);
		return;
	}
	if(array == self.rooms.personalRooms)
	{
		self.createNewPersonalRoom();
	}
	else
		self.openOtherRoom(self.rooms.personalRooms);
}

MapSketcherClient.prototype.createNewPersonalRoom = function() 
{
	var self = this;
	
	self.createNewRoom($('#personal'),self.rooms.personalRooms,false,null,true);
}

MapSketcherClient.prototype.createNewCollaborativeRoom = function(nameRoom)
{
	var self = this;
	
	return self.createNewRoom($('#collaborative'),self.rooms.collaborativeRooms, true,nameRoom,true);
}

MapSketcherClient.prototype.createNewGlobalRoom = function(nameRoom)
{
	var self = this;
	
	return self.createNewRoom($('#global'),self.rooms.globalRooms, true,nameRoom,true);
}

//#####################################################
MapSketcherClient.prototype.createNewTask = function(data)
{
	this.containerTask.addNewTask(data);
}

/*
	Función para crear una nueva room
*/
MapSketcherClient.prototype.createNewRoom = function(element, roomContainer, persisted, nameRoom, active)
{
	var id = nameRoom || Utils.guid();
	var div = document.createElement('div');
	div.id = id;
	div.className = "miniRoom";

	element.prepend(div);
	var room = new StaticRoom(
		{ client: this
		, name:id
		, dom: div
		, persisted: persisted
		});

	roomContainer.push(room);
	if(active != undefined)
		room.setActive(active);
	
	return room.name;
}

/*
	Se envia un movimiento
*/
MapSketcherClient.prototype.sendMove = function(room, pos) {
	this.socket.publish(room.roomPath('moves'), 
		{ client: this.guid
		, position: pos
		});
}

MapSketcherClient.prototype.removeSketch = function(room, sketch) {
	var data = {
	id: sketch.id
	, type: 'delete'
	, client: this.guid
	}

	this.socket.publish(room.roomPath('sketches'), data);
}

/*
	Envia un overlay a una canal
*/
MapSketcherClient.prototype.sendOverlay = function(room, overlay) {
	var data = overlay.to_json();
	data.client = this.guid;
	data.type = 'new';

	this.socket.publish(room.roomPath('sketches'), data);
}

/*
	Envia una señal a una de las canales de roommate
*/
MapSketcherClient.prototype.sendRoommatesSignal = function(roommate, data) {

	this.socket.publish(roommate.roommatePath(), data);
}

/*
	Agrega un roommate a una room colaborativa.
*/
MapSketcherClient.prototype.joinColaborativeRoom = function(room) {
	var oldRoom = this.selectedRoom;

	this.selectedRoom = new StaticRoom(
		{ client: this
		, name: room
		, dom: document.getElementById('collaborative')
		});

	this.selectedRoom.setActive(true);

	if (oldRoom) {
		oldRoom.stop();
	}
}
MapSketcherClient.prototype.joinRoom = function(data)
{
	var self = this;
	switch(data.type)
	{
	case 'collaborative':
		this.createNewRoom($('#collaborative'),self.rooms.collaborativeRooms, true,data.roomName);
		break;
	case 'global':
		this.createNewRoom($('#global'),self.rooms.globalRooms, true,data.roomName);
		break;
	}
}

/*
	<description>
	
	</description>
	<attributes>
		<attribute  name = "data">
			<description>
			datos necesarios para identificar una task
			</description>
		</attribute>
		<attribute name = "status">
			<description>
			Tipo de operación a realizar. Sus valores posibles son:
			join: Unirse a una task
			remove: eliminar una task
			</description>
		</atribute>
	</attributes>
	<return></return>
*/
MapSketcherClient.prototype.sendSignal = function(path, data)
{		
	this.socket.publish(path, data);
}
MapSketcherClient.prototype.sendRoomSignal = function(roomName, type, status)
{
	var data = {
		roomName:roomName
		,client:this.guid
		,type:type
		,status:status
		}
		
	this.socket.publish(this.subscribePath("Rooms"), data);
}
//############################################### BEGIN
MapSketcherClient.prototype.initContainerTask = function()
{
	var self = this;
	var data ={client:this};
	if(this.userType.toLowerCase() == "leader")
		self.containerTask = new ContainerTaskLeader(data);
	else
		self.containerTask = new ContainerTaskFollower(data);
	
}

//############################################### END
/*
	Crea los contenedores para almacenar los roommates
*/
MapSketcherClient.prototype.createContainers = function()
{
	var self = this;
	self.subscriptions = [];
	self.rooms = [];
	
	
	/*
		global room
	*/
	
	/*
	self.rooms.globalRooms = [];
	
	$('#globalAdd').click(function(){
		var nameRoom = Utils.guid();
		self.sendRoomSignal(nameRoom,'global','join');
	});
	
	$('#globalDelete').click(function(){
		self.sendRoomSignal(self.currentRoomId,'global','delete');
	});
	
	*/
	
	/*
		Collaborative Room
	*/
	
	/*
	self.rooms.collaborativeRooms = [];
	
	$('#collaborativeAdd').click(function(){
		var nameRoom = Utils.guid();
		self.sendRoomSignal(nameRoom, 'collaborative', 'join');
	});
	
	$('#collaborativeDelete').click(function(){
		self.sendRoomSignal(self.currentRoomId,'collaborative','delete');
	});
	
	//agregar las Collaboratives Rooms que estan de antes
	$.getJSON('/rooms/'+ 'collaborative' +'/rooms.json', function(data) {
			_.each(data.rooms, function(room)
			{
				self.joinRoom(room);
		  	});
		});
	//agregar las Global Rooms que estan de antes
	$.getJSON('/rooms/'+'global'+'/rooms.json', function(data) {
			_.each(data.rooms, function(room) {
				self.joinRoom(room);
		  });
		});
		
	//suscribirse a la edicion de Rooms
	self.subscriptions.push(self.subscribe(self.subscribePath('Rooms'), function(data) {
		if (data.status == 'join')
			self.joinRoom(data);
		else if (data.status == 'delete')
			self.removeRoom(data);

		}));
	*/
		
	/*
		Personal Rooms
	*/
	
	/*
	self.rooms.personalRooms = [];
	self.createNewPersonalRoom();	
	
	$('#personalAdd').click(function(){
		self.createNewPersonalRoom();
	});
	
	$('#personalDelete').click(function(){
		self.removePersonalRoom();
	});
	*/
	
}
