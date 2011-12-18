YUI.add("showcircle", function(Y)
{ 
	var Lang = Y.Lang;


	function ShowCircle(data)
	{
		ShowCircle.superclass.constructor.apply(this, arguments);
	}


	ShowCircle.NAME = "showCircle";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ShowCircle.ATTRS =
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
	};

    /* MyComponent extends the Base class */
	Y.extend(ShowCircle, Y.ModuleGeneric.GenericDivAnimation,
	{
		initializer: function(data)
		{
			this.client = data.client;	//cliente
			this.guid = data.guid;
			this.li = data.li;	//elemento html que representa al módulo
			this.name = data.name;
			this.people = data.people;	//integrantes del circle	
			this.tasks = data.tasks;	//tareas asignadas a la circle
			this.callback = data.callback;
			
			this._addTasks();
			this._hideBtnPlus();
			
		this.publish("myEvent", {
		defaultFn: this._defMyEventFn,
		bubbles:false
		});
		},

		destructor : function()
		{
			var children = Y.one(this.container).get('children');
			
			children.each(function(node)
			{
				node.detach();
			});
		},
	  
		_addMyTask : function(task)
		{
			task.textElement = task.title;
			task.title = null;
			task.client = this.client;
			task.people = this.people;
			task.circleGuid = this.guid;
			var li = this._addElement(task,Y.ModuleTask.TaskActivity);
			this._setUI(li);
		},

		_addTasks : function()
		{
			
		//Tasks
			var self = this;
			Y.Array.each(this.tasks, function(task)
			{
				self._addMyTask(task);
			});	
		},
	  
	  
		_addEvent : function(dom)
		{
			var self = this;
			var container = Y.one(dom);
			container.on('click',function (e)
			{
				self._handleClick(dom.id);	
			});
			
		},
	  
		_handleClick : function(guid)
		{
			//this.showDescription && this.showDescription.destroy();
			var click;
			var self = this;
			var callback = [];
			if(self.callback && self.callback.click)
			{
				callback.click = function(data)
				{
					data.circleGuid = self.guid;
					self.callback.click(data);
				};
			}
			this.showDescription = new Y.ModuleTask.ShowTask(
			{
				container : this.li
				,guid:guid
				,people : this.people
				,callback : callback
				,client : this.client
			});
		},
		
		_hideBtnPlus:function()
		{
			var node = Y.one(this.li);
			node = node.one('.instanceAdd');
			node.setStyle('visibility','hidden');
		},
	  
		_setUI:function(li)
		{
			var node = Y.one(li);
			
			node.addClass('liTask');
			
			var add = node.one('.instanceAdd');
			add.setStyle('visibility','hidden');
			
			var nodeH2 = node.one(".mod h2");
			nodeH2.addClass('backgroundHeaderTask');
			
			var nodeUl = node.one(".elementContainer");
			nodeUl.addClass('backgroundTask');
		}
	});

	Y.namespace("ModuleCircle").ShowCircle = ShowCircle;

}, "1.0", {requires:['base','genericdivanimation','showtask','taskactivity']});