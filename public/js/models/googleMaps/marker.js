function Marker(data, overlay, options) {
	var self = this;
	if(data) {
		self.position = data.position;
		self.title = data.title; 
		self.infoWindow = data.infoWindow;
		self.body = data.body;
	} 
	else {
		self.position = [];
		self.title = "Sin titulo";
		self.infoWindow = null;
		self.body = "sin cuerpo";
	}

	if (overlay) {
		self.overlay = overlay;
		$(self.overlay).bind('delete', function() {
			self.onOverlayDelete();
		})
	}

	this.options = options || {};
  
  
}

//Herencia
Marker.prototype = new Overlay();

//TODO
Marker.prototype.onOverlayDelete = function() {
	if(self.gpolyline) {
		self.gpolyline.setMap(null);
	}
}
 

Marker.prototype.to_gmarker = function() {
	var self = this;
	var pos = self.posToGPoint(self.position);
	var gmarker = new google.maps.Marker({
		position: pos
		,title: self.title
		,draggable:true
	});

	if (self.options.click) {
		google.maps.event.addListener(gmarker, 'click', function(event) {
			//self.options.click.call(self.overlay, self);
			self.showInfoWindow(this.map);
			event.stopPropagation();
		});
	  
	}

	return gmarker;
} 

Marker.prototype.posToGPoint = function(pos) {
	return new google.maps.LatLng(pos.latitude, pos.longitude);
}

Marker.prototype.setMap = function(map) {
	if(!this.gmarker) this.gmarker = this.to_gmarker();
	this.gmarker.setMap(map && map.gmap);
	this.map = map && map.gmap;
} 

Marker.prototype.to_json = function() {
	this.update();
	return {
		position: this.position
		, title: this.title
		,body: this.body
	};
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
	google.maps.event.addListener(window,'closeclick',function(myEvent){
		if(!myEvent){
                myEvent=window.event;
        }
        myEvent.cancelBubble=true;
        if(myEvent.stopPropagation){
                myEvent.stopPropagation();
        }
	});	
	
	return window;
}
Marker.prototype.update = function()
{
	this.title = this.infowindow && this.infowindow.getTitle();
	this.body = this.infowindow && this.infowindow.getBody();
}





