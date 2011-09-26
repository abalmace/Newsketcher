/*
	Corresponde a una clase abstracta
	Tiene elementos comunes para Pointers(markers) y Sketches(Polylines)
*/

function Overlay(data) {
	if(data) {
		this.id = data.id;
		this.title = data.title;
		this.body = data.body;
		this.overlay = data.polylines || data.markerJson ;
	} 
	else {
		this.id = Utils.guid();
		this.title = "sin titulo";
		this.body = "sin cuerpo";
		this.overlay = [];
	}

	this.drawPool = {};
}


Overlay.prototype.addOverlay = function(overlay) {
	this.overlay.push(overlay.to_json());
}

Overlay.prototype.to_json = function() {
	var overlayAux = this.overlay[0];
	//this.overlay.update();
	if(overlayAux.points)
		return {
			id: this.id
			, polylines: this.overlay
		}
	else if(overlayAux.position)
		return {
			id: this.id
			,markerJson: this.overlay
		}
}

Overlay.prototype.destroy = function() {
	var self = this;
	_.each(this.drawPool, function(overlay, map_id) {
		self.unDrawFrom(map_id);
	});
}

Overlay.prototype.drawAt = function(map, options) {
	// var objects = this.drawPool[map] || this.drawPool[map] = this.polylinesObjects(options);
	//var objects = this.overlayObjects(options);
	var objects = map.id in this.drawPool ? this.drawPool[map.id] : this.drawPool[map.id] = this.overlayObjects(options);
	_.each(objects, function(o) { o.setMap(map) });
}


Overlay.prototype.unDrawFrom = function(map_id) {
	var overlay = this.drawPool[map_id];

	if (overlay) {
		_.each(overlay, function(p) { p.setMap(null) });
		delete this.drawPool[map_id]
	}
}

Overlay.prototype.overlayObjects = function(options) {
	var self = this;
	return _.map(self.overlay, function(o) { 
		if(o.points)
			return new Polyline(o, self, options);
		else if(o.position)
			return new Marker(o, self, options)});
}

Marker.prototype.showInfoWindow = function(map){

	this.infowindow = this.infowindow || this.createInfoWindow();
											
	this.infowindow.open(map,this.gmarker,this.overlay);
	
	
}
Marker.prototype.createInfoWindow = function()
{
	var data;
	if(this.body || this.title)
		data = {'title':this.title,'body':this.body}
	var window = new InfoWindow(data,this.options);
	return window;
}



