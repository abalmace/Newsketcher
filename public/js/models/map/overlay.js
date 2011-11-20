YUI.add("overlay", function(Y)
{ 
	var Lang = Y.Lang;


	function Overlay(data)
	{
		Overlay.superclass.constructor.apply(this, arguments);
	}


	Overlay.NAME = "overlay";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	Overlay.ATTRS =
	{
		overlay:
			{
			value:null
			}
		,id:
			{
			value:null	
			}
		,dataInfoWindow:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(Overlay, Y.Base,
	{
		initializer: function(data)
		{
			if(data)
			{
				this.id = data.id;
				this.overlay = data.overlay ;
				this.dataInfoWindow =data.infoWindow;
			} 
			else
			{
				this.id = Utils.guid();
				this.overlay = [];
			}
			this.drawPool = {};
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

		addOverlay : function(overlay)
		{
			this.overlay.push(overlay.to_json());
		},

		to_json : function()
		{
			return this.getJsonElement();
		},
	  
		getJsonElement : function()
		{
			var overlayAux = this.overlay[0];
			if(overlayAux.points)
				return {
					id: this.id
					,polylines: this.overlay
					,infoWindow: this.dataInfoWindow || ""
				}
			else if(overlayAux.position)
				return {
					id: this.id
					,markerJson: this.overlay
					,infoWindow: this.dataInfoWindow || ""
				}
		},

		destroy : function()
		{
			var self = this;
			_.each(this.drawPool, function(overlay, map_id)
			{
				self.unDrawFrom(map_id);
			});
		},

		drawAt : function(map, options)
		{
			var self = this;
			var optionsAux = 	
			{
				click: function(gMap, gOverlay)
					{
					self.showInfoWindow(gMap, gOverlay);
					}
				,position: function(latLng)
					{
					self.positionInfoWindow(latLng);
					}
				,update: function()
					{
						if(options.click)
						{
							self.dataInfoWindow = (self.infowindow && self.infowindow.to_json())|| self.dataInfoWindow;
							options.click.update(self);
						}
					}
				,destroy: function()
					{
						if(options.click)
							options.click.destroy(self);
					}
				,drag: function()
					{
						if(options.drag)
							options.drag();
					}
				,dragend: function(position)
					{
						if(options.click)
							self.overlay[0].position = position;
							self.dataInfoWindow = (self.infowindow && self.infowindow.to_json())|| self.dataInfoWindow;
							options.click.update(self);
					}	
			}
			var objects = map.id in this.drawPool ? this.drawPool[map.id] : this.drawPool[map.id] = this.overlayObjects(optionsAux);
			_.each(objects, function(o)
			{ 
				o.setMap(map) 
			});
			
			this.options= optionsAux;
		},


		unDrawFrom : function(map_id)
		{
			var overlay = this.drawPool[map_id];

			if(overlay)
			{
				_.each(overlay, function(p) { p.setMap(null) });
				delete this.drawPool[map_id]
			}
		},

		overlayObjects : function(options)
		{
			var self = this;
			return _.map(self.overlay, function(o)
			{ 
				if(o.points)
					return new Polyline(o, self, options);
				else if(o.position)
					return new Marker(o, self, options)
			});
		},

		showInfoWindow : function(gMap,overlay)
		{
			this.infowindow = this.infowindow || this.createInfoWindow();											
			this.infowindow.open(gMap, overlay);
		},

		positionInfoWindow : function(latLng)
		{
			this.infowindow = this.infowindow || this.createInfoWindow();
			this.infowindow.position(latLng);
		},
	  
		createInfoWindow : function()
		{
			var window = new InfoWindow(this.dataInfoWindow,this.options);
			google.maps.event.addListener(window,'closeclick',function(myEvent)
			{
				if(!myEvent)
					myEvent=window.event;
				if(myEvent.stopPropagation)
					myEvent.stopPropagation();
			});	
			return window;
		}
	});

	Y.namespace("ModuleMap").Overlay = Overlay;

}, "1.0", {requires:['base']});