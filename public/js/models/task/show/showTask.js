YUI.add("showtask", function(Y)
{ 
	var Lang = Y.Lang;


	function ShowTask(data)
	{
	ShowTask.superclass.constructor.apply(this, arguments);
	}


	ShowTask.NAME = "showTask";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ShowTask.ATTRS =
	{
		client:
			{
			value:null
			}
		,name:
			{
			value:null	
			}
		,li:
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
	};

    /* MyComponent extends the Base class */
	Y.extend(ShowTask, Y.Base,
	{
		initializer: function(data)
		{
			this.client = data.client;	//cliente
			this.guid = data.guid;
			this.li = data.li;		//elemento html que representa al módulo
			this.name = data.name;
			this.people = data.people;	//integrantes del circle
			
			this._retrieveTaskInformation();

		this.publish("myEvent", {
		defaultFn: this._defMyEventFn,
		bubbles:false
		});
		},

		destructor : function()
		{
		
		},
	  
		_retrieveTaskInformation:function()
		{
			var self = this;
			Y.ModuleConnectionServer.getJSON('/channel/Task/'+this.guid+'/task.json',function(data)
			{
				self._createContainer(data.task[0]);
			});
		},

		_createContainer : function(data)
		{
			var title = Y.one('#div_containerSelectorInfoTask').one('span');
			title.set('innerHTML',data.title);
		}
	});

	Y.namespace("ModuleTask").ShowTask = ShowTask;

}, "1.0", {requires:['base','connectionserver']});