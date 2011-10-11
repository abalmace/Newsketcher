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
			var circle = this.getCircle(circleGuid);
			if (circle)
				circle.addPerson(person)
		},
	  
		addTaskToCircle : function(task, circleGuid)
		{
			var circle = this.getCircle(circleGuid);
			if (circle)
				circle.addTask(task)
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

		_addSubscriptions : function()
		{
			var self = this;
			//suscribirse a la edicion de Tasks
			self.subscriptions.push(self.client.subscribe(self._subscribePath(), function(circle)
			{
				if (circle.status == 'add')
					self._addCircle(circle);
				else if (circle.status == 'delete')
					self.removeCircle(circle);

			}));
			
			Y.io('/channel/'+self.activity+'/circles.json',
			     {
				on :
				{
					success : function (tx, r)
					{
						var data;

						// protected against malformed JSON response
						try
						{
							data = Y.JSON.parse(r.responseText);
							_.each(data.circles, function(circle)
							{
								self._addCircle(circle);
							});
						}
						catch (e)
						{
							alert("JSON Parse failed!");
							return;
						}
					}
				}
			});
			
				
		},

		_subscribePath : function()
		{
			return '/channel/circles/circle';
		},

		_initCircleCreator : function()
		{
			var circleCreator = new Y.ModuleCircle.CircleCreator(
			{
				client:self.client
				,function:
					{
					click:function(data)
						{
						self.client.sendSignal(self.subscribePath(), data);
						}
					}
			});	
		},
	});

	Y.namespace("ModuleContainerCircle").ContainerCircle = ContainerCircle;

}, "3.1.0", {requires:['base','circle-creator','circle','io','json-parse']});