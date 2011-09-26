/*
	Corresponde a una clase abstracta
	Tiene elementos comunes para Pointers(markers) y Sketches(Polylines)
*/

function Overlay(data)
{
	if(data)
	{
		this.id = data.id;
		this.overlay = data.polylines || data.markerJson ;
		this.dataInfoWindow =data.infoWindow;
	} 
	else
	{
		this.id = Utils.guid();
		this.overlay = [];
	}
	this.drawPool = {};
}


Overlay.prototype.addOverlay = function(overlay)
{
	this.overlay.push(overlay.to_json());
}

Overlay.prototype.to_json = function()
{
	return this.getJsonElement();
}
Overlay.prototype.getJsonElement = function()
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
}

Overlay.prototype.destroy = function()
{
	var self = this;
	_.each(this.drawPool, function(overlay, map_id)
	{
		self.unDrawFrom(map_id);
	});
}

Overlay.prototype.drawAt = function(map, options)
{
	var self = this;
	var optionsAux = 	{
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
}


Overlay.prototype.unDrawFrom = function(map_id)
{
	var overlay = this.drawPool[map_id];

	if(overlay)
	{
		_.each(overlay, function(p) { p.setMap(null) });
		delete this.drawPool[map_id]
	}
}

Overlay.prototype.overlayObjects = function(options)
{
	var self = this;
	return _.map(self.overlay, function(o)
	{ 
		if(o.points)
			return new Polyline(o, self, options);
		else if(o.position)
			return new Marker(o, self, options)
	});
}

Overlay.prototype.showInfoWindow = function(gMap,overlay)
{
	this.infowindow = this.infowindow || this.createInfoWindow();											
	this.infowindow.open(gMap, overlay);
}

Overlay.prototype.positionInfoWindow = function(latLng)
{
	this.infowindow = this.infowindow || this.createInfoWindow();
	this.infowindow.position(latLng);
}
Overlay.prototype.createInfoWindow = function()
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
