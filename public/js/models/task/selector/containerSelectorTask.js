function ContainerSelectorTask(data)
{
	this.client = data.client;
	this.allTasks = [];
	this.container = data.container;
	this.subscriptions = [];
	this.Y = null;			//Ambiente de Yui
	this.init();
	this.prefixIdTask = 'circle_';
}

ContainerSelectorTask.prototype.init = function()
{
    //this.createContainer();
    //this.addEventClick();
    this.addSubscriptions();
    
}

ContainerSelectorTask.prototype.reload = function(tasks)
{
	var self = this;
	$(this.container).empty();
	this.allTasks = [];
	if(tasks)
	{
		_.each(tasks, function(task) {
				self.addTask(task);
		  });
	}
	//retrieve all tasks
	else
	{
		// Download Tasks
		$.getJSON('/room/Tasks/tasks.json', function(data) {
			_.each(data.tasks, function(task) {
				self.addTask(task);
			});
		})
	}
}

ContainerSelectorTask.prototype.addSubscriptions = function()
{
	var self = this;
//suscribirse a la edicion de Tasks
	self.subscriptions.push(self.client.subscribe(self.subscribePath(), function(task) {
		if (task.status == 'add')
			self.addTask(task);
		else if (circle.status == 'delete')
			self.removeTask(task);

	}));
	
	self.reload();
}

ContainerSelectorTask.prototype.subscribePath = function()
{
	return '/channel/circles/circle';
}
/*
	Crea el contenedor y lo deja como un elemento drop.
	Indica que todos los elementos 'li' dentro del contenedor son elementos drag
*/
//TODO
ContainerSelectorTask.prototype.createContainer = function()
{
	var self = this;
	//Use loader to grab the modules needed
	YUI().use('dd-constrain', 'dd-proxy', 'dd-drop','anim','dd-plugin', 'dd-delegate','dd-drop-plugin', function(Y)
	{ 
		//Setup some private variables..
		var goingUp = false, lastY = 0, trans = {};

		var elementsContainer = Y.one('#play ul');
		var del = new Y.DD.Delegate({
			container: elementsContainer
			,nodes: 'li'
			,target: true
		});
		del.dd.plug(Y.Plugin.DDProxy,
			{
			moveOnEnd: false
			,borderStyle: 'none'
			});
		del.dd.plug(Y.Plugin.DDConstrained,
			{
			constrain2node: elementsContainer
			});
		del.dd.addHandle('.drag');
		
		
		//Create simple targets for the 2 lists.
		var uls = Y.Node.all('#play ul');
		uls.each(function(v, k)
		{
			var tar = new Y.DD.Drop({node: v});
		});
		

		//Listen for all drop:over events
		Y.DD.DDM.on('drop:over', function(e)
		{
			//Get a reference to our drag and drop nodes
			var drag = e.drag.get('node'),
			drop = e.drop.get('node');
			if(!drop)
				alert("error");

			//Are we dropping on a li node?
			var tagName = drop.get('tagName').toLowerCase();
			var parentClassName = drop.get('parentNode').get('className');
			if (tagName === 'li' && parentClassName !== 'instanceContainer')
			{
				//Are we not going up?
				if (!goingUp)
				{
					drop = drop.get('nextSibling');
				}
				//Add the node to this list
				e.drop.get('node').get('parentNode').insertBefore(drag, drop);
				//Resize this nodes shim, so we can drop on it later.
				e.drop.sizeShim();
			}
			else if (drop.get('tagName').toLowerCase() !== 'li')
			{
				var str = drop.get('tagName').toLowerCase();
				var bool = drop.contains(drag);
				if (!bool)
				{
					drop.appendChild(drag);
					Y.Lang.later(50, Y, function()
					{
						Y.DD.DDM.syncActiveShims(true);
					});
				}
			}
			del.syncTargets();
		});
		
		//Listen for all drag:drag events
		del.on('drag:drag', function(e)
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
		del.on('drag:start', function(e)
		{
			var drag = e.target;
			if (drag.target)
			{
				drag.target.set('locked', true);
			}
			var dragAux = drag.get('dragNode');
			drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
			drag.get('dragNode').setStyle('opacity','.5');
			drag.get('node').one('div.mod').setStyle('visibility', 'hidden');
			drag.get('node').addClass('moving');
		});
		//Listen for a drag:end events
		del.on('drag:end', function(e)
		{
			var drag = e.target;
			if(drag.target)
			{
				drag.target.set('locked', false);
			}
			drag.get('node').setStyle('visibility', '');
			drag.get('node').one('div.mod').setStyle('visibility', '');
			drag.get('node').removeClass('moving');
			drag.get('dragNode').set('innerHTML', '');
		});
		
		//Listen for all drag:drophit events
		del.on('drag:drophit', function(e)
		{
			var drop = e.drop.get('node'),
			drag = e.drag.get('node');

			//if we are not on an li, we must have been dropped on a ul
			if(drop.get('tagName').toLowerCase() !== 'li')
			{
				if(!drop.contains(drag))
				{
					drop.appendChild(drag);
				}
			}
		});
		
		Y.namespace('mynamespace');

		Y.mynamespace.syncTargets = function()
		{
			del.syncTargets();
		};
		self.Y=Y;
		
		  self.addSubscriptions();
	});
	
}
//TODO
ContainerSelectorTask.prototype.addEventClick = function()
{
	/*
	agregar evento click para addButton
	*/
	var self = this;
	var taskAdd = $('#circleAdd');
	taskAdd.bind('click', function(e)
	{
		var circleCreator = new CircleCreator(
			{
			client:self.client
			,function:
				{
				click:function(data)
					{
					self.client.sendSignal(self.subscribePath(), data);
					}
				}
			});
	});
}

/*
	Eliminar una task
*/
//TODO
ContainerSelectorTask.prototype.removeTask = function()
{
	var data = 
		{
		id:this.guid
		,status:'remove'
		}
		
	this.client.sendSignal(data);
}

ContainerSelectorTask.prototype.addTask = function(data)
{
	var div = document.createElement('div');
	var guid = data.guid || Utils.guid()
	div.className = "selectorTask gButton";
	div.id = guid;	
	data.client = this.client;
	
	data.dom = div;
	data.guid = guid;
	
	var selectedTask = new SelectedTask(data);
	this.allTasks.push(selectedTask);
	this.container.appendChild(div);
	/*
	Para que el nuevo elemento agregado sea un Target tambien
	*/
	//this.Y.mynamespace.syncTargets();
}

ContainerSelectorTask.prototype.getTask = function(guid)
{
	var self = this;
	var task = _.detect(self.allTasks, function(s) { return s.guid == guid });
	
	return task.to_json();
}