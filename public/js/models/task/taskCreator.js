function TaskCreator(data)
{
	this.client = data.client;
	this.function = data.function;
	this.dom = document.getElementById('taskDefinition');
	this.prefixIdTask = 'task_';
	this.init();
}

TaskCreator.prototype.init = function()
{
	this.showTaskDefinition(true);
	this.showUsers();
	this.addCreatorBtnEvent();
}

TaskCreator.prototype.showTaskDefinition = function(bool)
{
		this.dom.style.display = bool?"":"none";
}

TaskCreator.prototype.showUsers = function()
{
	this.group = new GroupWizard({client:this.client});
	this.group.setVisible(true);
}
TaskCreator.prototype.addCreatorBtnEvent = function()
{
	var self = this;
	var btn = $('#taskCreate');
	btn.bind('click',function(e)
	{
		self.createTask();
	});
}

TaskCreator.prototype.createTask = function()
{
	var title = $('#taskTitle').val();
	var users = this.getUsers();
	var data = 
		{
		title:title
		,id:this.prefixIdTask+Utils.guid()
		,status:'join'
		,owner:this.client.guid
		,group:users
		}
	if(this.function.click)
		this.function.click(data);
	this.showTaskDefinition(false);
}

TaskCreator.prototype.getUsers = function()
{
	var users = this.group.getAllUsers();
	var idUsers = [];
	_.each(users, function(user)
	{
		if(user.selected)
			idUsers.push(user.guid)
	})
	return idUsers;
}