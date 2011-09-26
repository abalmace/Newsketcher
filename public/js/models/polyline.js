
function Polyline(data, overlay, options)
{
	var self = this;
	if(data)
	{
		self.points = data.points;
		self.color = data.color; 
		self.weight =data.weight;
		self.zoom = data.zoom;
	} 
	else
	{
		self.points = [];
		self.pointIndexsToKeep = [];
		self.color = "#FF0000"; 
		self.weight =4;
		self.zoom = 8;
	}
	if (overlay)
	{
		self.overlay = overlay;
		$(self.overlay).bind('delete', function()
		{
			self.onOverlayDelete();
		})
	}
	this.options = options || {};
}


Polyline.prototype.onOverlayDelete = function()
{
	if(self.gpolyline)
		self.gpolyline.setMap(null);
}

Polyline.prototype.addPoint = function(position)
{
	var self = this;
	
	self.points.push(position);
	if(self.gpolyline)
		self.gpolyline.setPath(_.map(self.points, Polyline.posToGPoint));
} 
Polyline.prototype.to_gpolyline = function()
{
	var self = this;
	
	self.gpolyline = new google.maps.Polyline(
	{
		path: _.map(self.points, Polyline.posToGPoint)
		, strokeColor: self.color
		, strokeOpacity: 1.0
		, strokeWeight: self.weight 
		, clickable : true
	});

	if (self.options.click)
	{
		google.maps.event.addListener(self.gpolyline, 'click', function(event)
		{
			self.options.position(event.latLng);
			self.options.click(self.map);
			myEvent=window.event; 
         
			if(myEvent.stopPropagation)
				myEvent.stopPropagation(); 
		});
	  
	}
	
	google.maps.event.addListener(self.gpolyline, 'mouseover', function(event)
		{	
			if (self.options.click)
				self.selected(true);
				
		});
	
	google.maps.event.addListener(self.gpolyline, 'mouseout', function(event)
		{
			if (self.options.click)
				self.selected(false);
				
		});
	
	return this.gpolyline;
} 

Polyline.prototype.selected = function(bool)
{
	var weight = this.gpolyline.strokeWeight;
	if(bool)
		this.gpolyline.setOptions({strokeWeight: weight+4});
	else
		this.gpolyline.setOptions({strokeWeight: weight-4});
}

Polyline.posToGPoint = function(pos)
{
	return new google.maps.LatLng(pos.latitude, pos.longitude);
}

Polyline.prototype.setMap = function(map)
{
	if(!this.gpolyline) this.gpolyline = this.to_gpolyline();
	this.map = map && map.gmap;
	this.gpolyline.setMap(this.map);
} 

Polyline.prototype.to_json = function()
{
	this.zip();
	return{
		color: this.color
		, points: this.points
		,weight: this.weight
	};
}

Polyline.prototype.zip = function()
{	
	var tolerance = this.getTolerance();
	var dpr = new Dpr(this.points,tolerance);
	this.points = dpr.get();	
}

Polyline.prototype.getTolerance = function()
{
	
	switch(this.zoom)
	{
		case 21:
			return 0.000001;
		case 20:
			return 0.000003; //testeado
		case 19:
			return 0.000007; //testeado
		case 18:
			return 0.00001; //testeado
		case 17:
			return 0.00005;	//testeado
		case 16:
			return 0.00005;	//testeado
		case 15:
			return 0.0001; //testeado
		case 14:
			return 0.0002; //testeado
		case 13:
			return 0.0007; //testeado
		case 12:
			return 0.001; //testeado	
		case 11:
			return 0.003; //testeado
		case 10:
			return 0.002; //testeado
		case 9:
			return 0.0095; //testeado	
		case 8:
			return 0.03; //testeado
		case 7:
			return 0.04; //testeado
		case 6:
			return 0.1; //testeado
		case 5:
			return 0.3; //testeado
		case 4:
			return 0.6; //testeado
		case 3:
			return 1; //testeado
		case 2:
			return 1.5; //testeado
		case 1:
			return 3; //testeado
		case 0:
			return 5; //testeado
		default:
			return 0.0001;
	}
}

Polyline.prototype.getOverlay = function()
{
	return this.gpolyline;
}




