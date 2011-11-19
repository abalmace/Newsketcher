YUI.add("workspacerwgps", function(Y)
{ 
	var Lang = Y.Lang;


	function WorkspaceRWGPS(data)
	{
		WorkspaceRWGPS.superclass.constructor.apply(this, arguments);
	}


	WorkspaceRWGPS.NAME = "workspacerwgps";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	WorkspaceRWGPS.ATTRS =
	{
		client:
			{
			value:null
			,getter:function()
				{
				return this.client	
				}
			}
		,room:
			{
			value:null	
			,getter:function()
				{
				return this.room
				}
			}
		,gps:
			{
			value:false
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(WorkspaceRWGPS, Y.ModuleWorkspace.WorkspaceRW,
	{
		initializer: function(data)
		{
			this._addEvent();
		},

		destructor : function()
		{
			Y.one('#location').detach();
			Y.one('#location').removeClass('gpsWorking');
		},
	  
		_addEvent:function()
		{
			var self = this;
			var btnLocation = Y.one('#location');
			btnLocation.on('click',function(e)
			{
				self._handleClick(btnLocation);
				e.stopPropagation();
			});
		}
		
		,_handleClick:function(btn)
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

	Y.namespace("ModuleWorkOut").WorkspaceRWGPS = WorkspaceRWGPS;

}, "1.0", {requires:['workspacerw']});