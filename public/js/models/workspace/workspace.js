YUI.add("showcontainertask", function(Y)
{ 
	var Lang = Y.Lang;


	function ShowContainerTask(data)
	{
		ShowContainerTask.superclass.constructor.apply(this, arguments);
	}


	ShowContainerTask.NAME = "showContainerTask";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ShowContainerTask.ATTRS =
	{
		client:
			{
			value:null
			}
		,room:
			{
			value:null	
			}
		,canvas:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(ShowContainerTask, Y.ModuleWorkspace.WorkspaceBase,
	{
		initializer: function(data)
		{
			var self = this;
			self.room = data.room;
			self.client = self.room.client;
			self.mode = 'panning';
			self.canvas = self._getCanvas();
			self.listColor = false;
			self.listSketch = false;

		this.publish("myEvent", {
		defaultFn: this._defMyEventFn,
		bubbles:false
		});
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


		switchTo : function(mode)
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
		},
		
		changeColor : function(btnColor)
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
		},
	  
		changeSketch : function(btnSketch)
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

		},

		defaultValues : function()
		{
			this.start();
			this.switchTo('panning');
			this.changeColor('btnBlue');
			this.changeSketch('btnNormal');
		},

		events : function()
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
	});

	Y.namespace("ModuleGenericContainer").ShowContainerTask = ShowContainerTask;

}, "1.0", {requires:['workspacebase']});