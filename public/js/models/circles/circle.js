function Circle(data)
{
	this.dom = data.dom;
	this.title = data.title;
	this.owner = data.owner;
	this.guid = data.guid;
	this.people = [];
	this.tasks = [];
	this.init();	
}
Circle.prototype.init = function()
{
	this.defineDOMElement();
	this.addEvents();
}

Circle.prototype.defineDOMElement = function()
{
	var divInner = document.createElement('div');
	divInner.className = "inner_circle";
	
	var divLabel = document.createElement('div');
	divLabel.className = "circle_label";
	divLabel.innerHTML =this.title;
	
	var divNumber = document.createElement('div');
	divNumber.className = "circle_number";
	divNumber.innerHTML = this.people.length;
	
	divInner.appendChild(divLabel);
	divInner.appendChild(divNumber);
	this.dom.appendChild(divInner);
	/*
	Para que el nuevo elemento agregado sea un Target tambien
	*/
	//this.Y.mynamespace.syncTargets();
}

Circle.prototype.addEvents = function()
{
	var element = $(this.dom);
	var element2 = element.find('.outer_circle');
	
	element2.bind('click', function(){alert("hola")});
		element2.mouseover(function() {
			element.find('.outer_circle').addClass('outer_circle_open');
			element.find('.inner_circle').animate({left:'47px',top:'76px'},0);
		});
		element.find('.outer_circle').mouseout(function() {
			element.find('.outer_circle').removeClass('outer_circle_open');
			element.find('.inner_circle').animate({left:'18px',top:'47px'},0);
		});
	
						
	element.find('.circle_del').click(function(){
		element.find('.circle_del').remove();
		element.find('.outer_circle').addClass('outer_circle_open').animate({height: '183px', width: '183px'},100);
		element.find('.inner_circle').animate({left:'47',top:'76'},0)
		element.find('.circle_label').addClass('rotate_label');
		element.find('.outer_circle').animate({"top":"150px"},300).animate({"bottom":"20px"}, 100, function(){ });
		element.find('.outer_circle').animate({"opacity":"0","margin-left":"600px"}, 800, 'linear');	
	});

}

Circle.prototype.addPerson = function(person)
{
	var personAux = _.detect(this.people, function(s) { return s.guid == person.guid });
	if(!personAux)
	{
		this.people.push(person);
		var element = $(this.dom).find('.circle_number');
		element.html(this.people.length);
	}
}

Circle.prototype.addTask = function(task)
{
	var taskAux = _.detect(this.tasks, function(s) { return s.guid == task.guid });
	if(!taskAux)
		this.tasks.push(task);
}