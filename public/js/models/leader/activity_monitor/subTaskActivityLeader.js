YUI.add("subtaskactivityleader", function(Y)
{ 
	var Lang = Y.Lang;


	function SubTaskActivityLeader(data)
	{
		SubTaskActivityLeader.superclass.constructor.apply(this, arguments);
	}


	SubTaskActivityLeader.NAME = "subTaskActivityLeader";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	SubTaskActivityLeader.ATTRS =
	{
	};

    /* MyComponent extends the Base class */
	Y.extend(SubTaskActivityLeader, Y.ModuleTask.SubTaskActivity,
	{
		initializer: function(data)
		{
			this.instanceSubTaskType = Y.ModuleTask.InstanceSubTask;
			
			this._addSubTaskDefinition();
			this._addSubscriptions();		
		},

		destructor : function()
		{
		},
	  
		_addSubTaskDefinition:function(data)
		{
			var self = this;
			var dataAux = 
				{
				client : this.client
				,persisted : true
				,dom:this.li
				,name :this.guid
				,title:'titulo'
				,group:[]
				,callback:
					{
					click:function(bool)
						{
							
						}
					}
				}
			this.definitionSubTask = new Y.ModuleTask.DefinerSubTaskActivity(dataAux);	
		},
	  
		_addSubscriptions : function()
		{
			var self = this;
		//suscribirse a la edicion de Rooms
			self.subscriptions.push(self.client.subscribe(self._subscribePath(), function(data) {
				if (data.status == 'join')
					self._joinInstanceSubTask(data);
				else if (data.status == 'delete2')
					self._removeInstanceSubTask(data);

			}));
			
		// Download all instanceSubTasks
			Y.ModuleConnectionServer.getJSON('/channel/'+ self.circleGuid +'/'+self.guid+'/instanceSubTasks.json', function(data)
			{
				Y.Array.each(data.instanceSubTasks, function(info)
				{
					self._joinInstanceSubTask(info);
				});
			})
		}
		
		
	});

	Y.namespace("ModuleLeader").SubTaskActivityLeader = SubTaskActivityLeader;

}, "1.0", {requires:['genericdivanimationcontainer','connectionserver','definersubtaskactivity','subtaskactivity','instancesubtask']});