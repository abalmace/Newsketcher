YUI.add("showtask", function(Y)
{ 
	var Lang = Y.Lang;


	function ShowTask(data)
	{
		ShowTask.superclass.constructor.apply(this, arguments);
	}

	ShowTask.NAME = "showTask";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ShowTask.ATTRS =
	{
		client:
			{
			value:null
			}
		,name:
			{
			value:null	
			}
		,li:
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
		,callback:
			{
			value:null
			}
		,container:
			{
			value:null
			}
		,elementContainer:
			{
			value:[]
			}	
		,visibility:
			{
			value:false
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(ShowTask, Y.Base,
	{
		initializer: function(data)
		{
			this.client = data.client;	//cliente
			this.guid = data.guid;
			this.li = data.li;		//elemento html que representa al módulo
			this.name = data.name;
			this.people = data.people;	//integrantes del circle
			this.callback = data.callback;
			this.container = Y.one('#div_containerSelectorInfoTask');
			this.elementContainer = [];
			
			this._retrieveTaskInformation();
			this._cleanMapArea();

		this.publish("myEvent", {
		defaultFn: this._defMyEventFn,
		bubbles:false
		});
		},

		destructor : function()
		{
		
		},
	  
		_retrieveTaskInformation:function()
		{
			var self = this;
			Y.ModuleConnectionServer.getJSON('/channel/Task/'+this.guid+'/task.json',function(data)
			{
				self._createContainer(data.task[0]);
			});
		},

		_createContainer : function(data)
		{
			var self = this;
			var container =  self.container;
			container.setStyle('visibility', 'visible');
			var title = container.one('span.title');
			title.set('innerHTML',data.title);
			this._addObjetives(data.objetives);
			
			this._addSubTasks(data.subTasks);
			
			var btnStart = Y.one('#btn_start_task');
			btnStart.on('click', function(e)
			{
				if(self.callback && self.callback.click)
				{
					var activity =
					{
						guid : data.guid
						,title : data.title
						,type : data.type
						,people : self.people
						,subtasks : data.subtasks
					}
					self.callback.click(activity);
				}
				btnStart.detach();
			});
			
			
			var btnShow = Y.one('#btn_show_taskInfo');
			btnShow.on('click', function(e)
			{
				container.setStyle('visibility', 'visible');
				btnShow.setStyle('visibility', 'hidden');
			});
			
			var btnHide = Y.one('#btn_hide_taskInfo');
			btnHide.on('click', function(e)
			{
				container.setStyle('visibility', 'hidden');
				btnShow.setStyle('visibility', 'visible');
			});
		},
	  
		_addObjetives : function(objetives)
		{
			var containerObj = this.container.one('ul.objetives');
			containerObj.get('childNodes').remove()
			Y.each(objetives, function(objetive)
			{
				var li = document.createElement('li');
				li.innerHTML = objetive.description;
				containerObj.append(li);
			});
		},
		
		_addSubTasks : function(subTasks)
		{
			var self = this;
			var containerST = this.container.one('ul.subTasks');
			containerST.get('childNodes').remove()
			Y.each(subTasks, function(subTask)
			{
				var li = document.createElement('li');
				
				var data = 
				{
				dom:li
				,description: subTask.description
				,name: subTask.mapId
				,client:self.client
				}
 				var element = new Y.ModuleTask.ShowRoom(data); 
 				self.elementContainer.push(element);
				containerST.append(li);
			});
		}
		
		,_cleanMapArea:function()
		{
			this.client.activeRoom && this.client.activeRoom.setActive(false);
			this.client.activeRoom = null;
			
			var divMap = this.client.getWorkspaceMapDom();
			var node = Y.one(divMap);
			node.addClass('classBackgroundMap');
			
		}
	});

	Y.namespace("ModuleTask").ShowTask = ShowTask;

}, "1.0", {requires:['base','connectionserver','showroom']});