YUI.add("showroom", function(Y)
{ 
	var Lang = Y.Lang;


	function ShowRoom(data)
	{
		ShowRoom.superclass.constructor.apply(this, arguments);
	}


	ShowRoom.NAME = "showRoom";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ShowRoom.ATTRS =
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
		,workspace:
			{
			value:true
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(ShowRoom, Y.ModuleTask.Room,
	{
		initializer: function(data)
		{
			this.client = data.client;
			this.name = data.name;
			
			
			this.showRoomUI = new Y.ModuleTask.ShowRoomUI({dom:data.dom,title:data.description});
			
			this._downloadPrevious();
			this._events();

		this.publish("myEvent", {
		defaultFn: this._defMyEventFn,
		bubbles:false
		});
		},

		destructor : function()
		{
			Y.one(this.dom);
			this.showRoomUI.destroy();
			this.showRoomUI = null;
			this.workspace.destroy();
			this.workspace = null;
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
				
				self.workspace = new Y.ModuleWorkspace.WorkspaceRead({room:self});
				self.workspace.defaultValues();
				self.showRoomUI.active(true);

			}
			else
			{
				self.showRoomUI.active(false);
				self.workspace.destroy();
				self.workspace = null;
			}
		},
		
		_events : function()
		{
			var self = this;
			
			Y.one(self.dom).on('click',function()
			{
				self.setActive(true);
			});
		},
	});

	Y.namespace("ModuleTask").ShowRoom = ShowRoom;

}, "1.0", {requires:['room','workspaceread','showroomui']});