YUI.add("activity-designer", function(Y)
{

   
	var Lang = Y.Lang;


	function ActivityDesigner(config)
	{
		ActivityDesigner.superclass.constructor.apply(this, arguments);
	}


	ActivityDesigner.NAME = "activityDesigner";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ActivityDesigner.ATTRS =
	{

	        client:
			{
			value:null
			}
		,allModules:
			{
			value:[]	
			}
		,peopleSelected:
			{
			value:[]
			}
		,tasksSelected:
			{
			value:[]
			}
		,currentCircle:
			{
			value:null
			}
		,stringContainerSelectorTaskDOM:
			{
			value:null
			,readOnly: true
			}
		,stringPeopleContainerDOM:
			{
			value:null
			,readOnly: true
			}
		,stringCircleContainerDOM:
			{
			value:null
			,readOnly: true
			}
		,stringSpecialCircleContainerDOM:
			{
			value:null
			,readOnly: true
			}
		,containerSelectorTaskDOM:
			{
			value:null
			,readOnly: true
			}
		,peopleContainerDOM:
			{
			value:null
			,readOnly: true
			}
		,circleContainerDOM:
			{
			value:null
			,readOnly: true
			}
		,specialCircleContainerDOM:
			{
			value:null
			,readOnly: true
			}
		,prefixIdTask:
			{
			value:''
			,readOnly: true
			}
		,start:
			{
			value:false
			}
		,delTasks:
			{
			value:null
			}
		,delUsers:
			{
			value:null
			}
		,delCircles:
			{
			value:null
			}
		,containerCircle:
			{
			value:null
			}
		,containerSpecialCircle:
			{
			value:null
			}
		,peopleContainer:
			{
			value:null
			}
		,containerSelectorTask:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(ActivityDesigner, Y.Base,
	{

		initializer: function(data)
		{
			var self = this;
			this.stringContainerSelectorTaskDOM = 'containerSelectorTask';
			this.stringPeopleContainerDOM = 'peopleContainer';
			this.stringCircleContainerDOM = 'circleContainer';
			this.stringSpecialCircleContainerDOM = 'specialCircleContainer';
			this.prefixIdTask = 'task_';
			
			this.containerSelectorTaskDOM = document.getElementById(this.stringContainerSelectorTaskDOM);
			this.peopleContainerDOM = document.getElementById(this.stringPeopleContainerDOM);
			this.circleContainerDOM = document.getElementById(this.stringCircleContainerDOM);
			this.specialCircleContainerDOM = document.getElementById(this.stringSpecialCircleContainerDOM);
			
			this.peopleSelected = [];
			this.tasksSelected = [];
			
			this.client = data.client;
			
			this.containerCircle = new Y.ModuleContainerCircle.NormalContainerCircle(
			{
				client:newsketcherClient
				,container:this.circleContainerDOM
				,callback: 
				{
					click : function(circle)
					{
						self._onClickCircles(circle);	
					}
					,update: function()
					{
						self._syncTargets && self._syncTargets();	
					}
				}
			});
			this.containerSpecialCircle = new Y.ModuleContainerCircle.SpecialContainerCircle(
			{
				client:newsketcherClient
				,container:this.specialCircleContainerDOM
				,callback: 
				{
					click : function(circle)
					{
						self._onClickCircles(circle);	
					}
					,update: function()
					{
						self._syncTargets && self._syncTargets();	
					}
					
				}
			});
			this.peopleContainer = new Y.ModulePeopleContainer.PeopleContainer(
			{
				client:newsketcherClient
				,container:this.peopleContainerDOM
				,callback:
				{
					click: function(selected,guid)
					{
						self._multiPeopleSelected(selected,guid);	
					}
					,update: function()
					{
						self._syncTargets && self._syncTargets();	
					}
				}
			});
			this.containerSelectorTask = new Y.ModuleContainerSelectorTask.ContainerSelectorTask(
			{
				client:newsketcherClient
				,dom:this.containerSelectorTaskDOM
				,callback:
				{
					click: function(selected,guid)
					{
						self._multiTasksSelected(selected,guid);		
					}
					,update: function()
					{
						self._syncTargets && self._syncTargets();	
					}
				}
			});
			this._createDesigner();
		},

		destructor : function()
		{
// 		    this.containerCircle.destructor();
// 		    this.peopleContainer.destructor();
// 		    this.containerSelectorTask.destructor();

		},

		/* MyComponent specific methods */

		subscribePath : function(zone)
		{
		    return '/room/' + zone;
		},

		_multiPeopleSelected : function(selected, guid)
		{
			if(selected)
				this.peopleSelected.push(this.peopleContainer.getPerson(guid).to_json());
			else
			{
				var person = _.detect(this.peopleSelected, function(s) { return s.guid == guid });
				if (person)
					this.peopleSelected = _.without(this.peopleSelected, person);
			}
		},

		_multiTasksSelected : function(selected, guid)
		{
			if(selected)
				this.tasksSelected.push(this.containerSelectorTask.getTask(guid).to_json());
			else
			{
				var task = _.detect(this.tasksSelected, function(s) { return s.guid == guid });
				if (task)
					this.tasksSelected = _.without(this.tasksSelected, task);
			}
		},
		
		_createDesigner : function()
		{
			var self = this;
			var taskElements = Y.one('#'+self.stringContainerSelectorTaskDOM);
			this.delTasks = new Y.DD.Delegate({
				container: taskElements
				,nodes: 'div'
				,target: false
			});
			this.delTasks.dd.plug(Y.Plugin.DDProxy,
				{
				moveOnEnd: false
				,borderStyle: 'none'
				});
			this.delTasks.dd.addHandle('.drag');
			
			var userElements = Y.one('#'+self.stringPeopleContainerDOM);
			this.delUsers = new Y.DD.Delegate({
				container: userElements
				,nodes: 'div.people'
				,target: false
			});
			this.delUsers.dd.plug(Y.Plugin.DDProxy,
				{
				moveOnEnd: false
				,borderStyle: 'none'
				});
			
			var circlesElements = Y.one('#'+self.stringCircleContainerDOM);
			this.delCircles = new Y.DD.Delegate({
				container: circlesElements
				,nodes: 'div.selected_circle'
				,target: true
			});
			this.delCircles.dd.plug(Y.Plugin.DDProxy,
				{
				moveOnEnd: false
				,borderStyle: 'none'
				});
			this.delCircles.dd.addHandle('.dragHidden');
			
			var specialCirclesElements = Y.one('#'+self.stringSpecialCircleContainerDOM);
			this.delSpecialCircles = new Y.DD.Delegate({
				container: specialCirclesElements
				,nodes: 'div.selected_circle'
				,target: true
			});
			this.delSpecialCircles.dd.plug(Y.Plugin.DDProxy,
				{
				moveOnEnd: false
				,borderStyle: 'none'
				});
			this.delSpecialCircles.dd.addHandle('.dragHidden');
			
			var trash = new Y.DD.Drop(
			{
			    node: '#trash'
			});
			
			trash.on('drop:enter', function(e)
			{
				var node = e.target.get('node');
				node.addClass('trashOver');
			});
			
			trash.on('drop:exit', function(e)
			{
				var node = e.target.get('node');
				node.removeClass('trashOver');
			});
			
			this.delCircles.on('drop:enter',function(e)
			{
				var node = e.target.get('node');
				node.addClass('background_selected_circle');
			});
	
			this.delCircles.on('drop:exit',function(e)
			{
				var node = e.target.get('node');
				node.removeClass('background_selected_circle');
			});
			
			this.delCircles.on('drop:hit',function(e)
			{
				var node = e.target.get('node');
				node.removeClass('background_selected_circle');
			});
			
			//Listen for all drop:over events
			Y.DD.DDM.on('drop:hit', function(e)
			{
				//Get a reference to our drag and drop nodes
				var drag = e.drag.get('node');
				var drop = e.drop.get('node');
				if(!drop)
					alert("error");

				var fatherId = drag.get('parentNode').get('id');
				var dropFatherId = drop.get('parentNode').get('id');
				var guid = drag.get('id');
				var dropId = drop.get('id');
				var guidCircle = dropId;
				if(dropId == "trash")
				{
					if(drag.hasClass('dragTask'))
					{
						_.each(self.tasksSelected, function(task)
						{
							self.containerCircle.removeTaskFromCircle(task,self.currentCircle);
						});
						self.tasksSelected = [];
					}
					else if(fatherId == self.stringPeopleContainerDOM)
					{
						_.each(self.peopleSelected, function(person)
						{
							self.containerCircle.removePersonFromCircle(person,self.currentCircle);
						});
						self.peopleSelected = [];
					}
					drop.removeClass('trashOver');
				}
				/*
				 * un special circle es el drop
				 */
				else if(dropFatherId == self.stringSpecialCircleContainerDOM)
				{
					if(drag.hasClass('dragTask'))
					{
						_.each(self.tasksSelected, function(task)
						{
							self.containerSpecialCircle.addTaskToCircle(task,guidCircle);
						});
					}
					else if(fatherId == self.stringPeopleContainerDOM)
					{
						_.each(self.peopleSelected, function(person)
						{
							self.containerSpecialCircle.addPersonToCircle(person,guidCircle);
						});
						
					}	
				}
				/*
				 * un circle es el drop
				 */
				else if(drag.hasClass('dragTask'))
				{
					_.each(self.tasksSelected, function(task)
					{
						self.containerCircle.addTaskToCircle(task,guidCircle);
					});
				}
				else if(fatherId == self.stringPeopleContainerDOM)
				{
					_.each(self.peopleSelected, function(person)
					{
						self.containerCircle.addPersonToCircle(person,guidCircle);
					});
					
				}
			});
			
			//Listen for all drag:start events
			this.delTasks.on('drag:start', function(e)
			{
				var target = e.target;
				var node = target.get('node');
				var parentNode = node.get('parentNode').get('parentNode').get('parentNode');
				var drag = target.get('dragNode');
				self._addTaskAndSelect(parentNode.get('id'));
				
				if (target.target)
				{
					target.target.set('locked', true);
				}
				var dragAux = drag.get('dragNode');
				drag.addClass('dragTasks');
				self.delTasks.syncTargets();
				self.delUsers.syncTargets();
			});
			//Listen for a drag:end events
			this.delTasks.on('drag:end', function(e)
			{
				var target = e.target;
				var node = target.get('node');
				var drag = target.get('dragNode');
				if(target.target)
				{
					target.target.set('locked', false);
				}
				node.setStyle('visibility', '');
				drag.removeClass('dragTasks');
				drag.set('innerHTML', '');
			});
			
			//Listen for all drag:drophit events
			this.delTasks.on('drag:drophit', function(e)
			{
				var drop = e.drop.get('node'),
				drag = e.drag.get('node');

			});
			
			//Listen for all drag:start events
			this.delUsers.on('drag:start', function(e)
			{
				var target = e.target;
				var node = target.get('node');
				var drag = target.get('dragNode');
				self._addPersonAndSelect(node.get('id'));
				
				if (target.target)
				{
					target.target.set('locked', true);
				}
				var dragAux = drag.get('dragNode');
				drag.addClass('dragPeople');
			});
			//Listen for a drag:end events
			this.delUsers.on('drag:end', function(e)
			{
				var target = e.target;
				var node = target.get('node');
				var drag = target.get('dragNode');
				if(target.target)
				{
					target.target.set('locked', false);
				}
				node.setStyle('visibility', '');
				drag.removeClass('dragPeople');
				drag.set('innerHTML', '');
			});
			
			//Listen for all drag:drophit eventsmilaalvarobalumamapapa
			this.delUsers.on('drag:drophit', function(e)
			{
				var drop = e.drop.get('node'),
				drag = e.drag.get('node');

			});
			
			//click events

	
			
			
			Y.one('#closeCircleDefinition').on('click', function(e)
			{
				self._onCloseCircleDefinition();
			});
			
			self._onCloseCircleDefinition();
		},
		
		_unSelect : function()
		{
			this.tasksSelected = [];
			this.peopleSelected = [];
			
		},
		
		_onClickCircles : function(circle)
		{
			this.peopleContainer.reload(circle.people);
			this.containerSelectorTask.reload(circle.tasks);
			Y.one('#closeCircleDefinition').set('innerHTML',circle.name);
			Y.one('#closeCircleDefinition').setAttribute("style", "visibility:");
			Y.one('#trash').addClass('trash');
			this.currentCircle = circle.guid;
			this._unSelect();
			this._syncTargets();
		},
	  
		_onCloseCircleDefinition : function()
		{
			Y.one('#closeCircleDefinition').setAttribute("style", "visibility:hidden");
			this.peopleContainer.reload();
			this.containerSelectorTask.reload();
			this.currentCircle = null;
			this._unSelect();
			this._syncTargets();
			Y.one('#trash').removeClass('trash');
		},
	  
		_syncTargets : function()
		{
			this.delTasks.syncTargets();
			this.delUsers.syncTargets();
			this.delCircles.syncTargets();
		},
		
		_addPersonAndSelect : function(guid)
		{
			this._multiPeopleSelected(true,guid)
			var person = this.peopleContainer.getPerson(guid);
			if(!person.selected)
				person.clickEvent();
			
		},
	  
		_addTaskAndSelect : function(guid)
		{
			this._multiTasksSelected(true,guid)
			var task = this.containerSelectorTask.getTask(guid);
			if(!task.selected)
				task.clickEvent();
			
		}
	});
	Y.namespace("NewSketcher").ActivityDesigner = ActivityDesigner;

}, "1.0", {requires:['base','normalcontainercircle','specialcontainercircle','peoplecontainer','containerselectortask','dd-constrain', 'dd-proxy', 'dd-drop','anim','dd-plugin', 'dd-delegate','dd-drop-plugin','node']});