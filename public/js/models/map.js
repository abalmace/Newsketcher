function Map(options)
{
	var self = this;
	self.id = Utils.guid();
	self.dom = options.dom;
	self.controllable = options.controllable;
	self.showCredits = options.showCredits;

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

	if(options.position)
		self.moveTo(options.position);

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
}

Map.prototype.onMove = function(callback)
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
}

Map.prototype.getPosition = function()
{
	var center = this.gmap.getCenter();
	
	return {
		lat: center.lat()
		, lng: center.lng()
		, zoom: this.getZoom()
	}
}

Map.prototype.moveTo = function(pos)
{
	if (this.locked)
	{
		this.lastMove = pos;
		return;
	}

	this.gmap.panTo(new google.maps.LatLng(pos.lat, pos.lng));
	this.gmap.setZoom(pos.zoom);
}

Map.prototype.onClick = function(callback)
{
	var self = this;
	google.maps.event.addListener(self.gmap, 'click', function()
	{
		callback()
	})
}

Map.prototype.lock = function()
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
}

Map.prototype.unlock = function()
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
}

Map.prototype.getXYPosition = function(x, y)
{
	var location = this.overlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(x, y));

	return {
		latitude:  location.lat()
		, longitude: location.lng()
	}
}

Map.prototype.getZoom = function()
{
	return this.gmap.getZoom();	
}

Map.prototype.getCenter = function()
{
	return this.gmap.getCenter();
}

Map.prototype.setOpacity = function(opacity)
{
	this.dom.style.opacity = opacity;
}
