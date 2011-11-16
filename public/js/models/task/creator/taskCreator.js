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
	};

    /* MyComponent extends the Base class */
	Y.extend(TaskCreator, Y.Base,
	{
		initializer: function(data)
		{
			this.client = data.client;
			this.objetivesview = new Y.ModuleList.ObjetivesView();
			this.stepsview = new Y.ModuleList.StepsView({client:this.client});
			
			this._addEvents();
			
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

}, "1.0", {requires:['base','objetivesview','stepsview','infoonmap']});