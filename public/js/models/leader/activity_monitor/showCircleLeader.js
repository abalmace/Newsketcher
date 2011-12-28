YUI.add("showcircleleader", function(Y)
{ 
	var Lang = Y.Lang;


	function ShowCircleLeader(data)
	{
		ShowCircleLeader.superclass.constructor.apply(this, arguments);
	}


	ShowCircleLeader.NAME = "showCircleLeader";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ShowCircleLeader.ATTRS =
	{
	
	};

    /* MyComponent extends the Base class */
	Y.extend(ShowCircleLeader, Y.ModuleCircle.ShowCircle,
	{
		initializer: function(data)
		{
			this.taskActivityType = Y.ModuleLeader.TaskActivityLeader;
			this._addTasks();
		},

		destructor : function()
		{
		},

		_addTasks : function()
		{
			
		//Tasks
			var self = this;
			Y.Array.each(this.tasks, function(task)
			{
				self._addMyTask(task);
			});	
		}
	});

	Y.namespace("ModuleLeader").ShowCircleLeader = ShowCircleLeader;

}, "1.0", {requires:['showcircle','taskactivityleader']});