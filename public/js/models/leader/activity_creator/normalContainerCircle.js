YUI.add("normalcontainercircle", function(Y)
{
	var Lang = Y.Lang;


	function NormalContainerCircle(data)
	{
		NormalContainerCircle.superclass.constructor.apply(this, arguments);
	}

	NormalContainerCircle.NAME = "normalContainerCircle";
	
	NormalContainerCircle.ATTRS =
	{
		callback:
			{
			value:null
			}
		,subscriptions:
			{
			value:[]
			}
	};
	
	 /* MyComponent extends the Base class */
	Y.extend(NormalContainerCircle, Y.ModuleContainerCircle.ContainerCircle,
	{

		initializer: function(data)
		{
			this.callback = data.callback;
			this.subscriptions = [];
			
			this._addSubscriptions();
			this._initCircleCreator();
		},

		destructor : function()
		{
			this.client = null;
			this.allCircles.destructor();
			this.container = null;
			Y.Array.each(this.subscriptions,function(s)
			{
				s.cancel();
			});
		},
	  
		_addSubscriptions : function()
		{
			var self = this;
			//suscribirse a la creación-eliminacion de circles
			self.subscriptions.push(self.client.subscribe(self._subscribePath('circle'), function(circle)
			{
				if (circle.status == 'add')
				{
					circle.callback = self.callback;
					self._addCircle(circle);
				}
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
			
			Y.ModuleConnectionServer.getJSON('/channel/Circle/circles.json',function(data)
			{
				_.each(data.circles, function(circle)
				{
					circle.callback = self.callback;
					self._addCircle(circle);
				});
			});
				
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
						self._addNewCircle(data,'circle');
					}
				}
			});	
		},
	  
		
	});


	Y.namespace("ModuleContainerCircle").NormalContainerCircle = NormalContainerCircle;

}, "1.0", {requires:['base','containercircle','connectionserver']});