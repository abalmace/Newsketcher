YUI.add("taskcreator", function(Y)
{ 
	var Lang = Y.Lang;


	function TaskCreator(data)
	{
		TaskCreator.superclass.constructor.apply(this, arguments);
	}


	TaskCreator.NAME = "taskCreator";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	TaskCreator.ATTRS =
	{
		notification:
			{
			value:null	
			}
		,subTasksInfo:
			{
			value:[]
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(TaskCreator, Y.ModuleTask.SubTaskActivity,
	{	
		initializer: function(data)
		{
			var self = this;
			this.instanceSubTaskType = Y.ModuleLeader.SubTaskDefiner;
			this.notification = new Y.ModuleNotification.Notification();
			this.subTasksInfo = []
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
			
			//this._addSubscriptions();
			this._addEventButtonAdd();
			this._addEventButtonRemove();
		},

		destructor : function()
		{
	
		},
	  
		_addSubscriptions : function()
		{
			var self = this;
		//suscribirse a la edicion de Rooms
			self.subscriptions.push(self.client.subscribe(self._subscribePath(), function(data) {
				if (data.status == 'join')
					self._isMyInstance(data);
				else if (data.status == 'delete')
					self._removeInstanceSubTask(data);

			}));
			
		// Download previos instanceTasks
			Y.ModuleConnectionServer.getJSON('/channel/'+ self.circleGuid +'/'+self.guid+'/'+self.client.guid+'/instanceSubTasks.json', function(data)
			{
				Y.Array.each(data.instanceSubTasks, function(info)
				{
					self._addCreatedSubTask(info);
				});
			})
		},
		
		_addEventButtonAdd : function()
		{
			var self = this;
			var li =Y.one(this.li);
			var add =li.one("div.instanceAdd");
			add.on('click', function(e)
			{
				if(self.client.instanceSubTaskCreator)
					self.client.subTaskCreator.destroy();
				self.client.subTaskCreator = new Y.ModuleTask.SubTaskCreator(
					{
					client:self.client
					,people:self.people
					,container:self.container
					,callback:
						{
						click:function(data)
							{
								var dataAux =
								{
								title:data.description
								,guid:data.guid
								}
								self.subTasksInfo.push(data)
								self._addCreatedSubTask(dataAux);
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
					,status : 'delete'
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
		
		_addCreatedSubTask : function(data)
		{
			var self = this;
			var li = document.createElement('li');
			var id = data.guid || Utils.guid();
			id = id.toLowerCase();
			li.id = id;	
			
			var dataAux = 
				{
				client : this.client
				,persisted : true
				,dom:li
				,name :id
				,title:data.title
				,group:data.group || []
				,callback:this.callbackToInstance
				}
			var insTask = new this.instanceSubTaskType(dataAux);
			this.instances.push(insTask);
			var node = Y.one(this.container);
			node.prepend(li);
			
			
			
			/*
			Para que la nueva instancia agregada sea un Target tambien
			*/
			this.del.syncTargets();
			
			return insTask.name;
		},
		
		createTask:function()
		{
			var self = this;
			var data = self._retrieveTaskInfo();
			self.client.sendSignal(self._subscribePath(), data);
			var data =
			{
			icon:'./css/images/task-list.png'
			,title:'Task Creator'
			,content:'A new task has been created'	
			}
			self.notification.notify(data,'simple');
			return true
		},
	  
		_retrieveTaskInfo: function()
		{
			var node = Y.one('#divCreatorTask');
			var nodeTitle = node.one('.selector_title');
			
			var data =
			{
				title : nodeTitle.get('value')
				,guid : Utils.guid()
				,status : 'add'
				,owner : this.client.guid
				,subTasks : this.subTasksInfo
			}
			
			return data;
		},
	  
		_subscribePath : function()
		{
			return '/channel/Tasks'
		}
	});

	Y.namespace("ModuleTask").TaskCreator = TaskCreator;

}, "1.0", {requires:['genericdivanimationcontainer','subtaskcreator','subtaskdefiner','subtaskactivity','notification']});