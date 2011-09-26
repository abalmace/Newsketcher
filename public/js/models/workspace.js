function Workspace(room)
{
	var self = this;
	self.room = room;
	self.client = self.room.client;
	self.mode = 'panning';
	self.canvas = new Canvas(self);
	self.listColor = false;
	self.listSketch = false;
}

Workspace.prototype.start = function()
{
	var self = this;

	self.map = new Map({
		dom: self.client.getWorkspaceMapDom()
		, controllable: true 
		, position: self.room.currentPosition
		, showCredits: true
	});

	self.map.onMove(function(position) {
		self.room.moveTo(position, 
			{ userMove: self.map.userMove
		});
	});

	self.events();
	
	_.each(self.room.overlays, function(overlay) {
		self.addOverlay(overlay);
	});
}

Workspace.prototype.addOverlay = function(overlay)
{
	var self = this;
	overlay.drawAt(self.map,
		{ click: { 	update : function(overlay)
						{
							self.room.updateOverlay(overlay);
						}
				,destroy: function(overlay)
							{
								self.room.destroy(overlay);
							}
				}
		,drag: function()
			{
				self.canvas.drawing = false; // informar al canvas que no dibuje una polilinea
				self.canvas.points = []; //informar al canvas que no tiene una polilinea
				self.canvas.dragMarker = true; //informar al canvas que estoy haciendo un drag de un marker 
			}
		});
}

Workspace.prototype.moveTo = function(pos)
{
	var self = this;
	self.map.moveTo(pos);
}

Workspace.prototype.getCenter = function()
{
	var self = this;
	return self.map.getCenter();
}

Workspace.prototype.stop = function()
{
	//var self = this;
	self.map = null;
	$('#toggleModeButton').unbind('click');
}

Workspace.prototype.switchTo= function(mode)
{
	var self = this;
	self.mode = mode;

	switch(self.mode) {
		case 'panning':
			self.map.unlock();
			self.canvas.stop();
			self.listColor = false;
			self.listSketch = false;
			document.getElementById('toolbar_centerUp').style.display = "none";
			document.getElementById('toggleModeButton').style.background = "transparent url('./css/images/btnDrawing.png') no-repeat";
			break;
		case 'drawing':
			self.map.lock();
			self.canvas.start();
			document.getElementById('toolbar_centerUp').style.display = "";
			document.getElementById('toggleModeButton').style.background = "transparent url('./css/images/btnPanning.png') no-repeat";
			break;
	}
}

Workspace.prototype.saveOverlay = function(overlay)
{
	this.room.saveOverlay(overlay);
}
Workspace.prototype.changeColor = function(btnColor)
{
	var self = this;
	var color = '0';
	if(btnColor == 'btnGreen')
	{
		color = '3';
		document.getElementById('btnColor').style.background="transparent url('./css/images/btnGreen.png') no-repeat";
	}
	else if(btnColor == 'btnRed')
	{
		color = '1';
		document.getElementById('btnColor').style.background="transparent url('./css/images/btnRed.png') no-repeat";
	}
	else
	{
		color = '2';
		document.getElementById('btnColor').style.background="transparent url('./css/images/btnBlue.png') no-repeat";
	}
	
	self.canvas.switchColor(color);
}
Workspace.prototype.changeSketch =function(btnSketch)
{
	var self = this;
	var weight = 5;
	if(btnSketch == 'btnSlim')
	{
		weight = 2;
		document.getElementById('btnSketch').style.background="transparent url('./css/images/btnSlim.png') no-repeat";
	}
	else if(btnSketch == 'btnNormal')
	{
		weight = 5;
		document.getElementById('btnSketch').style.background="transparent url('./css/images/btnNormal.png') no-repeat";
	}
	else
	{
		weight = 10;
		document.getElementById('btnSketch').style.background="transparent url('./css/images/btnFat.png') no-repeat";
	}
	self.canvas.switchWeight(weight);

}

Workspace.prototype.defaultValues = function()
{
	this.start();
	this.switchTo('panning');
	this.changeColor('btnBlue');
	this.changeSketch('btnNormal');
}

Workspace.prototype.events = function()
{
	var self = this;
	
	$('#toggleModeButton').click(function()
	{
		if (self.mode == 'panning')
			self.switchTo('drawing')
		else 
			self.switchTo('panning')

		return false;
	});
	$('#listColor li').click(function(e)
	{
		self.changeColor(e.target.id);
		self.listColor = false;
		document.getElementById('listColor').style.display="none";
		return false;
	});
	$('#listSketch li').click(function(e)
	{
		self.changeSketch(e.target.id);
		self.listSketch = false;
		document.getElementById('listSketch').style.display="none";
		return false;
	});
	$('#btnColor').click(function()
	{
		document.getElementById('listSketch').style.display="none";
		self.listSketch = false;
		if(self.listColor)
			document.getElementById('listColor').style.display="none";
		else
			document.getElementById('listColor').style.display="";
		self.listColor = !self.listColor;
		return false;
	});
	
	$('#btnSketch').click(function()
	{
		document.getElementById('listColor').style.display="none";
		self.listColor = false;
		if(self.listSketch)
			document.getElementById('listSketch').style.display="none";
		else
			document.getElementById('listSketch').style.display="";
		self.listSketch = !self.listSketch;
		return false;
	});
}
