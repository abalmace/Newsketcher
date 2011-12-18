YUI.add("infoonmap", function(Y)
{ 
	var Lang = Y.Lang;


	function InfoOnMap(data)
	{
		InfoOnMap.superclass.constructor.apply(this, arguments);
	}


	InfoOnMap.NAME = "infoOnMap";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	InfoOnMap.ATTRS =
	{
		client:
			{
			value:null
			,getter: function()
				{	
				return this.client	
				}
			}
		,name:
			{
			value:null
			}
		,editable:
			{
			value:true
			}
		,persisted:
			{
			value:true
			}
		,workspace:
			{
			value:true
			}
		,subscriptions:
			{
			value : []	
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(InfoOnMap, Y.ModuleTask.Room,
	{
		initializer: function(data)
		{
			this.client = data.client;
			this.subscriptions = [];
			this._addSubscriptions();

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

		/* MyComponent specific methods */

		setActive : function(active)
		{
			var self = this;
			if(active)
			{
				if ( self.client.activeRoom == self ) return;
				if ( self.client.activeRoom )
				self.client.activeRoom.setActive(false);
				self.client.activeRoom = self;
				
				self.workspace = new Y.ModuleWorkspace.WorkspaceToSubTask({room:self});
				self.workspace.defaultValues();
				Y.one('#toolbar').setStyle('visibility','visible');

			}
			else
			{
				self.workspace.destroy();
				self.workspace = null;
			}
		},
	  
		_addSubscriptions : function()
		{
			var self = this;
			
			if (self.persisted)
			{
				// Subscribe to sketch updates.
				self.subscriptions.push(self.client.subscribe(self._roomPath('sketches'), function(sketch)
				{
					if (sketch.type == 'new')
						self.add(sketch);
					else if (sketch.type == 'delete')
						self.remove(sketch);

				}));
				self.subscriptions.push(self.client.subscribe(self._roomPath('moves'), function(data)
				{
					if (data.client != self.client.guid)
						self.moveTo(data.position)
				}));
				
				// Download previos sketches
				Y.ModuleConnectionServer.getJSON('/rooms/'+ this.name +'/sketches.json', function(data)
				{
					_.each(data.sketches, function(sketch) {
						self.add(sketch);
					});
				})
			}
			
			//this.instace = new InstanceTask(this.dom);
			
			
			//self.events();
			
		},
	});

	Y.namespace("ModuleTask").InfoOnMap = InfoOnMap;

}, "1.0", {requires:['room','workspacetosubtask','connectionserver']});