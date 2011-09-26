function RoomGestore(options)
{	
	this.element = $('#divRoommateContainer');	//elemento html utilizado como contenedor 
	this.subscriptions = [];			//arreglo que contiene todas las subcripciones
	this.roommatesContainer = [];			//compañeros
	this.edit = options.edit;
	this.show = options.show;
	this.client = options.client;
	this.roomName = options.roomName;
	this.active = false;
	this.stringAddRoommate = "roommate_";
	
	this.start();
}

RoomGestore.prototype = new Roommates();

RoomGestore.prototype.add = function(data)
{
	//ver si el usuario a agregar soy yo
	if(data.id == (this.client.guid) || data.roomName != this.roomName)
		return;
	//Ver si el usuario ya ha sido agregado
	var roommate = _.detect(this.roommatesContainer, function(s) { return s.id == data.id });
	//Agregar el usuarios si no existe
	if(!roommate)
	{
		this.add2(data);
		
	}
	else if(roommate)
	{
		if(data.working)
			this.changeClass(data,"roommateIconEnabled");
		else
			this.leave(data)
	}
}

RoomGestore.prototype.leave = function(data)
{
	this.changeClass(data,"roommateIcon")
}

RoomGestore.prototype.add2 = function(data)
{
	var self = this;
	var divUser = document.createElement('div');
	divUser.className = "roommate";
	
	
	var divIcon = document.createElement('div');
	var id = data.id || Utils.guid();
	divIcon.id = this.stringAddRoommate+id
	divIcon.className = "roommateIcon" + (data.working?"Enabled":"");
	
	var spanName = document.createElement('span');
	spanName.className = "roommateName";
	spanName.innerText = data.name;
	
	$(divUser).prepend(spanName);
	$(divUser).prepend(divIcon);
	self.element.prepend(divUser);
	
	var roommate = new User(
		{ name:data.name
		, nick: data.nick
		, id: id
		, enabled : data.enabled
		});

	this.roommatesContainer.push(roommate)
}
