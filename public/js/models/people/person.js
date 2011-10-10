function Person(data)
{
	this.dom = data.dom;
	this.name = data.name;
	this.guid = data.guid;
	this.clicked = data.clicked;
	this.selected = false;
	this.init();	
}
Person.prototype.init = function()
{
	this.defineDOMElement();
	this.addEvents();
}

Person.prototype.defineDOMElement = function()
{
	this.dom.innerHTML =this.name;
}

Person.prototype.addEvents = function()
{
	var dom = $(this.dom);
	var self = this;
	dom.bind('click',function(e)
	{
		self.clickEvent();
		if(self.clicked)
			self.clicked(self.selected,self.guid);
	});
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

Person.prototype.clickEvent = function()
{
	if(!this.selected)
	{
		$(this.dom).addClass('gButtonSelected');
	}
	else
	{
		$(this.dom).removeClass('gButtonSelected');
	}
	this.selected = !this.selected;
}