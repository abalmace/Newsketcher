YUI.add("taskactivity", function(Y)
{ 
	var Lang = Y.Lang;


	function TaskActivity(data)
	{
		TaskActivity.superclass.constructor.apply(this, arguments);
	}


	TaskActivity.NAME = "taskActivity";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	TaskActivity.ATTRS =
	{
		client:
			{
			value:null
			}
		,name:
			{
			value:null	
			}
		,container:
			{
			value:null
			}
		,guid:
			{
			value:null
			}
		,people:
			{
			value:[]
			}
		,tasks:
			{
			value:[]	
			}
		,showDescription:
			{
			value:null
			}
		,circleGuid:
			{
			value:null
			}
		,subTaskActivityType:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(TaskActivity, Y.ModuleGeneric.GenericDivAnimationContainer,
	{
		initializer: function(data)
		{
			this.client = data.client;	//cliente
			this.guid = data.guid;
			this.li = data.li;	//elemento html que representa al módulo
			this.name = data.name;
			this.people = data.people;	//integrantes del circle
			this.circleGuid = data.circleGuid;
			this.people = data.people;
			this.prefixIdTask = 'task_';
			this.task_title =  data.title;
		},

		destructor : function()
		{
			var children = Y.one(this.container).get('children');
			
			children.each(function(node)
			{
				node.detach();
			});
		},
	  
		_addSubTasks : function(task)
		{
			var self = this;
			Y.each(task.subTasks, function(subTask)
			{
				
				var data = 
				{
				title: subTask.description
				,guid: subTask.mapId
				,client:self.client
				}
 				self._addMySubTask(data);
			});
		},
		
		_addMySubTask : function(subTask)
		{
			subTask.textElement = subTask.title;
			subTask.title = null;
			subTask.client = this.client;
			subTask.people = this.people;
			subTask.circleGuid = this.circleGuid;
			subTask.taskGuid = this.guid;
			var li = this._addElement(subTask,this.subTaskActivityType);
			this._setUI(li);
		},
	  
		_setUI:function(li)
		{
			var node = Y.one(li);
			
			node.addClass('liSubTask');
			
			var add = node.one('.instanceAdd');
			add.setStyle('visibility','hidden');
			
			var remove = node.one('.instanceRemove');
			remove.setStyle('visibility','hidden');
			
			var nodeH2 = node.one(".mod h2");
			nodeH2.addClass('backgroundHeaderSubTask');
			
			var nodeUl = node.one(".elementContainer");
			nodeUl.addClass('backgroundSubTask');
		}
	});

	Y.namespace("ModuleTask").TaskActivity = TaskActivity;

}, "1.0", {requires:['genericdivanimationcontainer']});