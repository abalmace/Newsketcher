function Roommates(/*options*/)
{	
/*
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
*/
}

Roommates.prototype.start = function()
{
	this.element.empty();
	this.subscriptionsInit();
	//this.createScrollview();
}

Roommates.prototype.subscriptionsInit = function()
{
	var self = this;
	
	//suscribirse a grupo de trabajo (Roommates)
	self.subscriptions.push(self.client.subscribe(self.roommatePath(), function(data) {
		if (data.status == 'join')
			self.add(data);
		else if (data.status == 'leave')
			self.leave(data);
		else if(data.status =='quit')
			self.quitRoom(data);
	}));
}
/*
Roommates.prototype.createScrollview = function()
{
	YUI().use('scrollview','node-base', function(Y) {

		var scrollView = new Y.ScrollView({
			id: "SVRoommateContainer",
			srcNode: '#divRoommateContainer',
			width: 500,
			height:60,
			flick: {
				minDistance:10,
				minVelocity:0.3,
				axis: "x"
			}
		});
		scrollView.render();

	});
}
*/
Roommates.prototype.addRoommates = function(data)
{
	data.status = "join";
	data.working = true;
	this.client.sendRoommatesSignal(this, data)
}

Roommates.prototype.leaveRoom = function(data)
{
	data.working = false;
	data.status = 'leave';
	this.client.sendRoommatesSignal(this,data)
}

Roommates.prototype.quitRoom = function(data)
{
	var roommate = this.searchRoommate(data.id);
	
	if (roommate)
	{
		var node = document.getElementById(data.id);
		var parent =node.parentNode;
		parent.removeChild(node);
		this.removeRoommate(roommate);
		room.stop();
	}

}

Roommates.prototype.changeClass = function(data,className)
{
	var user = document.getElementById(data.guid);
	user.className = this.stringClassBase+className
}

Roommates.prototype.joinRoom = function(data) 
{
	var self = this;
	self.roommatesContainer = self.roommatesContainer || self.createRoommateContainer();	
	self.roommatesContainer.addRoommates(data)
}

Roommates.prototype.createRoommateContainer = function()
{
	var self = this;
	var data = 
	{
		enabled : self.enabled
		,show : self.show
	};
		
	return new Roomates(data);
}


Roommates.prototype.roommatePath = function()
{
	return '/roommates/' + this.stringAddRoommate + this.roomName
}

Roommates.prototype.stop = function()
{
	var self = this;

	_.each(self.subscriptions, function(s)
	{
		s.cancel();
	})
}

Roommates.prototype.setVisible = function(visible)
{
	var node = document.getElementById("divRoommateContainer");
	if(visible)
		node.style.visibility = "visible";
	else
		node.style.visibility = "hidden"
}

Roommates.prototype.searchRoommate = function(guid)
{
	return  _.detect(this.roommatesContainer, function(s) { return s.guid == guid });	
}

Roommates.prototype.removeRoommate = function(roommate)
{
	this.roommatesContainer = _.without(this.roommatesContainer, roommate);
}

Roommates.prototype.changeStatusClass = function(id, className)
{
	var userIcon = $('#'+id+' div.roommateIconBase');
	userIcon.removeClass();
	userIcon.addClass(className);
	
}

Roommates.prototype.getAllUsers = function()
{
	return this.roommatesContainer	
}