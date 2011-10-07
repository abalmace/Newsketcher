function CircleCreator(data)
{
	this.client = data.client;
	this.dom = data.dom
	this.function = data.function;
	//this.dom = document.getElementById('taskDefinition');
	this.prefixIdCircle = 'circle_';
	this.init();
}

CircleCreator.prototype.init = function()
{
	//this.showCircleDefinition(true);
	//this.addCreatorBtnEvent();
	this.createCircle();
}
//TODO
CircleCreator.prototype.showCircleDefinition = function(bool)
{
		this.dom.style.display = bool?"":"none";
}
//TODO
CircleCreator.prototype.addCreatorBtnEvent = function()
{
	var self = this;
	var btn = $('#circleCreate');
	btn.bind('click',function(e)
	{
		self.createCircle();
	});
}

CircleCreator.prototype.createCircle = function()
{
	//var title = $('#taskTitle').val();
	var title = "Friend Circle"
	var data = 
		{
		title:title
		,guid:this.prefixIdCircle+Utils.guid()
		,status:'add'
		,owner:this.client.guid
		,dom: this.dom
		}
	if(this.function.click)
		this.function.click(data);
	//this.showCircleDefinition(false);
}