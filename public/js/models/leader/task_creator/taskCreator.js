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
			//this._feedbackTaskCreated();
			
		this.publish("myEvent", {
		defaultFn: this._defMyEventFn,
		bubbles:false
		});
		},

		destructor : function()
		{
			this.cient = null;
		},
	  
		_addEvents : function(e)
		{
			var buttonCreate = Y.one('#buttonAddTask');
			var self = this;
			buttonCreate.on('click', function(e)
			{
				var data = self._createTask();
				data.objetives = self.objetivesview.getObjetives();
				data.subTasks = self.stepsview.getSteps();
				self.client.sendSignal(self._subscribePath(), data);
				//self._taskCreated();
				var data =
				{
				icon:'./css/images/task-list.png'
				,title:'Task Creator'
				,content:'A new task has been created'	
				}
				self.notification.notify(data,'simple');
				
			});
			
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
		},
		
		_feedbackTaskCreated:function()
		{
			var self = this;
			var node = Y.one('#bar_task_creator');
			var nodeTitle = node.one('strong');

			this.animatedFeedback = new Y.Anim(
			{
			node: node,
			from: {
				backgroundColor:node.getStyle('backgroundColor'),
				color: node.getStyle('color'),
				borderColor: node.getStyle('borderTopColor')
			},

			to: {
				color: '#fff',
				backgroundColor:'#93DB70',
				borderColor: '#71241a'
			},

			duration:4.5
			});
			
			this.animatedFeedback.on('end', function()
			{
				self._cleanForm();
			});
		},
	  
		_taskCreated:function()
		{
			this.animatedFeedback.set('reverse', false);
			this.animatedFeedback.run();
			this.animatedFeedback.set('reverse', true);
			this.animatedFeedback.run();
		},
	  
		_cleanForm:function()
		{
		}
	});

	Y.namespace("ModuleTask").TaskCreator = TaskCreator;

}, "1.0", {requires:['base','objetivesview','stepsview','infoonmap','notification']});