function Marker(data, overlay, options)
{
	var self = this;
	if(data)
	{
		self.position = data.position;
		self.title = data.title; 
		self.infoWindow = data.infoWindow;
		self.body = data.body;
	} 
	else
	{
		self.position = [];
		self.title = "Sin titulo";
		self.infoWindow = null;
		self.body = "sin cuerpo"
	}

	if (overlay)
	{
		self.overlay = overlay;
		$(self.overlay).bind('delete', function()
		{
			self.onOverlayDelete()
		})
	}

	this.options = options || {}
}

Marker.prototype.onOverlayDelete = function()
{
	if(self.gpolyline)
		self.gpolyline.setMap(null);
}

Marker.prototype.to_gmarker = function()
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
} 

Marker.prototype.posToGPoint = function(pos)
{
	return new google.maps.LatLng(pos.latitude, pos.longitude)
}

Marker.prototype.setMap = function(map)
{
	if(!this.gmarker) this.gmarker = this.to_gmarker();
	this.map = map && map.gmap;
	this.gmarker.setMap(this.map)
} 

Marker.prototype.to_json = function()
{
	this.update();
	return {
		position: this.position
		, title: this.title
		,body: this.body
	}
}

Marker.prototype.update = function()
{
	this.title = this.infowindow && this.infowindow.getTitle();
	this.body = this.infowindow && this.infowindow.getBody()
}

Marker.prototype.getOverlay = function()
{
	return this.gmarker
}
