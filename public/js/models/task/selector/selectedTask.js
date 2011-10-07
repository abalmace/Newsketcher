function SelectedTask(data)
{
	this.dom = data.dom;
	this.title = data.title;
	this.guid = data.guid;
	this.init();	
}
SelectedTask.prototype.init = function()
{
	this.defineDOMElement();
}

SelectedTask.prototype.defineDOMElement = function()
{
	this.dom.innerHTML =this.title;
}

SelectedTask.prototype.addEvents = function()
{

}

SelectedTask.prototype.to_json = function()
{
	var data =
	{
	title:this.title
	,guid:this.guid
	}
	return data;
}