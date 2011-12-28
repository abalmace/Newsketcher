YUI.add("taskactivityleader", function(Y)
{ 
	var Lang = Y.Lang;


	function TaskActivityLeader(data)
	{
		TaskActivityLeader.superclass.constructor.apply(this, arguments);
	}


	TaskActivityLeader.NAME = "taskActivityLeader";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	TaskActivityLeader.ATTRS =
	{
	};

    /* MyComponent extends the Base class */
	Y.extend(TaskActivityLeader, Y.ModuleTask.TaskActivity,
	{
		initializer: function(data)
		{
			this.subTaskActivityType = Y.ModuleLeader.SubTaskActivityLeader;
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

	Y.namespace("ModuleLeader").TaskActivityLeader = TaskActivityLeader;

}, "1.0", {requires:['taskactivity','subtaskactivityleader']});