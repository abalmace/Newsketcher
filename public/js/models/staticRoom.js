/*
	Son las distintas habitaciones para trabajar con mapas.
		- Las habitaciones tienen lugares de trabajo.
		
*/
function StaticRoom(options)
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
}

StaticRoom.prototype.start = function() {
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
	
	// Display Map
	var mapDiv = document.createElement('img');
	mapDiv.className = "map";
	mapDiv.room = self;
	mapDiv.style.opacity = this.NOT_SELECTED;
	
	$(mapDiv).appendTo(self.dom);
	
	var latlng =	{
			latitude: self.currentPosition.lat
			,longitude: self.currentPosition.lng
			};
		
	
	self.map = new StaticMap({
			dom: mapDiv
			,latlng: latlng
			,zoom: self.currentPosition.zoom
			});
	
	self.map.update();
	self.events();
	self.dragAndDrop();
}

StaticRoom.prototype.createRoommatesContainer = function()
{
	var data = 
		{
		client:this.client
		,roomName:this.name
		};
	this.roommatesContainer = new GroupWizard(data);
	
	if(this.persisted)
	{
		var data2 = this.roommateData();
		this.roommatesContainer.addRoommates(data2);
		this.roommatesContainer.setVisible(true);
	}
	else
		this.roommatesContainer.setVisible(false);
}
StaticRoom.prototype.roommateData = function()
{
/*
	Estos datos se utilizaran para todas las habitaciones.
	No es para una habitación en particular.
*/
	var data =
		{
			name: this.client.name
			,id:this.client.guid
			,roomName:this.name
			,userType:this.client.userType
			,working:false			//no esta trabajando en ninguna habitación por defecto
			,enabled:false			//no esta disponible para ninguna habitación por defecto
		};
	return data;
}
StaticRoom.prototype.compareMaps = function(node, dragnode)
{
	var dragnode2 = dragnode.get('children').pop();
	var node2 = node.get('children').pop();
	return node2._node.id == dragnode2._node.id;
}

StaticRoom.prototype.copyOverlays = function(room)
{
	var self = this;
	_.each(room.overlays, function(overlay)
	{
		self.checkOverlay(overlay);
	});
}

StaticRoom.prototype.roomPath = function(zone)
{
	return '/room/' + this.name + '/' + zone;
}

StaticRoom.prototype.stop = function()
{
	var self = this;

	_.each(self.subscriptions, function(s)
	{
		s.cancel();
	});
}

StaticRoom.prototype.checkOverlay = function(overlay)
{
	var self = this;
	var overlayAux = _.detect(self.overlays, function(s) { return s.id == overlay.id });
	if(!overlayAux)
	{
		self.saveOverlay(overlay);
	}	
}

StaticRoom.prototype.saveOverlay = function(overlay)
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
StaticRoom.prototype.updateOverlay = function(overlay)
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

StaticRoom.prototype.destroy = function(overlay)
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
StaticRoom.prototype.add = function(data)
{
	var clone = JSON.parse(JSON.stringify(data));
	var overlay =  new Overlay(clone);
	this.overlays.push(overlay);
	/*
		actualizar mini mapa
	*/
	this.map.addOverlay(overlay);
	
	this.updateMap();
	
	//Agregar nuevo overlay en el mapa grande ( se borro para disminuir la cantidad de puntos, entre otras razones)
	if(this.workspace)
		this.workspace.addOverlay(overlay);
}
/*
Actualiza un Overlay existente
*/
StaticRoom.prototype.update = function(data)
{
	this.remove(data);
	this.add(data);
	this.updateMap();
}
/*
Elimina un Overlay existente
*/
StaticRoom.prototype.remove = function(data) 
{
	var overlay = _.detect(this.overlays, function(s) { return s.id == data.id });
	if (overlay) {
		this.overlays = _.without(this.overlays, overlay);
		var id = overlay.id;
		overlay.destroy();
		
		this.map.removeOverlay(id);
	}
	this.updateMap();
}


StaticRoom.prototype.setActive = function(active) {
	var self = this;


	if (active) {
		if ( self.client.activeRoom == self ) return;
		if ( self.client.activeRoom )
		  self.client.activeRoom.setActive(false);
		self.client.activeRoom = self;

		self.workspace = new Workspace(self);
		self.workspace.defaultValues();
		self.map.setOpacity(this.SELECTED);
		mapSketcherClient.currentRoomId=self.name;
		var parentNode = self.dom.parentNode;
		document.getElementById('personalDelete').style.display ="none";
		document.getElementById('collaborativeDelete').style.display ="none";
		document.getElementById('globalDelete').style.display ="none";
		if(parentNode.id =='personal')
			document.getElementById('personalDelete').style.display ="";
		else if(parentNode.id =='collaborative')
			document.getElementById('collaborativeDelete').style.display ="";
		else
			document.getElementById('globalDelete').style.display ="";
		
		this.createRoommatesContainer();
		
	} 
	else {
		self.workspace.stop();
		self.workspace = null;
		self.dom.style.border = "";
		self.map.setOpacity(this.NOT_SELECTED);
		var data = this.roommateData();
		self.roommatesContainer.leaveRoom(data);
		self.roommatesContainer.stop();
		self.roommatesContainer = null;
	}
}
StaticRoom.prototype.updateMap = function()
{
	/*	TODO
	Falta ver el tema del zoom. debo settear el zoom antes de hacer un update.
	*/
	this.map.update();
}

StaticRoom.prototype.moveTo = function(pos, options)
{
	if( this.currentPosition == pos) return;

	this.currentPosition = pos;
	this.map.moveTo({
		lat: pos.lat
		, lng: pos.lng
		, zoom: pos.zoom
	});

	if (options && options.userMove) {
		if (this.persisted) 
			this.client.sendMove(this, pos);
	} 
	else {
		if (this.workspace) 
			this.workspace.moveTo(pos);
	}
	
	//this.map.update();
}

StaticRoom.prototype.events = function()
{
	var self = this;
	
	self.map.onClick(function() {
		self.setActive(true);
	});
}

StaticRoom.prototype.dragAndDrop = function()
{
	var self = this;
	
	YUI().use('dd-delegate','dd-drop-plugin', 'dd-constrain', 'dd-proxy', 'dd-scroll',function(Y) {
	 
		if(!self)
		   return;
		   
	
		var del = new Y.DD.Delegate({
			cont: '#personal',
			nodes: 'div.miniRoom',
			dragMode: 'intersect'
		});
	
		   //Listen for all drag:drag events
			del.on('drag:drag', function(e)
			{
			   
				Y.DD.DDM.syncActiveShims(true);
			});
	
		del.on('drag:start', function(e)
		{
			var target = e.target;
			var node = target.get('node');
			var child = node.get('children').item(0);
			var clone = node.cloneNode(true);
			var childClone = clone.get('children').item(0);
			var dragNode = target.get('dragNode');
			
			childClone.setStyle('opacity', '1');
			dragNode.set('innerHTML',clone.get('innerHTML'));		
			dragNode.setAttribute('class', clone.getAttribute('class')); 
			
			node.setStyle('z-index', '100');
			child.setStyle('opacity', '.5');
			
			 
		});
		del.on('drag:end', function(e)
		{
			var target = e.target;
			var node =target.get('node');
			var dragNode = target.get('dragNode');
			var domNode =Y.Node.getDOMNode(node) ;
			var name = domNode.id;
			var father =node.get('parentNode');
			var child = node.get('children').item(0);
				if(mapSketcherClient.currentRoomId == name)
					child.setStyle('opacity', '1');
				else	
					child.setStyle('opacity', '0.3');
		});
	 
		del.dd.plug(Y.Plugin.DDConstrained,
		{
			constrain2node: '#rooms'
		});
	 
		del.dd.plug(Y.Plugin.DDProxy,
		{
			moveOnEnd: false,
			cloneNode:false
		});
	 
		del.dd.plug(Y.Plugin.DDNodeScroll,
		{
			node: '#collaborative'
		});
	 
		var element =  document.getElementById(self.map.dom);
		var drop = Y.one(self.map.dom).plug(Y.Plugin.Drop);
		
		drop.drop.on('drop:hit', function(e)
		{
			var node = document.getElementById(e.drag.get('node').get('id'));
			self.copyOverlays(node.childNodes[0].room);
			var target = e.target.get('node');
			var father = target.get('parentNode');
			father.setStyle('border-color', '#000000'); 
		});
		
		drop.drop.on('drop:enter', function(e)
		{
			var node = e.target.get('node');
			var father = node.get('parentNode');
			father.setStyle('border-color', '#00FF00');
		});
		
		drop.drop.on('drop:exit', function(e)
		{
			var node = e.target.get('node');
			var father = node.get('parentNode');
			father.setStyle('border-color', '#000000');
		});
	 
	});
}
 
