YUI.add("subtaskactivity", function(Y)
{ 
	var Lang = Y.Lang;


	function SubTaskActivity(data)
	{
		SubTaskActivity.superclass.constructor.apply(this, arguments);
	}


	SubTaskActivity.NAME = "subTaskActivity";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	SubTaskActivity.ATTRS =
	{
		client:
			{
			value:null
			}
		,name:
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
		,taskGuid:
			{
			value:null
			}
		,circleGuid:
			{
			value:null
			}
		,li:
			{
			value:null
			}
		,definitionSubTask:
			{
			value:null
			}
		,instanceSubTaskType:
			{
			value:null
			}
		,callbackToInstance:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(SubTaskActivity, Y.ModuleGeneric.GenericDivAnimationContainer,
	{
		initializer: function(data)
		{
			this.client = data.client;	//cliente
			this.guid = data.guid;
			this.taskGuid = data.taskGuid;
			this.circleGuid = data.circleGuid;
			this.li = data.li;	//elemento html que representa al módulo
			this.name = data.name;
			this.people = data.people;	//integrantes del circle	
			this.callback = data.callback;
			this.subscriptions = [];
			this.instances = [];
			
			this._createInstanceContainer();		
		},

		destructor : function()
		{
			var children = Y.one(this.container).get('children');
			
			children.each(function(node)
			{
				node.detach();
			});
		},
	  
		_createInstanceContainer : function()
		{
			var self = this;
			self.container = self._getContainer();
			var container = Y.one(self.container);
			
			this.del = new Y.DD.Delegate({
				container: container
				,nodes: 'li.instanceTask'
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
				dragFather = drag.get('parentNode');
				drop = e.drop.get('node'),
				dropFather = drop.get('parentNode');
				if(dragFather.compareTo(dropFather))
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
				drop.removeClass('insTaskOver');
			});
			
			var _dropHit = function(node, drop)
			{
				var nodeId = node.get('id');
				var dropId = drop.get('id');
				var nodeInstance = self._findInstanceTask(nodeId);
				var dropInstance = self._findInstanceTask(dropId);
				if(dropInstance)
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
				e.stopPropagation();
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
			return '/channel/' +this.circleGuid+'/'+this.guid+'/'+ 'instanceSubTasks';
		},
	  
		_joinInstanceSubTask : function(data)
		{
			var self = this;
			var li = document.createElement('li');
			li.className = "instanceTask";
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
		
		_removeInstanceSubTask : function(data)
		{
			var dom = document.getElementById(data.guid);
			var node = Y.one(dom);
			node.remove();

			var instance = _.detect(this.instances, function(s) { return s.guid == data.guid });
		
			if(instance)
			{
				this.instances = _.without(this.instances, instance);
				if(self.currentRoomId == data.guid)
				{
					self.openOtherRoom();
					room.stop();
				}
				return;
			}			
			
		},
	  
		_openRoom : function(roomName, array)
		{
			var room = _.detect(array, function(s) { return s.name == roomName });
			if(room)
			{
				room.setActive(true);
			}
		},

		/*
			Se utiliza cuando se elimina la room actualmente en uso.
			De esta manera se abre una room disponible.
		*/
		_openOtherRoom : function(array)
		{
			var self = this;
			
			if(array.length>0)
			{
				var room =array[array.length-1];
				self.openRoom(room.name,array);
				return;
			}
			if(array == self.rooms.personalRooms)
			{
				self.createNewPersonalRoom();
			}
			else
				self.openOtherRoom(self.rooms.personalRooms);
		}
	  
		
	});

	Y.namespace("ModuleTask").SubTaskActivity = SubTaskActivity;

}, "1.0", {requires:['genericdivanimationcontainer','connectionserver','definersubtaskactivity']});