function Person(data)
{
	this.dom = data.dom;
	this.name = data.name;
	this.id = data.id;
	this.init();	
}
Person.prototype.init = function()
{
	this.defineDOMElement();
}

Person.prototype.defineDOMElement = function()
{
	var divInner = document.createElement('div');
	
	
	var divLabel = document.createElement('div');
	
	divLabel.innerHTML =this.name;
	
	divInner.appendChild(divLabel);
	this.dom.appendChild(divInner);
	/*
	Para que el nuevo elemento agregado sea un Target tambien
	*/
	//this.Y.mynamespace.syncTargets();
}

Person.prototype.addEvents = function()
{

}
