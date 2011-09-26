/*
 * Extiende de Roommates
 */
function GroupInstanceTaskWizard(options)
{	
	this.element = $('#divRoommateContainer');	//elemento html utilizado como contenedor 
	this.subscriptions = [];			//arreglo que contiene todas las subcripciones
	this.roommatesContainer = [];			//compañeros
	this.edit = options.edit;
	this.show = options.show;
	this.client = options.client;
	this.roommates = options.roommates;
	this.active = false;
	this.stringAddRoommate = "roommate_";
	this.stringClassBase = "roommateIconBase ";
	this.ROOMMATE_ICON_ADD = "roommateIconAdd";
	this.roommateIconRemove = "roommateIconRemoveOff";
	this.ROOMMATE_ICON_REMOVE_ON = "roommateIconRemoveOn";
	this.ROOMMATE_BASE = "roommate ";
	this.ROOMMATE_ICON_BASE = "roommateIconBase ";
	
	this.start();
	this.getGroup();
}
/*
 * Variable para extender de Roommates
 */
GroupInstanceTaskWizard.prototype = new Roommates();

GroupInstanceTaskWizard.prototype.add = function(data)
{
	//ver si el usuario a agregar soy yo
	if(data.guid == (this.client.guid))
		return;
	//Ver si el usuario ya ha sido agregado
	var roommate = this.searchRoommate(data.guid);
	//Agregar el usuarios si no existe
	if(!roommate)
	{
		if(data.userType == 'leader')
			this.addLeader(data);
		else if(data.selected)
		{
			if(!data.working)
				this.addWithClass(data,"roommateIconRemoveOff");
			else
				this.addWithClass(data,"roommateIconRemoveOn");
		
		}
		else
			this.addWithClass(data,"roommateIconAdd");
		
	}
	else if(roommate)
	{
		if(!data.working)
			this.leave(data);
		else if(data.selected)
			this.changeClass(data,"roommateIconRemoveOn");
		else
			this.changeClass(data,"roommateIconRemoveOff");
	}
}

GroupInstanceTaskWizard.prototype.leave = function(data)
{interface
	this.changeClass(data,"roommateIconAdd")
}

GroupInstanceTaskWizard.prototype.addWithClass = function(data, classRoommate)
{
	var roommate = this.addInContainer(data,classRoommate);
	this.addEvent(roommate);
}

GroupInstanceTaskWizard.prototype.addLeader = function(data)
{
	this.addInContainer(data, "roommateIconLeader");
}
GroupInstanceTaskWizard.prototype.addInContainer = function(data, classRoommate)
{
	var self = this;
	var divUser = document.createElement('div');
	divUser.className = "roommate";
	var id = data.guid || Utils.guid();
	divUser.id = id
	
	var divIcon = document.createElement('div');
	divIcon.className = this.stringClassBase+classRoommate;
	
	var spanName = document.createElement('span');
	spanName.className = "roommateName";
	spanName.innerText = data.name;
	
	$(divUser).prepend(spanName);
	$(divUser).prepend(divIcon);
	self.element.prepend(divUser);
	
	var roommate = new User(
		{ 
			name:data.name
			,nick: data.nick
			,guid: id
			,selected : data.selected
			,working: data.working
		});

	this.roommatesContainer.push(roommate)
	
	return $(divUser);
}

GroupInstanceTaskWizard.prototype.addEvent = function(roommate)
{
	var self = this;
	roommate.click(function()
	{
		var id = this.id;
		self.userClick(id);
		
	});
}

GroupInstanceTaskWizard.prototype.userClick = function(id)
{
	var roommate = this.searchRoommate(id);
	roommate.selected = !roommate.selected;
	if(roommate.selected)
		this.changeStatusClass(id,this.ROOMMATE_ICON_BASE+this.ROOMMATE_ICON_REMOVE_ON);
	else
		this.changeStatusClass(id,this.ROOMMATE_ICON_BASE+this.ROOMMATE_ICON_ADD);
		
}
GroupInstanceTaskWizard.prototype.getGroup = function()
{
	var self = this;
	$.getJSON('/rooms/users.json', function(data) {
		self.getGroupAux(data.users);
	});
}
GroupInstanceTaskWizard.prototype.getGroupAux = function(group)
{
	// Download Users
	var self = this;
	
	_.each(self.roommates, function(user) {
		var roommate = _.detect(group, function(s) { return user == s.guid });
	//Agregar el usuarios si no existe
	if(roommate)
		self.add(roommate);
	});
}