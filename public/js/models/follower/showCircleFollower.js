YUI.add("showcirclefollower", function(Y)
{ 
	var Lang = Y.Lang;


	function ShowCircleFollower(data)
	{
		ShowCircleFollower.superclass.constructor.apply(this, arguments);
	}


	ShowCircleFollower.NAME = "showCircleFollower";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ShowCircleFollower.ATTRS =
	{
	
	};

    /* MyComponent extends the Base class */
	Y.extend(ShowCircleFollower, Y.ModuleCircle.ShowCircle,
	{
		initializer: function(data)
		{
			this.taskActivityType = Y.ModuleFollower.TaskActivityFollower;
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

	Y.namespace("ModuleFollower").ShowCircleFollower = ShowCircleFollower;

}, "1.0", {requires:['showcircle','taskactivityfollower']});