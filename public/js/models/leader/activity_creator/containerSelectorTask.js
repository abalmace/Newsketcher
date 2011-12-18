YUI.add("containerselectortask", function(Y)
{ 
	var Lang = Y.Lang;


	function ContainerSelectorTask(data)
	{
	ContainerSelectorTask.superclass.constructor.apply(this, arguments);
	}


	ContainerSelectorTask.NAME = "containerSelectorTask";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ContainerSelectorTask.ATTRS =
	{
		client:
			{
			value:null
			}
		,allTasks:
			{
			value:[]	
			}
		,container:
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
			value:[]
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(ContainerSelectorTask, Y.Base,
	{
		initializer: function(data)
		{
			this.client = data.client;
			this.allTasks = [];
			this.container = data.container;
			this.callback = data.callback; 
			this.subscriptions = [];
			this.prefixIdTask = 'circle_';
			
			this._addSubscriptions();
			
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

		/* MyComponent specific methods */

		reload : function(tasks)
		{
			var self = this;
			$(this.container).empty();
			this.allTasks = [];
			if(tasks)
			{
				_.each(tasks, function(task) {
						self.addTask(task);
				  });
			}
			//retrieve all tasks
			else
			{
				// Download Tasks
				Y.ModuleConnectionServer.getJSON('/room/Task/tasks.json', function(data) {
					_.each(data.tasks, function(task) {
						self.addTask(task);
					});
				})
			}
		},
	
		addTask : function(data)
		{
			var div = document.createElement('div');
			var guid = data.guid || Utils.guid()
			div.className = "selectorTask gButton";
			div.id = guid;	
			data.client = this.client;
			
			data.dom = div;
			data.guid = guid;
			if(this.callback)
				data.clicked = this.callback.click;
			
			var selectedTask = new Y.ModuleSelectedTask.SelectedTask(data);
			this.allTasks.push(selectedTask);
			this.container.appendChild(div);
			
			if(this.callback && this.callback.update)
				this.callback.update();
		},
	  
		getTask : function(guid)
		{
			var self = this;
			var task = _.detect(self.allTasks, function(s) { return s.guid == guid });
			
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

	Y.namespace("ModuleContainerSelectorTask").ContainerSelectorTask = ContainerSelectorTask;

}, "1.0", {requires:['base','selectedtask','connectionserver']});