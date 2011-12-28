YUI.add("subtaskactivityfollower", function(Y)
{ 
	var Lang = Y.Lang;


	function SubTaskActivityFollower(data)
	{
		SubTaskActivityFollower.superclass.constructor.apply(this, arguments);
	}


	SubTaskActivityFollower.NAME = "subTaskActivityFollower";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	SubTaskActivityFollower.ATTRS =
	{
		
	};

    /* MyComponent extends the Base class */
	Y.extend(SubTaskActivityFollower, Y.ModuleTask.SubTaskActivity,
	{
		initializer: function(data)
		{
			var self = this;
			this.instanceSubTaskType = Y.ModuleTask.InstanceSubTask;
			this.callbackToInstance = 
					{
					showAddBtn:function(bool)
						{
							self._showAddButton(bool);
						}
					,showRemoveBtn:function(bool)
						{
							self._showRemoveButton(bool);
						}
					}
			
			this._addSubTaskDefinition();
			this._addSubscriptions();
			this._addEventButtonAdd();
			this._addEventButtonRemove();			
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
							self._showRemoveButton(false);
							self._showAddButton(bool);
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
					self._isMyInstance(data);
				else if (data.status == 'delete2')
					self._removeInstanceSubTask(data);

			}));
			
		// Download previos instanceTasks
			Y.ModuleConnectionServer.getJSON('/channel/'+ self.circleGuid +'/'+self.guid+'/'+self.client.guid+'/instanceSubTasks.json', function(data)
			{
				Y.Array.each(data.instanceSubTasks, function(info)
				{
					self._joinInstanceSubTask(info);
				});
			})
		},
		
		_addEventButtonAdd : function()
		{
			var self = this;
			var li =jQuery(this.li);
			var add =li.find("div.instanceAdd");
			add.bind('click', function(e)
			{
				if(self.client.instanceSubTaskCreator)
					self.client.instanceSubTaskCreator.destroy();
				self.client.instanceSubTaskCreator = new Y.ModuleTask.InstanceSubTaskCreator(
					{
					client:self.client
					,people:self.people
					,container:self.container
					,callback:
						{
						click:function(data)
							{
								data.taskGuid = self.taskGuid;
								data.circleGuid = self.circleGuid;
								data.subTaskGuid = self.guid;
								self.client.sendSignal(self._subscribePath(), data);
							}
						}
					});
				e.stopPropagation();
			});
		},
	  
		_addEventButtonRemove: function()
		{
			var self = this;
			var node = Y.one(this.li);
			var remove = node.one('.instanceRemove');
			
			remove.on('click', function(e)
			{
				var guid = self.client.currentRoomId;
				var data = 
				{
					taskGuid : self.taskGuid
					,circleGuid: self.circleGuid
					,subTaskGuid : self.guid
					,guid : guid
					,status : 'delete2'
				}
				self.client.sendSignal(self._subscribePath(), data);
				e.stopPropagation();
			});
		},
	  
		_showAddButton:function(bool)
		{
			var node = Y.one(this.li);
			var add = node.one('.instanceAdd');
			if(bool)
				add.setStyle('visibility','visible');
			else
				add.setStyle('visibility','hidden');
		},
	  
		_showRemoveButton:function(bool)
		{
			var node = Y.one(this.li);
			var add = node.one('.instanceRemove');
			if(bool)
				add.setStyle('visibility','visible');
			else
				add.setStyle('visibility','hidden');
		},
	  
		_isMyInstance:function(data)
		{
			var guid = this.client.guid;
			var result = _.detect(data.group, function(s) { return s.guid == guid });
			if(result && result.selected)
				this._joinInstanceSubTask(data);
		}
		
	});

	Y.namespace("ModuleFollower").SubTaskActivityFollower = SubTaskActivityFollower;

}, "1.0", {requires:['genericdivanimationcontainer','connectionserver','definersubtaskactivity','subtaskactivity','instancesubtask','instancesubtaskcreator']});