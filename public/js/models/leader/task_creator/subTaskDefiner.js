YUI.add("subtaskdefiner", function(Y)
{ 
	var Lang = Y.Lang;


	function SubTaskDefiner(data)
	{
		SubTaskDefiner.superclass.constructor.apply(this, arguments);
	}


	SubTaskDefiner.NAME = "subTaskDefiner";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	SubTaskDefiner.ATTRS =
	{
	
	};

    /* MyComponent extends the Base class */
	Y.extend(SubTaskDefiner, Y.ModuleTask.InstanceSubTask,
	{
		initializer: function(data)
		{
			this._addSubscriptions();
			this.instanceSubTaskUI = new Y.ModuleTask.CreateSubTaskUI({dom:this.dom,title:data.title});
			this._events();
		},

		destructor : function()
		{
			
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

		setActive : function(active)
		{
			var self = this;


			if (active)
			{
				if ( self.client.activeRoom == self ) return;
				if ( self.client.activeRoom )
				self.client.activeRoom.setActive(false);
				self.client.activeRoom = self;

				self.workspace = new Y.ModuleWorkOut.WorkspaceRWGPS({room:self});
				self.workspace.defaultValues();
				newsketcherClient.currentRoomId=self.name;
				var parentNode = self.dom.parentNode;
				self.instanceSubTaskUI.active(true);
					
				Y.one('#toolbar').setStyle('visibility','visible');
				Y.one('#location').setStyle('visibility','visible');
			} 
			else
			{
				self.workspace.destroy();
				self.workspace = null;
				self.dom.style.border = "";
				self.instanceSubTaskUI.active(false);			
			}
		},

		_events : function()
		{
			var self = this;
			
			$(self.dom).bind('click',function(e)
			{
				self.setActive(true);
				e.stopPropagation();
			});
		}
	});

	Y.namespace("ModuleLeader").SubTaskDefiner = SubTaskDefiner;

}, "1.0", {requires:['instancesubtask','createsubtaskui','instancesubtaskgroup','workspacerwgps','connectionserver']});   