YUI.add("canvas", function(Y)
{ 
	var Lang = Y.Lang;


	function Canvas(data)
	{
		Canvas.superclass.constructor.apply(this, arguments);
	}


	Canvas.NAME = "canvas";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	Canvas.ATTRS =
	{
		workspace:
			{
			value:null
			}
		,dom:
			{
			value:null	
			}
		,colorPolyline:
			{
			value:null
			}
		,weightPolyline:
			{
			value:null
			}
		,element:
			{
			value:null
			}
		,points:
			{
			value:null	
			}
		,click:
			{
			value:null	
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(Canvas, Y.Base,
	{
		initializer: function(data)
		{
			var self = this;
			self.workspace = data.workspace;
			self.drawing = false;
			self.dom = $('#layer');
			self.colorPolyline = "#0000FF";
			self.weightPolyline = 5;
			self.element= document.querySelector('#layer');
			self.points = [];
			self.click = false	
		},

		destructor : function()
		{
		/*
		* destructor is part of the lifecycle introduced by 
		* the Base class. It is invoked when destroy() is called,
		* and can be used to cleanup instance specific state.
		*
		* It does not need to invoke the superclass destructor. 
		* destroy() will call initializer() for all classes in the hierarchy.
		*/
		},

		/* MyComponent specific methods */

		addEvents : function()
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
		},
			
		/*
		* Eliminar los eventos del div "layer"
		*/
			
		removeEvents : function()
		{
			var self = this;	
			self.dom.unbind('mousedown');
			self.dom.unbind('touchstart');
			self.dom.unbind('mousemove');
			self.dom.unbind('touchmove');
			self.dom.unbind('mouseup');
			self.dom.unbind('touchend');
			self.dom.unbind('click')	
		},
			
		start : function()
		{
			this.addEvents()
		},
			
		stop : function()
		{
			this.removeEvents()
		},
			
		/*
		Se llama esta función cuando se comienza a dibujar una polyline.
			-Crea o utiliza si ya existe en sketch para trabajar con la polyline
			- Crea una nueva polyline con las opciones adecuadas ( color, grosor, zoom)
			- asigna la polyline en creación al mapa que actualmente se esta utilizando.
		*/	
		onDrawStart : function(event)
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
		},
	  
		onDrawEnd : function(event)
		{
			var self = this;
			
			self.drawing = false;
			
			//verificar si hicieron click o drag and drop. Verifico viendo si existe algún punto en el arreglo
			if(self.points.length > 0)
			{
				self.sketch.addPolyline(self.polyline);			
				self.workspace.saveOverlay(self.sketch);
			}
			self.polyline.setMap(null);
			self.sketch = null
		},
	  
		onDraw : function(event)
		{
			if (!this.drawing) return null;
			var pos = this.getPosition(event);
			if(pos == null) return;
			this.points.push(new Point(pos.X, pos.Y));
			var position = this.workspace.map.getXYPosition(pos.X, pos.Y);
			this.polyline.addPoint(position);
			this.poly.push(position)
		},

		switchColor : function (value)
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
		},

		switchWeight : function(value)
		{
			this.weightPolyline = value
		},

		addMarker : function(event)
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
		},

		getPosition : function(event)
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
	});

	Y.namespace("ModuleMap").Canvas = Canvas;

}, "1.0", {requires:['base']});