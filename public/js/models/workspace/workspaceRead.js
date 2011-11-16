YUI.add("workspaceread", function(Y)
{ 
	var Lang = Y.Lang;


	function WorkspaceRead(data)
	{
		WorkspaceRead.superclass.constructor.apply(this, arguments);
	}


	WorkspaceRead.NAME = "workspaceRead";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	WorkspaceRead.ATTRS =
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
	Y.extend(WorkspaceRead, Y.ModuleWorkspace.WorkspaceBase,
	{
		initializer: function(data)
		{
			var self = this;
			self.mode = 'panning';
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
	  
		defaultValues : function()
		{
			this.start();
		}
	});

	Y.namespace("ModuleWorkspace").WorkspaceRead = WorkspaceRead;

}, "1.0", {requires:['workspacebase','base']});