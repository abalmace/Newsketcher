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
		,group:
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
		,callback:
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
			this.callback = data.callback;
			this.client = data.client;
			this.group = data.group;
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
		},

		destructor : function()
		{
			
		},
	  
		stop:function()
		{
			var self = this;

			_.each(self.subscriptions, function(s)
			{
				s.cancel();
			});
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
		},	
	  
		_showAddBtn:function(bool)
		{
			if(this.callback && this.callback.showAddBtn)
				this.callback.showAddBtn(bool);
		}
		
		,_showRemoveBtn:function(bool)
		{
			if(this.callback && this.callback.showRemoveBtn)
				this.callback.showRemoveBtn(bool);
		}
	});

	Y.namespace("ModuleTask").InstanceSubTask = InstanceSubTask;

}, "1.0", {requires:['base','instancesubtaskui','instancesubtaskgroup','workspacerwgps','connectionserver']});   