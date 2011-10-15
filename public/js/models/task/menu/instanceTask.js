/*
	Son las distintas habitaciones para trabajar con mapas.
		- Las habitaciones tienen lugares de trabajo.
		
*/
/*
options =
{client : cliente
,persisted : si es una isntancia que persiste ( mas de un integrante)
, dom: elemento dom que representara visualmente a la instancia
,name : id de la instancia
,title: ????????????????????????? 
}
*/
function InstanceTask(options)
{
	this.SELECTED ="1";
	this.DRAG ="0.5";
	this.NOT_SELECTED = "0.3";

	if (! (this instanceof arguments.callee)) {
		return new arguments.callee(arguments);
	}

	this.overlays = [];
	this.subscriptions = [];
	this.client = options.client;
	this.name = options.name.toLowerCase();
	this.dom = options.dom;
	this.editable = (typeof options.editable == 'undefined') ?
		true : options.editable;
	this.persisted = (typeof options.persisted == 'undefined') ?
		true : options.persisted;

	this.currentPosition = 
		{ lat: -33.457788
		, lng: -70.664105
		, zoom: 16
		}

	this.start();
	this.instaceTaskUI = new InstanceTaskUI({dom:this.dom,title:options.title});
	this.events();
}

InstanceTask.prototype.start = function() {
	var self = this;
	
	if (self.persisted) {
		// Subscribe to sketch updates.
		self.subscriptions.push(self.client.subscribe(self.roomPath('sketches'), function(sketch) {
			if (sketch.type == 'new')
				self.add(sketch);
			else if (sketch.type == 'delete')
				self.remove(sketch);

		}));
		self.subscriptions.push(self.client.subscribe(self.roomPath('moves'), function(data) {
			if (data.client != self.client.guid)
				self.moveTo(data.position)
		}));
		
		// Download previos sketches
		$.getJSON('/rooms/'+ this.name +'/sketches.json', function(data) {
			_.each(data.sketches, function(sketch) {
				self.add(sketch);
		  });
		})
	}
	
	//this.instace = new InstanceTask(this.dom);
	
	
	//self.events();
	
}

InstanceTask.prototype.createRoommatesContainer = function()
{
	var data = 
		{
		client:this.client
		,roomName:this.name
		};
	this.roommatesContainer = new GroupInstanceTaskWizard(data);
	
	if(this.persisted)
	{
		var data2 = this.roommateData();
		this.roommatesContainer.addRoommates(data2);
		this.roommatesContainer.setVisible(true);
	}
	else
		this.roommatesContainer.setVisible(false);
}
InstanceTask.prototype.roommateData = function()
{
/*
	Estos datos se utilizaran para todas las habitaciones.
	No es para una habitación en particular.
*/
	var data =
		{
			name: this.client.name
			,guid:this.client.guid
			,roomName:this.name
			,userType:this.client.userType
			,working:false			//no esta trabajando en ninguna habitación por defecto
			,enabled:false			//no esta disponible para ninguna habitación por defecto
		};
	return data;
}
InstanceTask.prototype.compareMaps = function(node, dragnode)
{
	var dragnode2 = dragnode.get('children').pop();
	var node2 = node.get('children').pop();
	return node2._node.id == dragnode2._node.id;
}

InstanceTask.prototype.copyOverlays = function(room)
{
	var self = this;
	_.each(room.overlays, function(overlay)
	{
		self.checkOverlay(overlay);
	});
}

InstanceTask.prototype.roomPath = function(zone)
{
	return '/room/' + this.name + '/' + zone;
}

InstanceTask.prototype.stop = function()
{
	var self = this;

	_.each(self.subscriptions, function(s)
	{
		s.cancel();
	});
}

InstanceTask.prototype.checkOverlay = function(overlay)
{
	var self = this;
	var overlayAux = _.detect(self.overlays, function(s) { return s.id == overlay.id });
	if(!overlayAux)
	{
		self.saveOverlay(overlay);
	}	
}

InstanceTask.prototype.saveOverlay = function(overlay)
{
	if(this.persisted)
	{
		this.client.sendOverlay(this, overlay);
	} 
	else
	{
		this.add(overlay.to_json());
	}
}
InstanceTask.prototype.updateOverlay = function(overlay)
{
	/*
	Si hay que enviarlo a todos los participantes
	*/
	if(this.persisted)
	{
		this.client.removeSketch(this, overlay);
		this.client.sendOverlay(this, overlay);
	} 
	else
	{
		this.update(overlay.to_json());
	}
}

InstanceTask.prototype.destroy = function(overlay)
{
	if(this.persisted)
	{
		this.client.removeSketch(this, overlay);
	} 
	else
	{
		this.remove(overlay.to_json());
	}
}

/*
Agregar Overlay
*/
InstanceTask.prototype.add = function(data)
{
	var clone = JSON.parse(JSON.stringify(data));
	var overlay =  new Overlay(clone);
	this.overlays.push(overlay);
	/*
		actualizar mini mapa
	*/
	/*
	this.map.addOverlay(overlay);
	
	this.updateMap();
	*/
	//Agregar nuevo overlay en el mapa grande ( se borro para disminuir la cantidad de puntos, entre otras razones)
	if(this.workspace)
		this.workspace.addOverlay(overlay);
}
/*
Actualiza un Overlay existente
*/
InstanceTask.prototype.update = function(data)
{
	this.remove(data);
	this.add(data);
	this.updateMap();
}
/*
Elimina un Overlay existente
*/
InstanceTask.prototype.remove = function(data) 
{
	var overlay = _.detect(this.overlays, function(s) { return s.id == data.id });
	if (overlay) {
		this.overlays = _.without(this.overlays, overlay);
		var id = overlay.id;
		overlay.destroy();
		
		/*TODO
		this.map.removeOverlay(id);
		*/
	}
	//TODO
	//this.updateMap();
}


InstanceTask.prototype.setActive = function(active) {
	var self = this;


	if (active) {
		if ( self.client.activeRoom == self ) return;
		if ( self.client.activeRoom )
		  self.client.activeRoom.setActive(false);
		self.client.activeRoom = self;

		self.workspace = new Workspace(self);
		self.workspace.defaultValues();
		//TODO
		//self.map.setOpacity(this.SELECTED);
		mapSketcherClient.currentRoomId=self.name;
		var parentNode = self.dom.parentNode;
		self.instaceTaskUI.active(true);
		//TODO
		/*
		document.getElementById('personalDelete').style.display ="none";
		document.getElementById('collaborativeDelete').style.display ="none";
		document.getElementById('globalDelete').style.display ="none";
		if(parentNode.id =='personal')
			document.getElementById('personalDelete').style.display ="";
		else if(parentNode.id =='collaborative')
			document.getElementById('collaborativeDelete').style.display ="";
		else
			document.getElementById('globalDelete').style.display ="";
		
		*/
		
		
	} 
	else {
		self.workspace.stop();
		self.workspace = null;
		self.dom.style.border = "";
		self.instaceTaskUI.active(false);
		//TODO
		//self.map.setOpacity(this.NOT_SELECTED);
		
	}
}

InstanceTask.prototype.moveTo = function(pos, options)
{
	if( this.currentPosition == pos) return;

	this.currentPosition = pos;
	/*
	this.map.moveTo({
		lat: pos.lat
		, lng: pos.lng
		, zoom: pos.zoom
	});
	*/
	if (options && options.userMove) {
		if (this.persisted) 
			this.client.sendSignal(
			this.roomPath('moves')
			,{ 
				client: this.client.guid
				,position: pos
			});
	}
	else {
		if (this.workspace) 
			this.workspace.moveTo(pos);
	}
	
	//this.map.update();
}

InstanceTask.prototype.events = function()
{
	var self = this;
	
	$(self.dom).bind('click',function()
	{
		self.setActive(true);
	});
}
