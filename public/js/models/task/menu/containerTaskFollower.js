/*
 * Esta clase extiende de containerTask
 */
function ContainerTaskFollower(data)
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
ContainerTaskFollower.prototype = new ContainerTask();

ContainerTaskFollower.prototype.addSubscriptions = function()
{
	var self = this;
//suscribirse a la edicion de Tasks
	self.subscriptions.push(self.client.subscribe(self.subscribePath('Tasks'), function(task) {
		if (task.status == 'join')
			self.addMyTask(task);
		else if (data.status == 'delete')
			self.removeTask(data);

	}));
	
// Download previos Tasks
	$.getJSON('/room/Tasks/tasks.json', function(data) {
		_.each(data.tasks, function(task) {
			self.addMyTask(task);
		});
	})	
}

ContainerTaskFollower.prototype.isMyTask = function(task)
{
	var self = this;
	var bool = false;
	_.each(task.group, function(idUser) {
		if(idUser == self.client.guid)
		{
			bool = true;
			return bool; //creo que esto solo rompe el ciclo de _.each
		}
	});
	return bool;
}
ContainerTaskFollower.prototype.addMyTask = function(task)
{
	if(this.isMyTask(task))
		return this.joinTask(task)
}