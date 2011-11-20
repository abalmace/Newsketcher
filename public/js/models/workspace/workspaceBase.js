YUI.add("workspacebase", function(Y)
{ 
	var Lang = Y.Lang;


	function WorkspaceBase(data)
	{
		WorkspaceBase.superclass.constructor.apply(this, arguments);
	}


	WorkspaceBase.NAME = "workspaceBase";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	WorkspaceBase.ATTRS =
	{
		client:
			{
			value:null
			,getter: function()
				{
				return this.client	
				}
			}
		,room:
			{
			value:null	
			}
		,map:
			{
			value:null
			,getter: function()
				{
				return this.map
				}
			}
		,canvas:
			{
			value:null
			,getter:function()
				{
				return this.canvas	
				}
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(WorkspaceBase, Y.Base,
	{
		initializer: function(data)
		{
			var self = this;
			self.room = data.room;
			self.client = self.room.client;
			self.canvas = new Y.ModuleMap.Canvas({workspace:self});
			
		this.publish("myEvent", {
		defaultFn: this._defMyEventFn,
		bubbles:false
		});
		},

		destructor : function()
		{
			this.map.destroy();
			this.map = null;
			$('#toggleModeButton').unbind('click');
		},

		/* MyComponent specific methods */

		start : function()
		{
			var self = this;
			var dom = self.client.getWorkspaceMapDom()
			self.map = new Y.ModuleMap.GenericMap({
				dom: self.client.getWorkspaceMapDom()
				, controllable: true 
				, position: self.room.currentPosition
				, showCredits: true
			});

			self.map.onMove(function(position) {
				self.room.moveTo(position, 
					{ userMove: self.map.userMove
				});
			});
			
			_.each(self.room.overlays, function(overlay) {
				self.addOverlay(overlay);
			});
		},

		addOverlay : function(overlay)
		{
			var self = this;
			overlay.drawAt(self.map,
				{ click: { 	update : function(overlay)
								{
									self.room.updateOverlay(overlay);
								}
						,destroy: function(overlay)
									{
										self.room.destroy(overlay);
									}
						}
				,drag: function()
					{
						self.canvas.drawing = false; // informar al canvas que no dibuje una polilinea
						self.canvas.points = []; //informar al canvas que no tiene una polilinea
						self.canvas.dragMarker = true; //informar al canvas que estoy haciendo un drag de un marker 
					}
				});
		},
	  
		_moveTo : function(pos)
		{
			var self = this;
			self.map.moveTo(pos);
		},

		getCenter : function()
		{
			var self = this;
			return self.map.getCenter();
		},

		saveOverlay : function(overlay)
		{
			this.room.saveOverlay(overlay);
		}
	  
		
	});

	Y.namespace("ModuleWorkspace").WorkspaceBase = WorkspaceBase;

}, "1.0", {requires:['base','genericmap','canvas']});