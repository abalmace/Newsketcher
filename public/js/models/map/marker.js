YUI.add("marker", function(Y)
{ 
	var Lang = Y.Lang;


	function Marker(data)
	{
		Marker.superclass.constructor.apply(this, arguments);
	}


	Marker.NAME = "marker";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	Marker.ATTRS =
	{
		position:
			{
			value:null
			}
		,title:
			{
			value:null	
			}
		,body:
			{
			value:null
			}
		,infoWindow:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(Marker, Y.Base,
	{
		initializer: function(data)
		{
			self.position = data.position || [];
			self.title = data.title || "without title"; 
			self.infoWindow = data.infoWindow;
			self.body = data.body || "without body";
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

		to_gmarker : function()
		{
			var self = this;
			var pos = self.posToGPoint(self.position);
			var gmarker = new google.maps.Marker(
			{
				position: pos
				,title: self.title
				,draggable:true
			});

			if (self.options.click)
			{
				google.maps.event.addListener(gmarker, 'click', function(event)
				{
					self.options.click(self.map, self.gmarker);
					myEvent=window.event; 
			
					if(myEvent.stopPropagation)
						myEvent.stopPropagation() 
				})
			}
			if(self.options.drag)
			{
				google.maps.event.addListener(gmarker, 'drag', function(event)
				{
					self.options.drag()
					
				})
			}
			if(self.options.dragend)
			{
				google.maps.event.addListener(gmarker, 'dragend', function(event)
				{
					var position =	{
							latitude: event.latLng.lat()
							,longitude: event.latLng.lng()
							};
					self.options.dragend(position)
					
				})
			}

			return gmarker
		},

		posToGPoint : function(pos)
		{
			return new google.maps.LatLng(pos.latitude, pos.longitude)
		},

		setMap : function(map)
		{
			this.gmarker = this.gmarker || this.to_gmarker();
			this.map = map && map.gmap;
			this.gmarker.setMap(this.map)
		},

		to_json : function()
		{
			this.update();
			return {
				position: this.position
				, title: this.title
				,body: this.body
			}
		},

		update : function()
		{
			this.title = this.infowindow && this.infowindow.getTitle();
			this.body = this.infowindow && this.infowindow.getBody()
		},

		getOverlay : function()
		{
			return this.gmarker
		}

	});

	Y.namespace("ModuleMap").Marker = Marker;

}, "1.0", {requires:['base']});