function ContainerSelectorTask(data)
{
	this.client = data.client;
	this.allTasks = [];
	this.container = data.container;
	this.clicked = data.clicked; 
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
	data.clicked = this.clicked;
	
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