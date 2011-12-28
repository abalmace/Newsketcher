YUI.add("showcontainercirclefollower", function(Y)
{ 
	var Lang = Y.Lang;


	function ShowContainerCircleFollower(data)
	{
		ShowContainerCircleFollower.superclass.constructor.apply(this, arguments);
	}


	ShowContainerCircleFollower.NAME = "showContainerCircleFollower";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ShowContainerCircleFollower.ATTRS =
	{

		subscriptions:
			{
			value:[]
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(ShowContainerCircleFollower, Y.ModuleContainerCircle.ShowContainerCircle,
	{
		initializer: function(data)
		{
			this.showCircleType = Y.ModuleFollower.ShowCircleFollower;
			this._addSubscriptions();
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

		_addSubscriptions : function()
		{
			var self = this;
		//suscribirse a la edicion de Tasks
			self.subscriptions.push(self.client.subscribe(self._subscribePath(), function(task) {
				if (task.status == 'join')
					self.addMyTask(task);
				else if (data.status == 'delete')
					self.removeTask(data);

			}));
			
		// Download Circles
			Y.ModuleConnectionServer.getJSON('/channel/Circle/'+this.client.guid +'/circles.json',function(data)
			{
				Y.Array.each(data.circles, function(circle)
				{
					self._addMyCircle(circle);
				});
			})	
		}
	});

	Y.namespace("ModuleFollower").ShowContainerCircleFollower = ShowContainerCircleFollower;

}, "1.0", {requires:['node-event-delegate','node','connectionserver','showcontainercircle','showcirclefollower']});