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
	  
		_addMyTask : function(task)
		{
			task.textElement = task.title;
			task.title = null;
			var li = this._addElement(task);
			this._addEvent(li);
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
			var container = $(dom);
			container.bind('click',function (e)
			{
				self._handleClick(dom.id);	
			});
			
		},
	  
		_handleClick : function(guid)
		{
			var showDescription = new Y.ModuleTask.ShowTask(
			{
				container : this.li
				,guid:guid
				,people : this.people
				,callback : this.callback
			});
		}
	});

	Y.namespace("ModuleCircle").ShowCircle = ShowCircle;

}, "1.0", {requires:['base','genericdivanimation','showtask']});