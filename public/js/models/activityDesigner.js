function ActivityDesigner(data)
{
	this.client = data.client;
	this.allModules = [];
	this.stringContainerSelectorTaskDOM = 'containerSelectorTask';
	this.stringPeopleContainerDOM = 'peopleContainer';
	this.stringCircleContainerDOM = 'circleContainer';
	this.containerSelectorTaskDOM = document.getElementById(this.stringContainerSelectorTaskDOM);
	this.peopleContainerDOM = document.getElementById(this.stringPeopleContainerDOM);
	this.circleContainerDOM = document.getElementById(this.stringCircleContainerDOM);
	this.subscriptions = [];
	this.Y = null;			//Ambiente de Yui
	this.init();
	this.prefixIdTask = 'task_';
	this.start = false;		//inicio la actividad
}

ActivityDesigner.prototype.init = function()
{
	//this.addEventClick();
    
	this.containerCircle = new ContainerCircle(
	{
		client:mapSketcherClient
		,container:this.circleContainerDOM
	});
	this.peopleContainer = new PeopleContainer(
	{
		client:mapSketcherClient
		,container:this.peopleContainerDOM
	});
	this.containerSelectorTask = new ContainerSelectorTask(
	{
		client:mapSketcherClient
		,container:this.containerSelectorTaskDOM
	});
	this.createDesigner();
			
}

ActivityDesigner.prototype.subscribePath = function(zone)
{
	return '/room/' + zone;
}
/*
	Crea el contenedor y lo deja como un elemento drop.
	Indica que todos los elementos 'li' dentro del contenedor son elementos drag
*/
ActivityDesigner.prototype.createDesigner = function()
{
	var self = this;
	//Use loader to grab the modules needed
	YUI().use('dd-constrain', 'dd-proxy', 'dd-drop','anim','dd-plugin', 'dd-delegate','dd-drop-plugin','node', function(Y)
	{ 
		//Setup some private variables..
		var goingUp = false, lastY = 0, trans = {};

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
			}
			else if(fatherId == self.stringPeopleContainerDOM)
			{
				var personJson = self.peopleContainer.getPerson(guid);
				self.containerCircle.addPersonToCircle(personJson,guidCircle);
			}
		});
		
		//Listen for all drag:drag events
		delTasks.on('drag:drag', function(e)
		{
			//Get the last y point
			var y = e.target.lastXY[1];
			//is it greater than the lastY var?
			if(y < lastY)
			{
				//We are going up
				goingUp = true;
			}
			else
			{
				//We are going down.
				goingUp = false;
			}
			//Cache for next check
			lastY = y;
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
		
		
		
		//Listen for all drag:drag events
		delUsers.on('drag:drag', function(e)
		{
			//Get the last y point
			var y = e.target.lastXY[1];
			//is it greater than the lastY var?
			if(y < lastY)
			{
				//We are going up
				goingUp = true;
			}
			else
			{
				//We are going down.
				goingUp = false;
			}
			//Cache for next check
			lastY = y;
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

		var _onClickCircles = function(e)
		{
			var circleGuid = this.get('id');
			var circle = self.containerCircle.getCircle(circleGuid);
			self.peopleContainer.reload(circle.people);
			self.containerSelectorTask.reload(circle.tasks);
		};
		Y.one('#'+self.stringCircleContainerDOM).delegate('click', _onClickCircles, 'div.outer_circle');

		
		
		
		
		Y.namespace('mynamespace');

		Y.mynamespace.syncTargets = function()
		{
			delTasks.syncTargets();
			delUsers.syncTargets();
			delCircles.syncTargets();
		};
		self.Y=Y;
	});
	
}

ActivityDesigner.prototype.addEventClick = function()
{
	/*
	agregar evento click para addButton
	*/
	var self = this;
	var taskAdd = $('#taskAdd');
	taskAdd.bind('click', function(e)
	{
		var taskCreator = new TaskCreator(
			{
			client:self.client
			,function:
				{
				click:function(data)
					{
					self.client.sendSignal(self.subscribePath('Tasks'), data);
					}
				}
			});
	});
}

/*
	Eliminar una task
*/
ActivityDesigner.prototype.removeTask = function()
{
	var data = 
		{
		id:this.guid
		,status:'remove'
		}
		
	this.client.sendSignal(data);
}

ActivityDesigner.prototype.joinTask = function(data)
{
	var li = document.createElement('li');
	var id = data.id || Utils.guid()
	li.className = "item";
	li.id = id;	
	data.client = this.client;
	
	data.li = li;
	data.id = id;
	
	var mod = new ModuleTask(data);
	this.allModules.push(mod);
	this.container.appendChild(li);
	/*
	Para que el nuevo elemento agregado sea un Target tambien
	*/
	this.Y.mynamespace.syncTargets();
}