YUI.add("genericroom", function(Y)
{ 
	var Lang = Y.Lang;


	function GenericRoom(data)
	{
		GenericRoom.superclass.constructor.apply(this, arguments);
	}


	GenericRoom.NAME = "genericRoom";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	GenericRoom.ATTRS =
	{
		client:
			{
			value:null
			}
		,overlays:
			{
			value:[]	
			}
		,dom:
			{
			value:null
			}
		,subscriptions:
			{
			value:[]
			}
		,editable:
			{
			value:null
			}
		,persisted:
			{
			value:null	
			}
		,currentPosition:
			{
			value:null	
			}
		,SELECTED:
			{
			value:"1"	
			}
		,DRAG:
			{
			value:"0.5"	
			}
			
		NOT_SELECTED:
			{
			value:"0.3"	
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(GenericRoom, Y.Base,
	{
		initializer: function(data)
		{
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

		this.publish("myEvent", {
		defaultFn: this._defMyEventFn,
		bubbles:false
		});
		},

		destructor : function()
		{
			if(this.persisted)
			{
				this.client.removeSketch(this, overlay);
			} 
			else
			{
				this.remove(overlay.to_json());
			}
		},

		/* MyComponent specific methods */

		start : function()
		{
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
		},
	  
		createRoommatesContainer : function()
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
		},
	  
		roommateData : function()
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
		},
	  
		stop : function()
		{
			Y.Array.each(this.subscriptions, function(s)
			{
				s.cancel();
			});
		},
	  
		compareMaps : function(node, dragnode)
		{
			var dragnode2 = dragnode.get('children').pop();
			var node2 = node.get('children').pop();
			return node2._node.id == dragnode2._node.id;
		},

		copyOverlays : function(room)
		{
			var self = this;
			Y.Arrays.each(room.overlays, function(overlay)
			{
				self.checkOverlay(overlay);
			});
		},
	  
		roomPath : function(zone)
		{
			return '/room/' + this.name + '/' + zone;
		},
	  
		saveOverlay : function(overlay)
		{
			if(this.persisted)
			{
				this.client.sendOverlay(this, overlay);
			} 
			else
			{
				this.add(overlay.to_json());
			}
		},
	  
		updateOverlay : function(overlay)
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
		},
	  
		moveTo : function(pos, options)
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


		_checkOverlay : function(overlay)
		{
			var self = this;
			var overlayAux = _.detect(self.overlays, function(s) { return s.id == overlay.id });
			if(!overlayAux)
			{
				self.saveOverlay(overlay);
			}	
		},
		
// 		Agregar Overlay
		_add : function(data)
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
		},
		
		/*
		Actualiza un Overlay existente
		*/
		_update : function(data)
		{
			this.remove(data);
			this.add(data);
			this.updateMap();
		},
	  
		/*
		Elimina un Overlay existente
		*/
		_remove : function(data) 
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
		},
	  
		_events : function()
		{
			var self = this;
			
			$(self.dom).bind('click',function()
			{
				self.setActive(true);
			});
		}
		
	});

	Y.namespace("ModuleRoom").GenericRoom = GenericRoom;

}, "1.0", {requires:['base']});