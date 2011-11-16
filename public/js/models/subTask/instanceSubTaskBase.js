YUI.add("instancesubtaskbase", function(Y)
{ 
	var Lang = Y.Lang;


	function InstanceSubTaskBase(data)
	{
		InstanceSubTaskBase.superclass.constructor.apply(this, arguments);
	}


	InstanceSubTaskBase.NAME = "instanceSubTaskBase";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	InstanceSubTaskBase.ATTRS =
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
		,group:
			{
			value:[]
			}
		,name:
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
	};

    /* MyComponent extends the Base class */
	Y.extend(InstanceSubTaskBase, Y.Base,
	{
		initializer: function(data)
		{
			this.overlays = [];
			this.subscriptions = [];
			this.client = data.client;
			this.group = data.group;
			this.name = data.name.toLowerCase();
			this.editable = (typeof data.editable == 'undefined') ?
				true : data.editable;
			this.persisted = (typeof data.persisted == 'undefined') ?
				true : data.persisted;

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

		_downloadPrevious : function()
		{
			var self = this;
			
			if (self.persisted)
			{
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
				this._sendOverlay(overlay);
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
				this._removeOverlay(overlay);
				this._sendOverlay(overlay);
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
				this._removeOverlay(overlay);
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
	  
		_sendOverlay : function(overlay)
		{
			var data = overlay.to_json();
			data.client = this.client.guid;
			data.type = 'new';

			this._sendSignal('sketches', data);
		},
	  
		_removeOverlay : function(overlay)
		{
			var data = 
			{
			id: overlay.id
			,type: 'delete'
			,client: this.client.guid	
			}
			this._sendSignal('sketches', data);
		},
	  
		_sendSignal : function(zone,data)
		{
			this.client.sendSignal(this._roomPath(zone), data);
		}
	});

	Y.namespace("ModuleTask").InstanceSubTaskBase = InstanceSubTaskBase;

}, "1.0", {requires:['base','instancesubtaskui','instancesubtaskgroup']});   