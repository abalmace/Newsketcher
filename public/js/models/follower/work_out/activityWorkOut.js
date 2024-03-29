YUI.add("activityworkout", function(Y)
{ 
	var Lang = Y.Lang;


	function ActivityWorkOut(data)
	{
		ActivityWorkOut.superclass.constructor.apply(this, arguments);
	}


	ActivityWorkOut.NAME = "activityWorkOut";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ActivityWorkOut.ATTRS =
	{
		allCircles:
			{
			value:[]	
			}
		,container:
			{
			value:null
			}
		,people:
			{
			value:null
			}
		,task_title:
			{
			value:null
			}
		
	};

    /* MyComponent extends the Base class */
	Y.extend(ActivityWorkOut, Y.ModuleGenericContainer.GenericContainer,
	{
		initializer: function(data)
		{
			this.container = document.getElementById(data.container || 'unknown');
			this.circleGuid = data.circleGuid;
			this.people = data.people;
			this.prefixIdTask = 'task_';
			this.task_title =  data.title;
			
			//this._addEventClick();
			this._retrieveTaskInfo(data.guid);
			this._addInformationUI();

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
			return '/channel/'+this.guid+'/subTask';
		},

		_handleClick : function(e)
		{
			
		},
	  
		_retrieveTaskInfo : function(guid)
		{
			
		// Download previos Tasks
			var self = this;
			Y.ModuleConnectionServer.getJSON('/channel/Task/'+guid +'/task.json',function(data)
			{
				self._getInfo(data.task[0]);
			});
		},
	  
		_getInfo : function(task)
		{
			var data;
			this.taskType = task.type;
			if(this.taskType == 'free' )
			{
				data =
				{
				textElement:'free'
				,guid : task.guid
				,people : this.people
				}
				this._addMySubTask(data);
			}
			else if(this.taskType = 'list')
			{
				this._addSubTasks(task.subTasks,false,task.guid)
			}
			else if(this.tasktype = 'orderList')
			{
				this._addSubTasks(task.subTasks,true,task.guid)
			}
			this.subTasks = task.subTask;
		},
	  
		_addSubTasks:function(subtasks,order,taskGuid)
		{
			var self = this;
			Y.Array.each(subtasks,function(subtask)
			{
				data =
				{
				textElement:subtask.description
				,guid : subtask.guid
				,people : self.people
				,taskGuid : taskGuid
				,circleGuid:self.circleGuid
				}
				self._addMySubTask(data);
			});
		},
		
		_addMySubTask : function(subTask)
		{
			this._addElement(subTask,Y.ModuleTask.SubTaskUI);
		},
	  
		_addInformationUI : function()
		{
			var title = Y.one('#div_header_activity strong');
			title.set('innerHTML',this.task_title);
		}
	});

	Y.namespace("ModuleNewsketcher").ActivityWorkOut = ActivityWorkOut;

}, "1.0", {requires:['base','genericcontainer','subtaskui']});