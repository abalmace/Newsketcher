/*
	Al parecer se encarga de todas las acciones que se realizan sobre el mapa ( eventos) para separar la lógica.
*/
function Canvas(workspace)
{
	var self = this;
	self.workspace = workspace;
	self.drawing = false;
	self.dom = $('<div id="canvas"></div>');
	self.dom = $('#layer');
	self.colorPolyline = "#0000FF";
	self.weightPolyline = 5;
	self.element= document.querySelector('#layer');
	self.points = [];
	self.screenshotCreator = new GoogleMapWizard("hello");
	self.click = false	  
}
	/*
	 * Dar eventos al div "layer" para que realize acciones 
	 */
Canvas.prototype.addEvents = function()
{
	var self = this;		
	self.dom.bind( 'click', function(event)
	{
		self.addMarker(event);
		event.stopPropagation();
	});

	self.dom.bind('mousedown',function(event)
	{
		self.onDrawStart(event);
	});
	self.dom.bind('touchstart',function(event)
	{
		self.onDrawStart(event);
	});
	self.dom.bind('mousemove',function(event)
	{
		self.onDraw(event);
	});
	self.dom.bind('touchmove',function(event)
	{
		self.onDraw(event);
	});
	self.dom.bind('mouseup',function(event)
	{
		self.onDrawEnd(event);
	});
	self.dom.bind('touchend',function(event)
	{
		self.onDrawEnd(event);
	})	
}
	
/*
 * Eliminar los eventos del div "layer"
 */
	
Canvas.prototype.removeEvents = function()
{
	var self = this;	
	self.dom.unbind('mousedown');
	self.dom.unbind('touchstart');
	self.dom.unbind('mousemove');
	self.dom.unbind('touchmove');
	self.dom.unbind('mouseup');
	self.dom.unbind('touchend');
	self.dom.unbind('click')	
}
	
Canvas.prototype.start = function()
{
	this.addEvents()
}
	
Canvas.prototype.stop = function()
{
	this.removeEvents()
}
	
/*
Se llama esta función cuando se comienza a dibujar una polyline.
	-Crea o utiliza si ya existe en sketch para trabajar con la polyline
	- Crea una nueva polyline con las opciones adecuadas ( color, grosor, zoom)
	- asigna la polyline en creación al mapa que actualmente se esta utilizando.
*/	
Canvas.prototype.onDrawStart = function(event)
{
	this.drawing = true;
	this.sketch = this.sketch || new Sketch();

	var polyline_thickness = this.weightPolyline;
	var polyline_color = this.colorPolyline;

	var data = {'points':[], 'color':polyline_color, 'weight':polyline_thickness, 'zoom':this.workspace.map.getZoom()}

	this.polyline = new Polyline(data,null,null);
	this.polyline.setMap(this.workspace.map);
	
	this.poly = [];		//para agragar los puntos de la polylinea y crear un screenshot
	this.points =[]	//para ver si es un gesto o no
}
Canvas.prototype.onDrawEnd = function(event)
{
	var self = this;
	
	self.drawing = false;
	
	//verificar si hicieron click o drag and drop. Verifico viendo si existe algún punto en el arreglo
	if(self.points.length > 0)
	{

		//analizar el gesto ( mínimo 10 puntos)
		if(self.points.length >=10)
		{
			var recognize = new DollarRecognizer();
			var result = recognize.Recognize(self.points, true);
			$("#textoPrueba").text("Result: " + result.Name + " (" + result.Score + ").");
		}
	
		self.sketch.addPolyline(self.polyline);
							
				
		self.workspace.saveOverlay(self.sketch);
	}
	self.polyline.setMap(null);
	self.sketch = null
}
Canvas.prototype.onDraw = function(event)
{
	if (!this.drawing) return null;
	var pos = this.getPosition(event);
	if(pos == null) return;
	this.points.push(new Point(pos.X, pos.Y));
	var position = this.workspace.map.getXYPosition(pos.X, pos.Y);
	this.polyline.addPoint(position);
	this.poly.push(position)
}

Canvas.prototype.switchColor = function (value)
{
	var self = this;
	switch (value)
	{
		case '1':
			self.colorPolyline = "#FF0000";
			break;
		case '2':
			self.colorPolyline = "#0000FF";
			break;
		case '3':
			self.colorPolyline = "#00FF00";
			break;
	}
}

Canvas.prototype.switchWeight = function(value)
{
	this.weightPolyline = value
}

Canvas.prototype.addMarker = function(event)
{
	if(this.dragMarker)
	{
		this.dragMarker = false;
		return;
	}
	var overlay = new Overlay();
	var pos = this.getPosition(event);
	if(pos == null)	return;
	var position = this.workspace.map.getXYPosition(pos.X, pos.Y);
	var data = {'position':position,'draggable':true}
	
	var marker = new Marker(data,null,null);
	overlay.addOverlay(marker);
	this.workspace.saveOverlay(overlay);
	this.screenshotCreator.addMarker(position);
}

Canvas.prototype.getPosition = function(event)
{
	event.preventDefault();
	event = event.originalEvent || event;

	// This is not a touch devise?
	if (!event.touches) event.touches = [event];
	if (event.touches.length > 1) return;

	var touch = event.touches[0];
	
	return {
		X:touch.pageX,
		Y:touch.pageY
	}
}
