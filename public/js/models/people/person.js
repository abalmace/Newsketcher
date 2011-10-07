function Person(data)
{
	this.dom = data.dom;
	this.name = data.name;
	this.guid = data.guid;
	this.init();	
}
Person.prototype.init = function()
{
	this.defineDOMElement();
}

Person.prototype.defineDOMElement = function()
{
	this.dom.innerHTML =this.name;
}

Person.prototype.addEvents = function()
{

}

Person.prototype.to_json = function()
{
	var data =
	{
	name:this.name
	,guid:this.guid
	}
	return data;
}