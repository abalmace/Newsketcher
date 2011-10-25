YUI.add("showcontainercircle", function(Y)
{ 
	var Lang = Y.Lang;


	function ShowContainerCircle(data)
	{
		ShowContainerCircle.superclass.constructor.apply(this, arguments);
	}


	ShowContainerCircle.NAME = "showContainerCircle";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ShowContainerCircle.ATTRS =
	{
		allCircles:
			{
			value:[]	
			}
		,container:
			{
			value:null
			}
		,subcriptions:
			{
			value:[]
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(ShowContainerCircle, Y.ModuleGenericContainer.GenericContainer,
	{
		initializer: function(data)
		{
			this.container = document.getElementById(data.container || 'unknow');
			this.subscriptions = [];
			this.allCircles = [];
			this.prefixIdTask = 'task_';
			
			//this._addEventClick();
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

		_subscribePath : function(zone)
		{
			return '/channel/show/Task';
		},

		_handleClick : function(e)
		{
			
		},
	  
		_addSubscriptions : function()
		{
			var self = this;
		//suscribirse a la edicion de Tasks
			self.subscriptions.push(self.client.subscribe(self._subscribePath(), function(task) {
				if (task.status == 'join')
					self.addMyTask(task);
				else if (data.status == 'delete')
					self.removeTask(data);

			}));
			
		// Download previos Tasks
			Y.ModuleConnectionServer.getJSON('/channel/Circle/'+this.client.guid +'/circles.json',function(data)
			{
				Y.Array.each(data.circles, function(circle)
				{
					self._addMyCircle(circle);
				});
			})	
		},
	  
		_addEventClick : function()
		{
			Y.one(this.container).delegate('click', this._handleClick, 'div');
		},
		
		/*
		Eliminar una task
		*/
		_removeTask : function()
		{
			var data = 
				{
				id:this.guid
				,status:'remove'
				}
				
			this.client.sendSignal(data);
		},
	  
		_addMyCircle : function(circle)
		{
			circle.textElement = circle.name;
			circle.name = null;
			this._addElement(circle,Y.ModuleCircle.ShowCircle);
		},
	  
		_findTasksInCircle : function(circle)
		{
			var self = this;
			var tasks = circle.tasks;
			var people = circle.people;
			
			Y.Array.each(tasks, function(task)
			{
				self._addMyTask(task);
			});
			
		},

		_joinTask : function(data)
		{
			var li = document.createElement('li');
			var id = data.id || Utils.guid()
			li.className = "item";
			li.id = id;	
			data.client = this.client;
			
			data.li = li;
			data.id = id;
			
			var mod = new ModuleTask(data);
			this.allModules.push(mod);
			this.container.appendChild(li);
			/*
			Para que el nuevo elemento agregado sea un Target tambien
			*/
			this.del.syncTargets();
		}
	});

	Y.namespace("ModuleContainerCircle").ShowContainerCircle = ShowContainerCircle;

}, "1.0", {requires:['base','node-event-delegate','node','connectionserver','genericcontainer','showcircle']});