YUI.add("taskcreator", function(Y)
{ 
	var Lang = Y.Lang;


	function TaskCreator(data)
	{
	TaskCreator.superclass.constructor.apply(this, arguments);
	}


	TaskCreator.NAME = "taskCreator";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	TaskCreator.ATTRS =
	{
		client:
			{
			value:null
			}
		,title:
			{
			value:null	
			}
		,guid:
			{
			value:null
			}
		,objetivesview :
			{
			value:null
			}
		,stepsview :
			{
			value:null
			}	
		,infoOnMap :
			{
			value:null
			}
		,animatedFeedback:
			{
			value:null
			}
		,notification:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(TaskCreator, Y.Base,
	{
		initializer: function(data)
		{
			this.client = data.client;
			this.objetivesview = new Y.ModuleList.ObjetivesView();
			this.stepsview = new Y.ModuleList.StepsView({client:this.client});
			this.stepsview.visible(false);
			this.notification = new Y.ModuleNotification.Notification();
			
			this._addEvents();
		},

		destructor : function()
		{
			this.cient = null;
			Y.one('#select_taskType').destroy()
		},
	  
		createTask:function()
		{
			var self = this;
			var data = self._createTask();
			data.objetives = self.objetivesview.getObjetives();
			data.subTasks = self.stepsview.getSteps();
			self.client.sendSignal(self._subscribePath(), data);
			var data =
			{
			icon:'./css/images/task-list.png'
			,title:'Task Creator'
			,content:'A new task has been created'	
			}
			self.notification.notify(data,'simple');
			return true
		},
	  
		_addEvents : function(e)
		{
			var self = this;
			var btnSelect = Y.one('#select_taskType');
			btnSelect.on('change',function(e)
			{
				var value = btnSelect.get('value');
				if(value == 'orderList')
				{
					self.stepsview.visible(true);
				}
				else if(value == 'list')
				{
					self.stepsview.visible(true);
				}
				else if(value == 'free')
				{
					self.stepsview.visible(false);
				}
			});
		},
	  
		_createTask : function()
		{
			var node = Y.one('#divCreatorTask');
			var nodeTitle = node.one('.selector_title');
			
			var data =
			{
				title : nodeTitle.get('value')
				,guid : Utils.guid()
				,status : 'add'
				,owner : this.client.guid
			}
			
			return data;
		},
	  
		_subscribePath : function()
		{
			return '/channel/Tasks'
		}
	});

	Y.namespace("ModuleTask").TaskCreator = TaskCreator;

}, "1.0", {requires:['base','objetivesview','stepsview','infoonmap','notification']});