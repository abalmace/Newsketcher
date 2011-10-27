YUI.add("subtaskcontainer", function(Y)
{ 
	var Lang = Y.Lang;


	function SubTaskContainer(data)
	{
		SubTaskContainer.superclass.constructor.apply(this, arguments);
	}


	SubTaskContainer.NAME = "subTaskContainer";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	SubTaskContainer.ATTRS =
	{
		allCircles:
			{
			value:[]	
			}
		,container:
			{
			value:null
			}
		,taskInfo:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(SubTaskContainer, Y.ModuleGenericContainer.GenericContainer,
	{
		initializer: function(data)
		{
			this.container = document.getElementById(data.container || 'unknow');
			this.allCircles = [];
			this.prefixIdTask = 'task_';
			
			//this._addEventClick();
			this._retrieveTaskInfo(data.guid);

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

		_subscribePath : function()
		{
			return '/channel/'+this.guid.+'/subTask';
		},

		_handleClick : function(e)
		{
			
		},
	  
		__retrieveTaskInfo : function(guid)
		{
			
		// Download previos Tasks
			var self = this;
			Y.ModuleConnectionServer.getJSON('/channel/Task/'+guid +'/task.json',function(data)
			{
				self._getInfo(data.task[0]);
			})	
		},
	  
		_getInfo : function(task)
		{
			var data;
			this.taskType = task.type;
			if(this.taskType == 'free' || true)
			{
				data =
				{
				textElement:'free'
				,guid : task.guid
				}
				this._addMySubTask(data);
			}
			else if(this.taskType = 'list')
			{
				
			}
			else if(this.tasktype = 'orderList')
			{
				
			}
			this.subTasks = task.subTask;
		},
		
		_addMySubTask : function(subTask)
		{
			this._addElement(subTask);
		}
	});

	Y.namespace("ModuleSubTask").SubTaskContainer = SubTaskContainer;

}, "1.0", {requires:['base','genericcontainer','connectionserver']});