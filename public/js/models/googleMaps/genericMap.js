YUI.add("genericmap", function(Y)
{ 
	var Lang = Y.Lang;


	function GenericMap(data)
	{
		GenericMap.superclass.constructor.apply(this, arguments);
	}


	GenericMap.NAME = "genericMap";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	GenericMap.ATTRS =
	{
		guid:
			{
			value:null
			}
		,dom:
			{
			value:null	
			}
		,controllable:
			{
			value:null
			}
		,showCredits:
			{
			value:null
			}
		,gmap:
			{
			value:null
			}
		,blue_dot:
			{
			value:null
			}
		,blue_circle:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(GenericMap, Y.Base,
	{
		initializer: function(options)
		{
			var self = this;
			self.guid = Utils.guid();
			self.dom = options.dom;
			self.controllable = options.controllable;
			self.showCredits = options.showCredits;
			
			self._mapProperties(options.position);
			self._createLocationMaker();

		this.publish("myEvent", {
		defaultFn: this._defMyEventFn,
		bubbles:false
		});
		},

		destructor : function()
		{
			this.gmap = null;
			var newDiv = document.createElement('div');
			newDiv.id = 'map';
			var node = Y.one(this.dom);
			node.replace(newDiv);
			
		},

		/* MyComponent specific methods */

		onMove : function(callback)
		{
			var self = this;

			google.maps.event.addListener(self.gmap, 'center_changed', function()
			{
				if (self.userMove)
					callback(self.getPosition())
			});

			google.maps.event.addListener(self.gmap, 'zoom_changed', function()
			{
				if (self.userMove)
					callback(self.getPosition())
			});
		},

		getPosition : function()
		{
			var center = this.gmap.getCenter();
			
			return {
				lat: center.lat()
				, lng: center.lng()
				, zoom: this.getZoom()
			}
		},

		moveTo : function(pos)
		{
			if (this.locked)
			{
				this.lastMove = pos;
				return;
			}

			this.gmap.panTo(new google.maps.LatLng(pos.lat, pos.lng));
			this.gmap.setZoom(pos.zoom);
		},

		onClick : function(callback)
		{
			var self = this;
			google.maps.event.addListener(self.gmap, 'click', function()
			{
				callback()
			})
		},

		lock : function()
		{
			this.locked = true;

			this.gmap.setOptions(
			{
				zoomControl: false,
				/*panControl: false,*/
				scrollwheel: false,
				disableDoubleClickZoom: true,
				draggable: false
			})
		},

		unlock : function()
		{
			this.locked = false;
			if (this.lastMove)
			{
				this.moveTo(this.lastMove);
				delete this.lastMove;
			}

			this.gmap.setOptions(
			{
				zoomControl: true,
				/*panControl: true,*/
				scrollwheel:true,
				disableDoubleClickZoom: false,
				draggable: true
			})
		},

		getXYPosition : function(x, y)
		{
			y = y-40;
			var location = this.overlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(x, y));

			return {
				latitude:  location.lat()
				, longitude: location.lng()
			}
		},

		getZoom : function()
		{
			return this.gmap.getZoom();	
		},

		getCenter : function()
		{
			return this.gmap.getCenter();
		},

		setOpacity : function(opacity)
		{
			this.dom.style.opacity = opacity;
		},

		location : function(callback)
		{
			var self = this;
			if(navigator.geolocation)
			{
				browserSupportFlag = true;
				navigator.geolocation.getCurrentPosition(callback,
				function()
				{
					self.handleNoGeolocation(browserSupportFlag);
				});
				// Try Google Gears Geolocation
			}
			else
			{
				browserSupportFlag = false;
				self.handleNoGeolocation(browserSupportFlag);
			}
		},
	  
		centerInLocation:function()
		{
			var self = this;
			self.location(function(position)
			{
				var location = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
				self.gmap.panTo(location);
			})
		},
	  
		showLocation: function()
		{
			var self = this;
			self.location(function(position)
			{
				var location = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
				self.gmap.setCenter(location);
				
				self.blue_dot.setMap(self.gmap);
				self.blue_dot.setPosition(location);
				self.blue_circle.setMap(self.gmap);
				self.blue_circle.setCenter(location);
			});
		},
	  
		hideLocation:function()
		{
			this.blue_circle.setMap(null);
			this.blue_dot.setMap(null);
		},

		handleNoGeolocation : function(errorFlag)
		{
			if (errorFlag == true)
			{
				alert("Geolocation service failed.");
			}
			else
			{
				alert("Your browser doesn't support geolocation.");
			}
		},
	  
		_mapProperties:function(initPosition)
		{
			var self = this;
			var latlng = new google.maps.LatLng(-33.458, -70.662);
			var mapOptions =
			{ 
				zoom: 8
				, center: latlng
				, zoomControl: true
				, zoomControlOptions:
				{
					position: google.maps.ControlPosition.LEFT_BOTTOM
				}
				, mapTypeId: google.maps.MapTypeId.ROADMAP
				, streetViewControl: false
				, mapTypeControl: false
				, panControl: false
			};

			if(!self.controllable)
			{
				mapOptions.disableDoubleClickZoom = true;
				mapOptions.disableDefaultUI = true;
				mapOptions.draggable = false;
				mapOptions.scrollwheel = false;
			}
			else
			{
				mapOptions.navigationControlOptions = 
				{
					style: google.maps.NavigationControlStyle.SMALL
				}
			}
			

			self.gmap = new google.maps.Map(self.dom, mapOptions);

			if(initPosition)
				self.moveTo(initPosition);

			google.maps.event.addListener(self.gmap, 'dragstart', function()
			{
				self.userMove = true
			});
			google.maps.event.addListener(self.gmap, 'dragend', function()
			{
				self.userMove = false
			});

			// Create Overlay to capture XY Position
			this.overlay = new google.maps.OverlayView();
			this.overlay.draw = function() {};
			this.overlay.onRemove = function() {};
			this.overlay.setMap(this.gmap);

			// Clean the exesive gmaps credits.
			if(!self.showCredits)
				setTimeout(function()
				{
					$('a[target="_blank"]', self.dom).parent().detach();
				}, 800);
		},
		
		_createLocationMaker:function()
		{
			var markerImageOptions =
			{
				url: '../../css/images/blue_dot.png'
				,size:new google.maps.Size(14, 13)
				,anchor:new google.maps.Point(7, 7)
			}
			
			var gMarkerImage = new google.maps.Marker(markerImageOptions);
			
			this.blue_dot = new google.maps.Marker({icon:gMarkerImage});
			
			
			 var circleOptions = 
			 {
				strokeColor: "#0000FF",
				strokeOpacity: 0.15,
				strokeWeight: 2,
				fillColor: "#0000FF",
				fillOpacity: 0.1,
				radius: 60
			};
			this.blue_circle = new google.maps.Circle(circleOptions);
		}

	});

	Y.namespace("ModuleMap").GenericMap = GenericMap;

}, "1.0", {requires:['base']});