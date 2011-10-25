YUI.add("showcontainertask", function(Y)
{ 
	var Lang = Y.Lang;


	function ShowContainerTask(data)
	{
	ShowContainerTask.superclass.constructor.apply(this, arguments);
	}


	ShowContainerTask.NAME = "showContainerTask";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ShowContainerTask.ATTRS =
	{
		client:
			{
			value:null
			}
		,allModules:
			{
			value:null	
			}
		,container:
			{
			value:null
			}
		,subcriptions:
			{
			value:null
			}
		,prefixIdTask:
			{
			value:null
			}
		,del:
			{
			value:null	
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(ShowContainerTask, Y.ModuleContainerTask.ContainerTask,
	{
		initializer: function(data)
		{
			this.client = data.client;
			this.allModules = [];
			this.container = document.getElementById(data.container || 'list1');
			this.subscriptions = [];
			this.prefixIdTask = 'task_';
			this.init();

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

		init : function()
		{
		},

		_subscribePath : function(zone)
		{
		
		},

		_createContainer : function()
		{
			
		},
	  
		_addEventClick : function()
		{
			
		},
		
		/*
		Eliminar una task
		*/
		_removeTask : function()
		{
			
		},

		_joinTask : function(data)
		{
			
		}
	});

	Y.namespace("ModuleContainerTask").ShowContainerTask = ContainerTask;

}, "1.0", {requires:['base','containertask']});