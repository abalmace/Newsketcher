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
		,prefixIdTask:
			{
			value:''
			,readOnly: true
			}
		,start:
			{
			value:false
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
			this.prefixIdTask = 'task_';
			
			this.containerSelectorTaskDOM = document.getElementById(this.stringContainerSelectorTaskDOM);
			this.peopleContainerDOM = document.getElementById(this.stringPeopleContainerDOM);
			this.circleContainerDOM = document.getElementById(this.stringCircleContainerDOM);
			
			this.peopleSelected = [];
			this.tasksSelected = [];
			
			this.client = data.client;
			
			this.containerCircle = new Y.ModuleContainerCircle.ContainerCircle(
			{
				client:mapSketcherClient
				,container:this.circleContainerDOM
			});
			this.peopleContainer = new Y.ModulePeopleContainer.PeopleContainer(
			{
				client:mapSketcherClient
				,container:this.peopleContainerDOM
				,clicked: function(selected,guid)
				{
					self._multiPeopleSelected(selected,guid);	
				}
			});
			this.containerSelectorTask = new Y.ModuleContainerSelectorTask.ContainerSelectorTask(
			{
				client:mapSketcherClient
				,container:this.containerSelectorTaskDOM
				,clicked: function(selected,guid)
				{
					self._multiTasksSelected(selected,guid);	
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
				this.peopleSelected.push(this.peopleContainer.getPerson(guid));
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
				this.tasksSelected.push(this.containerSelectorTask.getTask(guid));
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
			var delTasks = new Y.DD.Delegate({
				container: taskElements
				,nodes: 'div'
				,target: false
			});
			delTasks.dd.plug(Y.Plugin.DDProxy,
				{
				moveOnEnd: false
				,borderStyle: 'none'
				});
			
			var userElements = Y.one('#'+self.stringPeopleContainerDOM);
			var delUsers = new Y.DD.Delegate({
				container: userElements
				,nodes: 'div'
				,target: false
			});
			delUsers.dd.plug(Y.Plugin.DDProxy,
				{
				moveOnEnd: false
				,borderStyle: 'none'
				});
			
			var circlesElements = Y.one('#'+self.stringCircleContainerDOM);
			var delcircles = new Y.DD.Delegate({
				container: circlesElements
				,nodes: 'div.outer_circle'
				,target: true
			});
			delcircles.dd.plug(Y.Plugin.DDProxy,
				{
				moveOnEnd: false
				,borderStyle: 'none'
				});
			delcircles.dd.addHandle('.dragHidden');
			
			
			//Listen for all drop:over events
			Y.DD.DDM.on('drop:hit', function(e)
			{
				//Get a reference to our drag and drop nodes
				var drag = e.drag.get('node'),
				drop = e.drop.get('node');
				if(!drop)
					alert("error");

				var fatherId = drag.get('parentNode').get('id');
				var guid = drag.get('id');
				var guidCircle = drop.get('id');
				if(fatherId == self.stringContainerSelectorTaskDOM)
				{
					var taskJson = self.containerSelectorTask.getTask(guid);
					self.containerCircle.addTaskToCircle(taskJson,guidCircle);
					_.each(self.tasksSelected, function(task)
					{
						self.containerCircle.addTaskToCircle(task,guidCircle);
					});
					self.tasksSelected = [];
				}
				else if(fatherId == self.stringPeopleContainerDOM)
				{
					var personJson = self.peopleContainer.getPerson(guid);
					self.containerCircle.addPersonToCircle(personJson,guidCircle);
					_.each(self.peopleSelected, function(person)
					{
						self.containerCircle.addPersonToCircle(person,guidCircle);
					});
					self.peopleSelected = [];
					
				}
			});
			
			//Listen for all drag:start events
			delTasks.on('drag:start', function(e)
			{
				var target = e.target;
				var node = target.get('node');
				var drag = target.get('dragNode');
				if (target.target)
				{
					target.target.set('locked', true);
				}
				var dragAux = drag.get('dragNode');
				drag.set('innerHTML', node.get('innerHTML'));
				drag.setStyle('opacity','.9');
				drag.addClass('selectorTask gButton');
				delTasks.syncTargets();
				delUsers.syncTargets();
			});
			//Listen for a drag:end events
			delTasks.on('drag:end', function(e)
			{
				var target = e.target;
				var node = target.get('node');
				var drag = target.get('dragNode');
				if(target.target)
				{
					target.target.set('locked', false);
				}
				node.setStyle('visibility', '');
				drag.removeClass('selectorTask gButton');
				drag.set('innerHTML', '');
			});
			
			//Listen for all drag:drophit events
			delTasks.on('drag:drophit', function(e)
			{
				var drop = e.drop.get('node'),
				drag = e.drag.get('node');

			});
			
			//Listen for all drag:start events
			delUsers.on('drag:start', function(e)
			{
				var target = e.target;
				var node = target.get('node');
				var drag = target.get('dragNode');
				if (target.target)
				{
					target.target.set('locked', true);
				}
				var dragAux = drag.get('dragNode');
				drag.set('innerHTML', node.get('innerHTML'));
				drag.setStyle('opacity','.9');
				drag.addClass('selectorTask gButton');
			});
			//Listen for a drag:end events
			delUsers.on('drag:end', function(e)
			{
				var target = e.target;
				var node = target.get('node');
				var drag = target.get('dragNode');
				if(target.target)
				{
					target.target.set('locked', false);
				}
				node.setStyle('visibility', '');
				drag.removeClass('selectorTask gButton');
				drag.set('innerHTML', '');
			});
			
			//Listen for all drag:drophit eventsmilaalvarobalumamapapa
			delUsers.on('drag:drophit', function(e)
			{
				var drop = e.drop.get('node'),
				drag = e.drag.get('node');

			});
			
			//click events

	
			Y.one('#'+self.stringCircleContainerDOM).delegate('click', function(e)
			{
				self._onClickCircles(this.get('id'));	
			}
			,'div.outer_circle');
			
			Y.one('#closeCircleDefinition').on('click', function(e)
			{
				self._onCloseCircleDefinition();
			});
			
			
			Y.namespace('mynamespace');

			Y.mynamespace.syncTargets = function()
			{
				delTasks.syncTargets();
				delUsers.syncTargets();
				delCircles.syncTargets();
			};
			self.Y=Y;
		},
		
		_onClickCircles : function(circleGuid)
		{
			var circle = this.containerCircle.getCircle(circleGuid);
			this.peopleContainer.reload(circle.people);
			this.containerSelectorTask.reload(circle.tasks);
			Y.one('#closeCircleDefinition').set('innerHTML',circle.name);
			Y.one('#closeCircleDefinition').setAttribute("style", "visibility:");
		},
	  
		_onCloseCircleDefinition : function()
			{
				Y.one('#closeCircleDefinition').setAttribute("style", "visibility:hidden");
				this.peopleContainer.reload();
				this.containerSelectorTask.reload();
			}
	});
	Y.namespace("NewSketcher").ActivityDesigner = ActivityDesigner;

}, "1.0", {requires:['base','containercircle','peoplecontainer','containerselectortask','dd-constrain', 'dd-proxy', 'dd-drop','anim','dd-plugin', 'dd-delegate','dd-drop-plugin','node']});