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
			self.canvas = new Canvas(self);
			
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

		start : function()
		{
			var self = this;
			var dom = self.client.getWorkspaceMapDom()
			self.map = new Map({
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

		stop : function()
		{
			//var self = this;
			this.map = null;
			$('#toggleModeButton').unbind('click');
		},

		saveOverlay : function(overlay)
		{
			this.room.saveOverlay(overlay);
		}
	  
		
	});

	Y.namespace("ModuleWorkspace").WorkspaceBase = WorkspaceBase;

}, "1.0", {requires:['base']});