YUI.add("workspacetosubtask", function(Y)
{ 
	var Lang = Y.Lang;


	function WorkspaceToSubTask(data)
	{
		WorkspaceToSubTask.superclass.constructor.apply(this, arguments);
	}


	WorkspaceToSubTask.NAME = "workspaceToSubTask";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	WorkspaceToSubTask.ATTRS =
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
	};

    /* MyComponent extends the Base class */
	Y.extend(WorkspaceToSubTask, Y.ModuleWorkspace.WorkspaceRW,
	{
		initializer: function(data)
		{
		
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

	});

	Y.namespace("ModuleWorkspace").WorkspaceToSubTask = WorkspaceToSubTask;

}, "1.0", {requires:['workspacerw']});