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
		,activity:
			{
			value:'Actividad1'
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
			this.subscriptions = [];
			this.prefixIdTask = 'circle_';
			this.activity = 'Actividad1';
			
			this._addSubscriptions();
			this._initCircleCreator();
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

		_addSubscriptions : function()
		{
			var self = this;
			//suscribirse a la creación-eliminacion de circles
			self.subscriptions.push(self.client.subscribe(self._subscribePath('circle'), function(circle)
			{
				if (circle.status == 'add')
					self._addCircle(circle);
				else if (circle.status == 'delete')
					self.removeCircle(circle);

			}));
			
			//suscripción a la edicion de personas en circles
			self.subscriptions.push(self.client.subscribe(self._subscribePath('circlePeople'), function(circlePerson)
			{
				if (circlePerson.status == 'add')
					self._addPersonToCircle(circlePerson);
				else if (circlePerson.status == 'delete')
					self._removePersonFromCircle(circlePerson);

			}));
			
			//suscripción a la edicion de task en circles
			self.subscriptions.push(self.client.subscribe(self._subscribePath('circleTasks'), function(circleTask)
			{
				if (circleTask.status == 'add')
					self._addTaskToCircle(circleTask);
				else if (circleTask.status == 'delete')
					self._removeTaskFromCircle(circleTask);

			}));
			
			Y.ModuleConnectionServer.getJSON('/channel/'+self.activity+'/circles.json',function(data)
			{
				_.each(data.circles, function(circle)
				{
					self._addCircle(circle);
				});
			});
				
		},

		_subscribePath : function(zone)
		{
			return '/channel/circles/'+zone;
		},

		_initCircleCreator : function()
		{
			var self = this;
			var circleCreator = new Y.ModuleCircle.CircleCreator(
			{
				client:self.client
				,function:
					{
					click:function(data)
						{
						self.client.sendSignal(self._subscribePath('circle'), data);
						}
					}
			});	
		},
	});

	Y.namespace("ModuleContainerCircle").ContainerCircle = ContainerCircle;

}, "3.1.0", {requires:['base','circle-creator','circle','connectionserver']});