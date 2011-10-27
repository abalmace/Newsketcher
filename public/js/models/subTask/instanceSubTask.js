YUI.add("instancesubtask", function(Y)
{ 
	var Lang = Y.Lang;


	function InstanceSubTask(data)
	{
		InstanceSubTask.superclass.constructor.apply(this, arguments);
	}


	InstanceSubTask.NAME = "instanceSubTask";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	InstanceSubTask.ATTRS =
	{
		client:
			{
			value:null
			}
		,overlays:
			{
			value:[]
			}
		,subscriptions:
			{
			value:[]
			}
		,name:
			{
			value:null
			}
		,dom:
			{
			value:null
			}
		,editable:
			{
			value:true
			}
		,persisted:
			{
			value:true
			}
		,currentPosition:
			{
			value:null
			}
		,instanceSubTaskUI:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(InstanceSubTask, Y.Base,
	{
		initializer: function(data)
		{
			this.overlays = [];
			this.subscriptions = [];
			this.client = data.client;
			this.name = data.name.toLowerCase();
			this.dom = data.dom;
			this.editable = (typeof data.editable == 'undefined') ?
				true : data.editable;
			this.persisted = (typeof data.persisted == 'undefined') ?
				true : data.persisted;

			this.currentPosition = 
			{
				lat: -33.457788
				,lng: -70.664105
				,zoom: 16
			}

			this._addSubscriptions();
			this.instanceSubTaskUI = new Y.ModuleTask.InstanceSubTaskUI({dom:this.dom,title:data.title});
			this._events();

		this.publish("myEvent", {
		defaultFn: this._defMyEventFn,
		bubbles:false
		});
		},

		destructor : function()
		{
		/*
		* destructor is part of the lifecycle introduced by 
		* the Base class. It is invoked when destroy() is called,
		* and can be used to cleanup instance specific state.
		*
		* It does not need to invoke the superclass destructor. 
		* destroy() will call initializer() for all classes in the hierarchy.
		*/
		},

		/* MyComponent specific methods */
		
		stop : function()
		{
			var self = this;

			_.each(self.subscriptions, function(s)
			{
				s.cancel();
			});
		},

		_addSubscriptions : function()
		{
			var self = this;
			
			if (self.persisted)
			{
				// Subscribe to sketch updates.
				self.subscriptions.push(self.client.subscribe(self._roomPath('sketches'), function(sketch)
				{
					if (sketch.type == 'new')
						self.add(sketch);
					else if (sketch.type == 'delete')
						self.remove(sketch);

				}));
				self.subscriptions.push(self.client.subscribe(self._roomPath('moves'), function(data)
				{
					if (data.client != self.client.guid)
						self.moveTo(data.position)
				}));
				
				// Download previos sketches
				$.getJSON('/rooms/'+ this.name +'/sketches.json', function(data)
				{
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
				var data2 = this._roommateData();
				this.roommatesContainer.addRoommates(data2);
				this.roommatesContainer.setVisible(true);
			}
			else
				this.roommatesContainer.setVisible(false);
		},
	  
		_roommateData : function()
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
				
		compareMaps : function(node, dragnode)
		{
			var dragnode2 = dragnode.get('children').pop();
			var node2 = node.get('children').pop();
			return node2._node.id == dragnode2._node.id;
		},

		copyOverlays : function(room)
		{
			var self = this;
			_.each(room.overlays, function(overlay)
			{
				self._checkOverlay(overlay);
			});
		},
	  
		_roomPath : function(zone)
		{
			return '/room/' + this.name + '/' + zone;
		},
	  
		_checkOverlay : function(overlay)
		{
			var self = this;
			var overlayAux = _.detect(self.overlays, function(s) { return s.id == overlay.id });
			if(!overlayAux)
			{
				self.saveOverlay(overlay);
			}	
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

		destroy : function(overlay)
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

		/*
		Agregar Overlay
		*/
		add : function(data)
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
		update : function(data)
		{
			this.remove(data);
			this.add(data);
			this.updateMap();
		},
		/*
		Elimina un Overlay existente
		*/
		remove : function(data) 
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

		setActive : function(active)
		{
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
				newsketcherClient.currentRoomId=self.name;
				var parentNode = self.dom.parentNode;
				self.instanceSubTaskUI.active(true);
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
				self.instanceSubTaskUI.active(false);
				//TODO
				//self.map.setOpacity(this.NOT_SELECTED);
				
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
					this._roomPath('moves')
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

	Y.namespace("ModuleTask").InstanceSubTask = InstanceSubTask;

}, "1.0", {requires:['base','instancesubtaskui']});   