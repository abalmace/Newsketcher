YUI.add("containercircle", function(Y)
{

   
	var Lang = Y.Lang;


	function ContainerCircle(data)
	{
	ContainerCircle.superclass.constructor.apply(this, arguments);
	}


	ContainerCircle.NAME = "containerCircle";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ContainerCircle.ATTRS =
	{
		client:
			{
			value:null
			}
		,allCircles:
			{
			value:[]	
			}
		,container:
			{
			value:null
			}
		,subscriptions:
			{
			value:[]
			}
		,prefixIdTask:
			{
			value:''
			}
		,callback:
		{
			value : null
		}
	};

    /* MyComponent extends the Base class */
	Y.extend(ContainerCircle, Y.Base,
	{

		initializer: function(data)
		{
			this.client = data.client;
			this.allCircles = [];
			this.container = data.container;
			this.callback = data.callback;
			this.subscriptions = [];
			this.prefixIdTask = 'circle_';
			
			
		},

		destructor : function()
		{
			this.client = null;
			this.allCircles.destructor();
			this.container = null;
			this.subscriptions.destructor();
		},

		/* MyComponent specific methods */

		addPersonToCircle : function(person, circleGuid)
		{
			
			var data =
			{
				person : person
				,circleGuid : circleGuid
				,status : 'add'
			}
			this.client.sendSignal(this._subscribePath('circlePeople'), data);
		},
	  
		removePersonFromCircle : function(person, circleGuid)
		{
			
			var data =
			{
				person : person
				,circleGuid : circleGuid
				,status : 'delete'
			}
			this.client.sendSignal(this._subscribePath('circlePeople'), data);
		},
	  
		addTaskToCircle : function(task, circleGuid)
		{
			var data =
			{
				task : task
				,circleGuid : circleGuid
				,status : 'add'
			}
			this.client.sendSignal(this._subscribePath('circleTasks'), data);
		},
	  
		removeTaskFromCircle : function(task, circleGuid)
		{
			var data =
			{
				task : task
				,circleGuid : circleGuid
				,status : 'delete'
			}
			this.client.sendSignal(this._subscribePath('circleTasks'), data);
		},
	  
		getCircle : function(circleGuid)
		{
			return  _.detect(this.allCircles, function(s) { return s.guid == circleGuid });
		},
		
		_addCircle : function(data)
		{
			var div = document.createElement('div');
			var guid = data.guid || Utils.guid()
			div.className = "outer_circle";
			div.id = guid;	
			data.client = this.client;
			
			data.dom = div;
			data.guid = guid;
			
			var circle = new Y.ModuleCircle.Circle(data);
			this.allCircles.push(circle);
			this.container.appendChild(div);
		},
	  
		_addPersonToCircle : function(circlePerson)
		{
			var circle = this.getCircle(circlePerson.circleGuid);
			if (circle)
				circle.addPerson(circlePerson.person)
		},
	  
		_removePersonFromCircle : function(circlePerson)
		{
			var circle = this.getCircle(circlePerson.circleGuid);
			if (circle)
				circle.removePerson(circlePerson.person)
		},
	  
		_addTaskToCircle : function(circleTask)
		{
			var circle = this.getCircle(circleTask.circleGuid);
			if (circle)
				circle.addTask(circleTask.task)
		},
	  
		_removeTaskFromCircle : function(circleTask)
		{
			var circle = this.getCircle(circleTask.circleGuid);
			if (circle)
				circle.removeTask(circleTask.task)
		},

		_subscribePath : function(zone)
		{
			return '/channel/Circle/'+zone;
		},
	  
		_addNewCircle : function(data,zone)
		{
			this.client.sendSignal(this._subscribePath(zone), data);
		}
	});

	Y.namespace("ModuleContainerCircle").ContainerCircle = ContainerCircle;

}, "3.1.0", {requires:['base','circle-creator','circle','connectionserver']});