function InstanceTaskCreator(data)
{
	this.client = data.client;
	this.roommates = data.group;
	this.function = data.function;
	this.prefixIdTask = 'instanceTask_';
	this.init();
}

InstanceTaskCreator.prototype.init = function()
{
	this.showTaskDefinition(true);
	this.showUsers();
	this.addCreatorBtnEvent();
}

InstanceTaskCreator.prototype.showTaskDefinition = function(bool)
{
	//	this.dom.style.display = bool?"":"none";
}

InstanceTaskCreator.prototype.showUsers = function()
{
	this.group = new GroupInstanceTaskWizard(
	{
	client:this.client
	,roommates:this.roommates
	});
	this.group.setVisible(true);
}
InstanceTaskCreator.prototype.addCreatorBtnEvent = function()
{
	var self = this;
	var btn = $('#instanceTaskCreate');
	btn.bind('click',function(e)
	{
		self.createInstanceTask();
	});
}

InstanceTaskCreator.prototype.createInstanceTask = function()
{
	var title = $('#instanceTaskTitle').val();
	var users = this.getUsers();
	var data = 
		{
		title:'titulo Instancia de prueba'
		,id:this.prefixIdTask+Utils.guid()
		,status:'join'
		,owner:this.client.guid
		,group:users
		}
	if(this.function.click)
		this.function.click(data);
}

InstanceTaskCreator.prototype.getUsers = function()
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