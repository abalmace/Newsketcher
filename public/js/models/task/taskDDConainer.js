YUI.add("taskddcontainer", function(Y)
{ 
	var Lang = Y.Lang;


	function TaskDDContainer(data)
	{
	TaskDDContainer.superclass.constructor.apply(this, arguments);
	}


	TaskDDContainer.NAME = "containerSelectorTask";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	TaskDDContainer.ATTRS =
	{
		client:
			{
			value:null
			}
		,subscriptions:
			{
			value:[]
			}
		,callback:
			{
			value:[]
			}
		,prefixIdTask:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(TaskDDContainer, Y.ModuleGeneric.AnimationContainer,
	{
		initializer: function(data)
		{
			this.client = data.client;
			this.callback = data.callback; 
			this.subscriptions = [];
			this.prefixIdSubTask = 'subTask_';
			
			//this._addSubscriptions();
			
		},

		destructor : function()
		{
			Y.Array.each(this.subscriptions, function(s)
			{
				s.stop();
			});
		},

		/* MyComponent specific methods */

		reload : function(tasks)
		{
			var self = this;
			self.removeAll();
			if(tasks)
			{
				Y.Array.each(tasks, function(task) {
						self.addTask(task);
				  });
			}
			//retrieve all tasks
			else
			{
				// Download Tasks
				Y.ModuleConnectionServer.getJSON('/room/Task/tasks.json', function(data)
				{
					Y.Array.each(data.tasks, function(task)
					{
						self.addTask(task);
					})
				})
			}
		},
	
		addTask : function(data)
		{
			
			data.client = this.client;
			if(this.callback)
				data.clicked = this.callback.click;
			var dom = this.addElement(data,Y.ModuleSelectedTask.SelectedTask,false)
			
			if(this.callback && this.callback.update)
				this.callback.update();
		},
	  
		getTask : function(guid)
		{
			var task = this.getElement(guid);
			
			return task;
		},

		_addSubscriptions : function()
		{
			var self = this;
			//suscribirse a la edicion de Tasks
			self.subscriptions.push(self.client.subscribe(self._subscribePath(), function(task) {
				if (task.status == 'add')
					self.addTask(task);
				else if (circle.status == 'delete')
					self.removeTask(task);

			}));
		},

		_subscribePath : function(e)
		{
			return '/channel/circles/circle';
		}
	});

	Y.namespace("ModuleTask").TaskDDContainer = TaskDDContainer;

}, "1.0", {requires:['base','selectedtask','connectionserver','taskddui','animationcontainer']});