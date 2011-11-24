YUI.add("subtaskui", function(Y)
{ 
	var Lang = Y.Lang;


	function SubTaskUI(data)
	{
		SubTaskUI.superclass.constructor.apply(this, arguments);
	}


	SubTaskUI.NAME = "subTaskUI";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	SubTaskUI.ATTRS =
	{
		client:
			{
			value:null
			}
		,name:
			{
			value:null	
			}
		,container:
			{
			value:null
			}
		,guid:
			{
			value:null
			}
		,people:
			{
			value:[]
			}
		,tasks:
			{
			value:[]	
			}
		,del:
			{
			value:null
			}
		,subscriptions:
			{
			value:[]
			}
		,instances:
			{
			value:[]
			}
		,instanceSubTaskCreator:
			{
			value:null
			}
		,activityWorkOut:
			{
			value:null
			}
		,taskGuid:
			{
			value:null
			}
		,circleGuid:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(SubTaskUI, Y.ModuleGeneric.GenericDivAnimation,
	{
		initializer: function(data)
		{
			this.client = data.client;	//cliente
			this.guid = data.guid;
			this.activityWorkOut = data.activityWorkOut;
			this.taskGuid = data.taskGuid;
			this.circleGuid = data.circleGuid;
			this.li = data.li;	//elemento html que representa al módulo
			this.name = data.name;
			this.people = data.people;	//integrantes del circle	
			this.callback = data.callback;
			this.subscriptions = [];
			this.instances = [];
			
			this._createInstanceContainer();
			this._addSubscriptions();
			this._addEventButtonAdd();
			//this._addCurrentInstances({primero:{title:"instances of this task",status:'join'},segundo:{title:"instances of this task...",status:'join'}});
			
			
		},

		destructor : function()
		{
		/*
		* destructor is part of the lifecycle introduced by 
		* the Base class. It is invoked when destroy() is called,
		* and can be used to cleanup instance specific state.
		*null
		* It does not need to invoke the superclass destructor. 
		* destroy() will call initializer() for all classes in the hierarchy.
		*/
		},
	  
		_addMySubTask : function(task)
		{
			task.textElement = task.title;
			task.title = null;
			var li = this._addElement(task);
			this._addEvent(li);
		},
	  
		_addCurrentInstances : function(instances)
		{
			var self = this;
			_.each(instances, function(instance)
			{
				self.client.sendSignal(self._subscribePath(), instance);
			});
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
			$.getJSON('/channel/'+ this.guid+'/'+this.client.guid+'/instanceSubTasks.json', function(data)
			{
				Y.Array.each(data.instanceSubTasks, function(info)
				{
					self._joinInstanceSubTask(info);
				});
			})
		},
	  
		_createInstanceContainer : function()
		{
			var self = this;
			self.container = self._getContainer();
			var container = Y.one(self.container);
			
			this.del = new Y.DD.Delegate({
				container: container
				,nodes: 'li'
				,target:true
			});
			var del = this.del;
			del.dd.plug(Y.Plugin.DDProxy,
				{
				moveOnEnd: false
				,borderStyle: 'none'
				});
			del.dd.plug(Y.Plugin.DDConstrained,
				{
				constrain2node: container
				});


			del.on('drop:over', function(e)
			{
				e.stopPropagation();
			});
			del.on('drop:enter', function(e)
			{
				//Get a reference to our drag and drop nodes
				var drag = e.drag.get('node'),
				drop = e.drop.get('node');
				drop.addClass("insTaskOver");
			});
			del.on('drop:exit', function(e)
			{
				var node = e.target.get('node');
				node.removeClass("insTaskOver");
			});
			
			
			//Listen for all drag:start events
			del.on('drag:start', function(e)
			{
				var target = e.target;
				var node = target.get('node');
				var drag = target.get('dragNode');
				if (target.target)
				{
					drag.target.set('locked', true);
				};
				
				drag.addClass('insTaskMoving');
				drag.set('offsetWidth', '10px');
				node.addClass('insTaskNode');	
			});
			
			del.on('drag:end', function(e)
			{
				var target = e.target;
				var node = target.get('node');
				var drag = target.get('dragNode');
				node.removeClass('insTaskNode');
				drag.removeClass('insTaskMoving');
			});
			del.on('drag:drophit', function(e)
			{
				var target = e.target;
				var node = target.get('node');
				var drag = e.drag.get('node');
				var drop = e.drop.get('node');
				_dropHit(node,drop);
				node.removeClass('insTaskOver');
			});
			
			var _dropHit = function(node, drop)
			{
				var nodeId = node.get('id');
				var dropId = drop.get('id');
				var nodeInstance = self._findInstanceTask(nodeId);
				var dropInstance = self._findInstanceTask(dropId);
				
				dropInstance.copyOverlays(nodeInstance);
			}
		},
	  
		_findInstanceTask : function(id)
		{
			id = id.toLowerCase();
			var instance = _.detect(this.instances, function(s) { return s.name === id });
			return instance;
		},
	  
		_addEvent : function(dom)
		{
			var self = this;
			var container = $(dom);
			container.bind('click',function (e)
			{
				self._handleClick(dom.id);	
			});
			
		},
	  
		_handleClick : function(guid)
		{
			var showDescription = new Y.ModuleTask.ShowTask(
			{
				container : this.li
				,guid:guid
				,callback : this.callback
			});
		},
	  
		_subscribePath : function()
		{
			return '/channel/' +this.guid+'/'+ 'instanceSubTasks';
		},
		
		_addEventButtonAdd : function()
		{
			var self = this;
			var li =jQuery(this.li);
			var add =li.find("div.instanceAdd");
			add.bind('click', function(e)
			{
				if(self.activityWorkOut.instanceSubTaskCreator)
					self.activityWorkOut.instanceSubTaskCreator.destroy();
				self.activityWorkOut.instanceSubTaskCreator = new Y.ModuleTask.InstanceSubTaskCreator(
					{
					client:self.client
					,people:self.people
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
			});
		},
	  
		_isMyInstance:function(data)
		{
			var guid = this.client.guid;
			var result = _.detect(data.group, function(s) { return s.guid == guid });
			if(result && result.selected)
				this._joinInstanceSubTask(data);
		},
	  
		_joinInstanceSubTask : function(data)
		{
			var li = document.createElement('li');
			li.className = "instanceTask";
			var id = data.guid || Utils.guid();
			li.id = id;	
			
			var dataAux = 
				{
				client : this.client
				,persisted : true
				,dom:li
				,name :id
				,title:data.title
				,group:data.group || []
				}
			var insTask = new Y.ModuleTask.InstanceSubTask(dataAux);
			this.instances.push(insTask);
			this.container.appendChild(li);
			
			
			
			/*
			Para que la nueva instancia agregada sea un Target tambien
			*/
			this.del.syncTargets();
			
			return insTask.name;
		},
		
		_removeInstanceSubTask : function()
		{
			
		}
	});

	Y.namespace("ModuleTask").SubTaskUI = SubTaskUI;

}, "1.0", {requires:['base','genericdivanimation','showtask','dd-constrain', 'dd-proxy', 'dd-delegate', 'node','instancesubtask','instancesubtaskcreator']});