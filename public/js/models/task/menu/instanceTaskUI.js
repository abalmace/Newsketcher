function InstanceTaskUI(data)
{
	this.dom = data.dom;
	this.title = data.title
	this.init();
}

InstanceTaskUI.prototype.init =function()
{
	this.createUI()
}

InstanceTaskUI.prototype.createUI = function()
{
	this.dom.innerHTML = this.title;	
}

InstanceTaskUI.prototype.active = function(bool)
{
	if(bool)
		this.dom.className += " instanceTaskActive";
	else
		this.dom.className = " instanceTask";
}

/*
Creación del módulo InstaceTask
*/
YUI.add('instanceTask', function(Y)
{
	var InstanceTask = function(data)
	{
		this.data = data;
		
		this.init() = function()
		{
		
		}
		
		this.createInstance = function()
		{
			instance.li.innerHTML = instance.title;
		}
	};
	Y.InstanceTask = InstanceTask;
},'001', {
    requires: [ 'node' ]
});
