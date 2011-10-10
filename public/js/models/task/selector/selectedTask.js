function SelectedTask(data)
{
	this.dom = data.dom;
	this.title = data.title;
	this.guid = data.guid;
	this.clicked = data.clicked;
	this.selected = false;
	this.init();	
}
SelectedTask.prototype.init = function()
{
	this.defineDOMElement();
	this.addEvents();
}

SelectedTask.prototype.defineDOMElement = function()
{
	this.dom.innerHTML =this.title;
}

SelectedTask.prototype.addEvents = function()
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

SelectedTask.prototype.to_json = function()
{
	var data =
	{
	title:this.title
	,guid:this.guid
	}
	return data;
}

SelectedTask.prototype.clickEvent = function()
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