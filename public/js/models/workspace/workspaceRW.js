YUI.add("workspacerw", function(Y)
{ 
	var Lang = Y.Lang;


	function WorkspaceRW(data)
	{
		WorkspaceRW.superclass.constructor.apply(this, arguments);
	}


	WorkspaceRW.NAME = "workspaceRW";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	WorkspaceRW.ATTRS =
	{
		client:
			{
			value:null
			}
		,room:
			{
			value:null	
			}	
		,listColor:
			{
			value:false
			}
		,listSketch:
			{
			value:false
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(WorkspaceRW, Y.ModuleWorkspace.WorkspaceBase,
	{
		initializer: function(data)
		{
			var self = this;
			self.room = data.room;
			self.mode = 'panning';
			self.listColor = false;
			self.listSketch = false;
			
			this._events();

		this.publish("myEvent", {
		defaultFn: this._defMyEventFn,
		bubbles:false
		});
		},

		destructor : function()
		{
			Y.one('#location').detach();
			Y.one('#location').removeClass('gpsWorking');
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
					Y.one('#toggleModeButton').removeClass('btnPanningClass');
					Y.one('#location').setStyle('visibility','visible');
					break;
				case 'drawing':
					self.map.lock();
					self.canvas.start();
					document.getElementById('toolbar_centerUp').style.display = "";
					Y.one('#toggleModeButton').addClass('btnPanningClass');
					Y.one('#location').setStyle('visibility','hidden');
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

		_events : function()
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
			
			var btnLocation = Y.one('#location');
			btnLocation.on('click',function(e)
			{
				self._handleClick(btnLocation);
				e.stopPropagation();
			});
		},
		
		_handleClick:function(btn)
		{
			if(!this.gps)
			{
				this.map.showLocation();
				this.map.centerInLocation();
				btn.addClass('gpsWorking');
			}
			else
			{
				this.map.hideLocation();
				btn.removeClass('gpsWorking');
			}
			this.gps = !this.gps;
		}
	});

	Y.namespace("ModuleWorkspace").WorkspaceRW = WorkspaceRW;

}, "1.0", {requires:['workspacebase']});