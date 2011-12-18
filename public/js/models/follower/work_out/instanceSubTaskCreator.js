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
		,prefixIdInstance:
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
		,container:
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
			this.container = data.container;
			this.callback = data.callback;
			this.dom = document.getElementById('taskDefinition');
			this.prefixIdInstance = 'instanceSubTask_';
			this.people = data.people;
			
			this._showSubTaskDefinition();
			this.showUsers();

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

		_showSubTaskDefinition : function()
		{
			var input = document.createElement('input');
			input.id = 'instanceSubTaskInput';
			
			var btnCreate = document.createElement('div');
			btnCreate.className = 'gButton add';
			btnCreate.id ='btnNewInstance';
			btnCreate.innerHTML ='done';
			this._addCreatorBtnEvent(btnCreate,input);
			
			var btnCancel = document.createElement('div');
			btnCancel.className = 'gButton delete';
			btnCancel.id ='btnCancelNewInstance';
			btnCancel.innerHTML ='cancel';
			this._cancelBtnEvent(btnCancel);
			
			var li = document.createElement('li');
			li.className = "elementInstanceSubTaskCreator layer";
			li.id = 'containerCreatorInstance';
			
			li.appendChild(input);
			li.appendChild(btnCreate);
			li.appendChild(btnCancel);
			
			var node = Y.one(li);
			node.setAttribute('z-index','200');
			
			var nodeContainer = Y.one(this.container);
			
			nodeContainer.prepend(li);
			
			this.dom = li;
		},
	  
		_hideSubTaskDefinition:function()
		{
			var node = Y.one(this.container);
			node.setAttribute('z-index','0');
			
			var nodeElement = node.one('.elementInstanceSubTaskCreator');
			nodeElement.remove();
		},

		showUsers : function()
		{
			this.group = new Y.ModuleTask.GroupWizard({client:this.client, group:this.people});
		},
	  
		_addCreatorBtnEvent : function(btn,input)
		{
			var self = this;
			self.btnCreate = Y.one(btn);
			self.btnCreate.on('click',function(e)
			{
				self.createInstanceSubTask(input);
			});
		},
	  
		_cancelBtnEvent : function(btn)
		{
			var self = this;
			self.btnCancel = Y.one(btn);
			self.btnCancel.on('click',function(e)
			{
				self._hideSubTaskDefinition();
			});
		},

		createInstanceSubTask : function(input)
		{
			var title = $(input).val();
			var users = this.getUsers();
			var data = 
				{
				title:title
				,guid:this.prefixIdInstance+Utils.guid()
				,status:'join'
				,owner:this.client.guid
				,group:users
				}
			if(this.callback && this.callback.click)
				this.callback.click(data);
			this._hideSubTaskDefinition();
		},

		getUsers : function()
		{
			var people = this.group.getGroup();
			var subGroup = [];
			_.each(people, function(person)
			{
				subGroup.push(person.to_json())
			})
			return subGroup;
		}
	});

	Y.namespace("ModuleTask").InstanceSubTaskCreator = InstanceSubTaskCreator;

}, "1.0", {requires:['base','groupwizard']});