YUI.add("showcontainercircleleader", function(Y)
{ 
	var Lang = Y.Lang;


	function ShowContainerCircleLeader(data)
	{
		ShowContainerCircleLeader.superclass.constructor.apply(this, arguments);
	}


	ShowContainerCircleLeader.NAME = "showContainerCircleLeader";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ShowContainerCircleLeader.ATTRS =
	{
	};

    /* MyComponent extends the Base class */
	Y.extend(ShowContainerCircleLeader, Y.ModuleContainerCircle.ShowContainerCircle,
	{
		initializer: function(data)
		{
			this.showCircleType = Y.ModuleLeader.ShowCircleLeader;
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
			
		// Download previos Tasks
			Y.ModuleConnectionServer.getJSON('/channel/Circle/circles.json',function(data)
			{
				Y.Array.each(data.circles, function(circle)
				{
					self._addMyCircle(circle);
				});
			})	
		}
	});

	Y.namespace("ModuleLeader").ShowContainerCircleLeader = ShowContainerCircleLeader;

}, "1.0", {requires:['node-event-delegate','node','connectionserver','showcontainercircle','showcircleleader']});