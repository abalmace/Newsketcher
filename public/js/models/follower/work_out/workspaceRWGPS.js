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

		},

		destructor : function()
		{
			
		}

	});

	Y.namespace("ModuleWorkOut").WorkspaceRWGPS = WorkspaceRWGPS;

}, "1.0", {requires:['workspacerw']});