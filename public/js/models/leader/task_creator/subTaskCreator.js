YUI.add("subtaskcreator", function(Y)
{ 
	var Lang = Y.Lang;


	function SubTaskCreator(data)
	{
	SubTaskCreator.superclass.constructor.apply(this, arguments);
	}


	SubTaskCreator.NAME = "subTaskCreator";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	SubTaskCreator.ATTRS =
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
		,container:
			{
			value:null	
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(SubTaskCreator, Y.Base,
	{
		initializer: function(data)
		{
			this.client = data.client;
			this.container = data.container;
			this.callback = data.callback;
			this.dom = document.getElementById('taskDefinition');
			this.prefixIdSubTask = 'subtask_';
			
			this._showSubTaskDefinition();

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
	  
		_addCreatorBtnEvent : function(btn,input)
		{
			var self = this;
			self.btnCreate = Y.one(btn);
			self.btnCreate.on('click',function(e)
			{
				self.createSubTask(input);
				e.stopPropagation();
			});
		},
	  
		_cancelBtnEvent : function(btn)
		{
			var self = this;
			self.btnCancel = Y.one(btn);
			self.btnCancel.on('click',function(e)
			{
				self._hideSubTaskDefinition();
				e.stopPropagation();
			});
		},

		createSubTask : function(input)
		{
			var description = $(input).val();
			var data = 
				{
				description:description
				,guid:this.prefixIdSubTask+Utils.guid()
				}
			if(this.callback && this.callback.click)
				this.callback.click(data);
			this._hideSubTaskDefinition();
		}
	});

	Y.namespace("ModuleTask").SubTaskCreator = SubTaskCreator;

}, "1.0", {requires:['base','groupwizard']});