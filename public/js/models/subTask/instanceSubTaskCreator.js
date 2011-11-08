YUI.add("instancesubtaskcreator", function(Y)
{ 
	var Lang = Y.Lang;


	function InstanceSubTaskCreator(data)
	{
	InstanceSubTaskCreator.superclass.constructor.apply(this, arguments);
	}


	InstanceSubTaskCreator.NAME = "instanceSubTaskCreator";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	InstanceSubTaskCreator.ATTRS =
	{
		client:
			{
			value:null
			}
		,callback:
			{
			value:null	
			}
		,dom:
			{
			value:null
			}
		,subcriptions:
			{
			value:null
			}
		,prefixIdSubTask:
			{
			value:null
			}
		,del:
			{
			value:null	
			}
		,btnCreate:
			{
			value:null	
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(InstanceSubTaskCreator, Y.Base,
	{
		initializer: function(data)
		{
			this.client = data.client;
			this.callback = data.callback;
			this.dom = document.getElementById('taskDefinition');
			this.prefixIdTask = 'subTask_';
			this.people = data.people;
			
			this.showTaskDefinition(true);
			this.showUsers();
			this.addCreatorBtnEvent();

		this.publish("myEvent", {
		defaultFn: this._defMyEventFn,
		bubbles:false
		});
		},

		destructor : function()
		{
			this.btnCreate.destroy();
		},

		/* MyComponent specific methods */

		showTaskDefinition : function(bool)
		{
				this.dom.style.display = bool?"":"none";
		},

		showUsers : function()
		{
			this.group = new Y.ModuleTask.GroupWizard({client:this.client, people:this.people});
			this.group.setVisible(true);
		},
	  
		addCreatorBtnEvent : function()
		{
			var self = this;
			self.btnCreate = Y.one('#taskCreate');
			self.btnCreate.on('click',function(e)
			{
				self.createInstanceSubTask();
			});
		},

		createInstanceSubTask : function()
		{
			var title = $('#taskTitle').val();
			var users = this.getUsers();
			var data = 
				{
				title:title
				,guid:this.prefixIdTask+Utils.guid()
				,status:'join'
				,owner:this.client.guid
				,group:users
				}
			if(this.callback && this.callback.click)
				this.callback.click(data);
			this.showTaskDefinition(false);
		},

		getUsers : function()
		{
			var people = this.group.getGroup();
			var subGroup = [];
			_.each(people, function(person)
			{
				if(person.selected)
					subGroup.push(person.to_json())
			})
			return subGroup;
		}
	});

	Y.namespace("ModuleTask").InstanceSubTaskCreator = InstanceSubTaskCreator;

}, "1.0", {requires:['base','groupwizard']});