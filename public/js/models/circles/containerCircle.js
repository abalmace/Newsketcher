function ContainerCircle(data)
{
	this.client = data.client;
	this.allCircles = [];
	this.container = data.container;
	this.subscriptions = [];
	this.Y = null;			//Ambiente de Yui
	this.init();
	this.prefixIdTask = 'circle_';
	this.activity ="Actividad1";
	
}

ContainerCircle.prototype.init = function()
{
    //this.createContainer();
    this.addSubscriptions();
    this.initCircleCreator();
    
}

ContainerCircle.prototype.addSubscriptions = function()
{
	var self = this;
//suscribirse a la edicion de Tasks
	self.subscriptions.push(self.client.subscribe(self.subscribePath(), function(circle) {
		if (circle.status == 'add')
			self.addCircle(circle);
		else if (circle.status == 'delete')
			self.removeCircle(circle);

	}));
	
// Download previos Tasks
	$.getJSON('/channel/'+self.activity+'/circles.json', function(data) {
		_.each(data.circles, function(circle) {
			self.addCircle(circle);
		});
	})	
}

ContainerCircle.prototype.subscribePath = function()
{
	return '/channel/circles/circle';
}

ContainerCircle.prototype.initCircleCreator = function()
{
	var self = this;
	YUI().use('modulecircle', function(Y)
	{
		var containerCircle = new Y.moduleCircle.CircleCreator({
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
ContainerCircle.prototype.removeTask = function()
{
	var data = 
		{
		id:this.guid
		,status:'remove'
		}
		
	this.client.sendSignal(data);
}

ContainerCircle.prototype.addCircle = function(data)
{
	var div = document.createElement('div');
	var guid = data.guid || Utils.guid()
	div.className = "outer_circle";
	div.id = guid;	
	data.client = this.client;
	
	data.dom = div;
	data.guid = guid;
	
	var circle = new Circle(data);
	this.allCircles.push(circle);
	this.container.appendChild(div);
	/*
	Para que el nuevo elemento agregado sea un Target tambien
	*/
	//this.Y.mynamespace.syncTargets();
}

ContainerCircle.prototype.addPersonToCircle = function(person,circleGuid)
{
	var circle = this.getCircle(circleGuid);
	if (circle)
	{
		circle.addPerson(person)
	}	
}

ContainerCircle.prototype.addTaskToCircle = function(task,circleGuid)
{
	var circle = this.getCircle(circleGuid);
	if (circle)
	{
		circle.addTask(task)
	}	
}

ContainerCircle.prototype.getCircle = function(circleGuid)
{
	return  _.detect(this.allCircles, function(s) { return s.guid == circleGuid });
}