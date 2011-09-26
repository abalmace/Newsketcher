function GoogleMapWizard(options)
{	
	var self = this;
	this.baseUrl = "http://maps.google.com/maps/api/staticmap?";

	self.mapWidth="300";		//ancho del mapa
	self.mapHeight="100";		//altura del mapa
	self.markerSize = "size:small"; // size: +(normal - mid - small - tiny)
	self.markerColor = "";		//color por defecto del marcador
	self.markerLetter = "";		
	self.storeAdresses = false;

	self.center = options.center || {latitude:37.400470,longitude:-122.072981};
	
	self.epsilonZoom = 3; 		//el numero de zoom diferente entre el map real y la foto
	self.setZoom(options.zoom || 13);
	self.colorPoly ="0000FF";	//blue
	self.alphaPoly ="ff"; 		//100%
	self.weightPoly ="1";		//standard 

	self.overlays = [];
	self.overlays.polys = options.polys || [];
	self.overlays.markers = options.markers || [];
	
	
}

GoogleMapWizard.prototype.getImage = function() 
{
	var self = this;
	var baseUrl = "http://maps.google.com/maps/api/staticmap?";

	var params = [];

	params.push("center=" + self.center.latitude + "," + self.center.longitude);
	params.push("zoom=" + self.zoom);


	//Dibujar marcadores
	var markerParams = [];
	var markersArray = [];
	if (self.markerSize != "") markerParams.push(self.markerSize);
	if (self.markerColor != "") markerParams.push(self.markerColor);
	if (self.markerLetter != "") markerParams.push(self.markerLetter);
	for (var i = 0; i < self.overlays.markers.length; i++)
	{
		var marker = self.overlays.markers[i].point;
		if (self.storeAdresses)
			markersArray.push(maker.getTitle().replace(" ", "+", "g"));
		else
			markersArray.push(marker.latitude + "," + marker.longitude);
	}
	if (markersArray.length)
	{
		var markersString = markerParams.join("|");
		if (markerParams.length)
			markersString += "|";
		markersString += markersArray.join("|");
		params.push("markers=" + markersString);
	}

	//Dibujar polilineas
	for (var i = 0; i < self.overlays.polys.length; i++)
	{
		var poly = self.overlays.polys[i].points;
		var color;
		if(self.overlays.polys[i].color)
			color = self.overlays.polys[i].color.substring(1);
		else
			color = self.colorPoly;
		
		poly = this.zip(poly);
		var polyLatLngs = [];
		for (var j = 0; j < poly.length; j++)
		{
			var point = poly[j];
			polyLatLngs.push(point.latitude + "," + point.longitude);
		}
		//propiedades de la polilinea
		var polyColor = "color:0x" + color + self.alphaPoly;
		var polyWeight = "weight:" + self.weightPoly;
		var polyParams = polyColor + "|" + polyWeight;
		
		params.push("path=" + polyParams + "|" + polyLatLngs.join("|"));
	}
	if(self.maptype)
		params.push("maptype="+self.mapType);
	params.push("size=" + self.mapWidth + "x" + self.mapHeight);

	self.URL = baseUrl + params.join("&") + "&sensor=false";
	return "http://neic.usgs.gov/neis/maps/mx-map.gif";
	//return self.URL;
}
 
GoogleMapWizard.prototype.addPolyline = function(polyline,color,id)
{
	var clone = JSON.parse(JSON.stringify(polyline));
	clone = this.roundPolyline(clone);
	var poly =	{
			points:clone
			,color: color
			,id:id
			};
	this.overlays.polys.push(poly);
}

GoogleMapWizard.prototype.addMarker = function(marker,color,id)
{
	var clone = JSON.parse(JSON.stringify(marker));
	clone = this.roundPosition(clone);
	var markerAux =	{
			point:clone
			,color:color
			,id:id
			};
	this.overlays.markers.push(markerAux);
} 

GoogleMapWizard.prototype.setCenter = function(position)
{
	
	this.center = {longitude:position.longitude
			,latitude:position.latitude};
	this.center = this.roundPosition(this.center);
}

GoogleMapWizard.prototype.setZoom = function(zoom)
{
	var aux = zoom -this.epsilonZoom
	this.zoom = (aux >=0 )?aux:0;
}


GoogleMapWizard.prototype.zip = function (polyline) {
	
	var tolerance = this.getTolerance();
	var dpr = new Dpr(polyline,tolerance);
	return  dpr.get();
	
	
}
GoogleMapWizard.prototype.roundPolyline = function(polyline)
{
	for (var i = 0; i < polyline.length; i++)
	{
		polyline[i] = this.roundPosition(polyline[i]);
	}
	
	return polyline;
}
GoogleMapWizard.prototype.roundPosition = function(position)
{
	var nPrecision = this.getPrecision();
	position.latitude = this.roundNumber(position.latitude, nPrecision);
	position.longitude = this.roundNumber(position.longitude, nPrecision);
	
	return position;
}
GoogleMapWizard.prototype.roundNumber = function(num, dec) 
{
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

GoogleMapWizard.prototype.getTolerance = function()
{
	
	switch (this.zoom)
	{
		case 21:
			return 0.002;
		case 20:
			return 0.002; 
		case 19:
			return 0.002; 
		case 18:
			return 0.002; 
		case 17:
			return 0.002;	
		case 16:
			return 0.002;	
		case 15:
			return 0.002; 
		case 14:
			return 0.002; 
		case 13:
			return 0.002; 		//testeado
		case 12:
			return 0.001; 	
		case 11:
			return 0.003; 
		case 10:
			return 0.002; 
		case 9:
			return 0.0095; 	
		case 8:
			return 0.03; 
		case 7:
			return 0.04; 
		case 6:
			return 0.1; 
		case 5:
			return 0.3; 
		case 4:
			return 0.6; 
		case 3:
			return 1; 
		case 2:
			return 5; 
		case 1:
			return 3; 
		case 0:
			return 5; 
		default:
			return 0.0001;
	}
}

GoogleMapWizard.prototype.getPrecision = function()
{
	
	if(this.zoom >= 15)
		return 4;
	if(this.zoom >=10)
		return 3;
	if(this.zoom >= 5)
		return 1;
	else 
		return 0;	
	
}

GoogleMapWizard.prototype.removeOverlay = function(id)
{
	for ( value in this.overlays)
	{
		var overlay = _.detect(this.overlays[value], function(s) { return s.id == id });
		if (overlay)
		{
			this.overlays[value] = _.without(this.overlays[value], overlay);
			return;
		}
	}
	
}
