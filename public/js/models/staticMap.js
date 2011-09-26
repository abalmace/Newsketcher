function StaticMap(options)
{
	var self = this;
	self.id = Utils.guid();
	self.dom = options.dom;
		
	var mapOptions =
		{
		zoom: options.zoom
		,center: options.latlng
		,mapTypeId: google.maps.MapTypeId.ROADMAP
		};

  	self.gsmap = new GoogleMapWizard(mapOptions)
}

StaticMap.prototype.moveTo = function(pos)
{
	var center = 	
	{
		latitude:pos.lat
		,longitude:pos.lng
	}
	
	this.gsmap.setCenter(center);
	
	this.gsmap.setZoom(pos.zoom)
}

StaticMap.prototype.getPosition = function()
{
	var center = this.gmap.getCenter();

	return {
		lat: center.lat()
		, lng: center.lng()
		, zoom: this.getZoom()
	}
}

StaticMap.prototype.update = function()
{
	this.dom.src = this.gsmap.getImage()
}


StaticMap.prototype.onClick = function(callback)
{
	var self = this;
  	self.dom.onclick = callback
}

StaticMap.prototype.setOpacity = function(opacity)
{
	this.dom.style.opacity = opacity
}
StaticMap.prototype.addMarker = function(marker,id)
{
	this.gsmap.addMarker(marker.position,null,id)
}
StaticMap.prototype.addPolyline = function(polyline,id)
{
	this.gsmap.addPolyline(polyline.points,polyline.color,id)
}
StaticMap.prototype.setZoom = function(zoom)
{
	this.gsmap.setZoom(zoom)
}
StaticMap.prototype.addOverlay = function(overlay)
{
	var self = this;
	var json = overlay.to_json();
	//si es una polyline
	if(json.polylines)
		_.each(json.polylines, function(o) { self.addPolyline(o,json.id)});
	else if(json.markerJson)
		_.each(json.markerJson, function(o) { self.addMarker(o,json.id)})
}
StaticMap.prototype.updateOverlay = function(overlay)
{
	this.removeOverlay(overlay.id);
	this.addOverlay(overlay)
}
StaticMap.prototype.removeOverlay = function(id)
{
	this.gsmap.removeOverlay(id)
}

	
