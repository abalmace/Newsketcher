function InfoWindow(data, options)
{
	this.init();
	if(data)
	{	
		this.body = data.body;
		this.setBody(data.body);
		this.title = data.title;
		this.setTitle(data.title);
	}
	else
	{
		this.title = "";
		this.body = "";
	}
	this.options = options || {}
}

InfoWindow.prototype.init = function()
{
	this.createForm();
	this.CreateInfoWindow()
}

InfoWindow.prototype.CreateInfoWindow = function()
{
		
	this.infowindow = new InfoBubble({ 
		content: this.form.get()[0], 
		//position: new google.maps.LatLng(-35, 151), 
		shadowStyle: 1, 
		padding: 0, 
		backgroundColor: '#ffffff', 
		borderRadius: 4, 
		arrowSize: 20, 
		borderWidth: 1, 
		borderColor: '#2c2c2c', 
		disableAutoPan: false, 
		hideCloseButton: false, 
		arrowPosition: 30, 
		backgroundClassName: 'phoney', 
		arrowStyle: 2 
	}); 
	
	this.infowindow = new google.maps.InfoWindow({content: this.form.get()[0]});	
} 

InfoWindow.prototype.to_json = function()
{
	return { 
		title : this.title
		,body : this.body
	}
}

InfoWindow.prototype.open = function(gmap, goverlay)
{
	this.addEvents();
	this.infowindow.open(gmap,goverlay);
	this.overlay= goverlay
}
InfoWindow.prototype.position = function(latLng)
{
	this.infowindow.position = latLng
}

InfoWindow.prototype.submitFunction = function()
{
	this.title = this.getTitle();
	this.body = this.getBody();
	this.infowindow.close();
	if(this.options.update)
		this.options.update()
}

InfoWindow.prototype.deleteFunction = function()
{
	this.infowindow.close();
	if(this.options.deleteOverlay)
		this.options.deleteOverlay()
}

InfoWindow.prototype.cancelFunction = function()
{
	this.setTitle(this.title);
	this.setBody(this.body);
	this.infowindow.close()
	
}

InfoWindow.prototype.getTitle = function()
{
		return this.form.attr("title").value
}

InfoWindow.prototype.setTitle = function(value)
{
	this.form.attr("title").value = value
}

InfoWindow.prototype.getBody = function()
{
	return this.form.attr("textArea").value
}

InfoWindow.prototype.setBody =function(value)
{
	this.form.attr("textArea").value = value
}

InfoWindow.prototype.addEvents = function()
{
	var self = this
	self.ok.bind('click',function(event)
	{
	    self.submitFunction();
		self.removeEvents();
	});
	
	self.cancel.bind('click',function(event)
	{
	    self.cancelFunction();
		self.removeEvents();
	});
	 
	self.deleteElement.bind('click',function(event)
	{
	    self.deleteFunction();
	})
}

InfoWindow.prototype.removeEvents = function()
{
	var self= this;
	self.ok.unbind('click');
	self.cancel.unbind('click');
	self.deleteElement.unbind('click')

}

InfoWindow.prototype.createForm = function(marker)
{

	var htmlElement = 
	'<form >'+
	'<div class="msedit">'+
		'<table class="iwspan">'+
			'<tbody>'+
				'<tr>'+
					'<td>'+
						'<table class="inputField">'+
							'<tbody>'+
								'<tr>'+
									'<td class="label">Title</td>'+
									'<td><input type="text" maxlength="250" class="title mshint" dir="ltr" name = "title"></td>'+
									'<td class="stylecol">'+
										'<div id="msiwsi" class="icon" title="">'+
											'<img style="width: 32px; height: 32px; -webkit-user-select: none; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-style: initial; border-color: initial; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; " src="http://maps.gstatic.com/intl/en_ALL/mapfiles/ms/micons/ltblue-dot.png">'+
										'</div>'+
									'</td>'+
								'</tr>'+
							'</tbody>'+
						'</table>'+
						'<div class = "label">Description</div>'+
					'</td>'+
				'</tr>'+
			'</tbody>'+
		'</table>'+
		'<div>'+
			'<div id="rtfield" class="textField description" style="display: none; "></div>'+
			'<textarea class="textField description" dir="ltr" name = "textArea"></textarea>'+
			'<div style="font-size: 1%; width: 264px; height: 1px; "></div>'+
		'</div>'+
		'<div class="msiwpd" style=""></div>'+
		'<a href="javascript:void(0)" class="msiwpdhidden" style="display: none; ">Show driving directions</a>'+
		'<div class="mstotaldistance mstotaldistancebot" style="display: none; "></div>'+
		'<div style="display: none; ">'+
			'<table width="100%">'+
				'<tbody>'+
					'<tr>'+
						'<td>'+
							'<span class="msiwddetitle">Driving Directions</span>'+
						'</td>'+
						'<td class="msiwpdecol">'+
							'<a href="javascript:void(0)" class="msiwpdeedit">Hide</a>'+
						'</td>'+
					'</tr>'+
				'</tbody>'+
			'</table>'+
			'<div class="msiwddecontain msiwddesuccess"></div>'+
		'</div>'+
		'<table>'+
			'<tbody>'+
				'<tr>'+
					'<td class="navLeft">'+
						'<input type="button" name = "delete" value="Delete"/>'+
					'</td>'+
					'<td class="navRight">'+
						'<input type="button" name = "cancel" value="Cancel"/>'+
					'</td>'+
					'<td class="navRight">'+
						'<input type="button" name = "ok" value="Ok"/>'+
					'</td>'+
				'</tr>'+
			'</tbody>'+
		'</table>'+
	'</div>'+
	'</form>';
	
	this.form =$(htmlElement);
	this.ok =jQuery(this.form.attr("ok"));
	this.cancel = jQuery(this.form.attr("cancel"));
	this.deleteElement = jQuery(this.form.attr("delete"));
	
	//para evitar hacer click atras del infoWindow
	this.form.click(function(event)
	{
		event.stopPropagation();
	})
}
