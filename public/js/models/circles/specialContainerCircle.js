YUI.add("specialcontainercircle", function(Y)
{
	var Lang = Y.Lang;


	function SpecialContainerCircle(data)
	{
		SpecialContainerCircle.superclass.constructor.apply(this, arguments);
	}

	SpecialContainerCircle.NAME = "specialContainerCircle";
	
	SpecialContainerCircle.ATTRS =
	{
		callback:
			{
			value:null
			}
	};
	
	 /* MyComponent extends the Base class */
	Y.extend(SpecialContainerCircle, Y.ModuleContainerCircle.ContainerCircle,
	{

		initializer: function(data)
		{
			this.callback = data.callback;
			this._addSubscriptions()
		},

		destructor : function()
		{
			this.client = null;
			this.allCircles.destructor();
			this.container = null;
			this.subscriptions.destructor();
		},
	  
		_addSubscriptions : function()
		{
			var self = this;
			//suscribirse a la creación-eliminacion de circles
			self.subscriptions.push(self.client.subscribe(self._subscribePath('specialCircle'), function(circle)
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
			
			Y.ModuleConnectionServer.getJSON('/channel/SpecialCircle/circles.json',function(data)
			{
				_.each(data.circles, function(circle)
				{
					circle.callback = self.callback;
					self._addCircle(circle);
				});
				self._lackCircles();
			});	
		},
	  
		_lackCircles : function()
		{
			var circle = this.getCircle('guid_every_circle');
			if(!circle)
			{
				var data = 
				{
				name:'Every Circle'
				,guid: 'guid_every_circle'
				,status:'add'
				,owner:null
				}
				this._addNewCircle(data,'specialCircle');
			}
			
			
			circle = this.getCircle('guid_everybody');
			if(!circle)
			{
				var data = 
				{
				name:'Everybody'
				,guid: 'guid_everybody'
				,status:'add'
				,owner:null
				}
				this._addNewCircle(data,'specialCircle');
			}
			
		},
	  
		_subscribePath : function(zone)
		{
			return '/channel/SpecialCircle/'+zone;
		},
	});


	Y.namespace("ModuleContainerCircle").SpecialContainerCircle = SpecialContainerCircle;

}, "1.0", {requires:['base','containercircle']});