/*
 * Esta clase extiende de containerTask
 */
function ContainerTaskLeader(data)
{
	this.client = data.client;
	this.allModules = [];
	this.container = document.getElementById('list1');
	this.subscriptions = [];
	this.Y = null;			//Ambiente de Yui
	this.init();
	this.prefixIdTask = 'task_';
}
/*
 * Extender de la clase ContainerTask
 */
ContainerTaskLeader.prototype = new ContainerTask();

ContainerTaskLeader.prototype.addSubscriptions = function()
{
	var self = this;
//suscribirse a la edicion de Tasks
	self.subscriptions.push(self.client.subscribe(self.subscribePath('Tasks'), function(task) {
		if (task.status == 'join')
			self.joinTask(task);
		else if (data.status == 'delete')
			self.removeTask(task);

	}));
	
// Download previos Tasks
	$.getJSON('/room/Tasks/tasks.json', function(data) {
		_.each(data.tasks, function(task) {
			self.joinTask(task);
		});
	})	
}

ContainerTaskLeader.prototype.isMyTask = function(task)
{
	var self = this;
	_.each(task.group, function(idUser) {
		if(idUser == self.client.guid)
			return true;
	});
	return false;
}
ContainerTaskLeader.prototype.addMyTask = function(task)
{
	if(this.isMyTask(task))
		return this.joinTask(task)
}