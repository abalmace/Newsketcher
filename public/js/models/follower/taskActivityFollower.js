YUI.add("taskactivityfollower", function(Y)
{ 
	var Lang = Y.Lang;


	function TaskActivityFollower(data)
	{
		TaskActivityFollower.superclass.constructor.apply(this, arguments);
	}


	TaskActivityFollower.NAME = "taskActivityFollower";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	TaskActivityFollower.ATTRS =
	{
		
	};

    /* MyComponent extends the Base class */
	Y.extend(TaskActivityFollower, Y.ModuleTask.TaskActivity,
	{
		initializer: function(data)
		{
			this.subTaskActivityType = Y.ModuleFollower.SubTaskActivityFollower;
			this._retrieveTaskInformation();
		},

		destructor : function()
		{
		},
	  
		_retrieveTaskInformation:function()
		{
			var self = this;
			Y.ModuleConnectionServer.getJSON('/channel/Task/'+this.guid+'/task.json',function(data)
			{
				self._addSubTasks(data.task[0]);
			});
		}
	});

	Y.namespace("ModuleFollower").TaskActivityFollower = TaskActivityFollower;

}, "1.0", {requires:['subtaskactivityfollower','taskactivity']});