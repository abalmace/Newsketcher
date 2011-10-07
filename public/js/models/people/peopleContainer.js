function PeopleContainer(data)
{
	this.client = data.client;
	this.allPeople = [];
	this.container = data.container;
	this.subscriptions = [];
	this.Y = null;			//Ambiente de Yui
	this.init();
	this.prefixIdTask = 'people_';
	
}

PeopleContainer.prototype.init = function()
{
    //this.createContainer();
    this.addEventClick();
    this.reload();
}
//TODO
PeopleContainer.prototype.addSubscriptions = function()
{
	var self = this;
//suscribirse a la edicion de Tasks
	self.subscriptions.push(self.client.subscribe(self.subscribePath(), function(circle) {
		if (circle.status == 'add')
			self.addCircle(circle);
		else if (circle.status == 'delete')
			self.removeCircle(circle);

	}));
	
}

PeopleContainer.prototype.reload = function(people)
{
	var self = this;
	$(this.container).empty();
	this.allPeople = [];
	if(people)
	{
		_.each(people, function(person) {
				self.addPerson(person);
		  });
	}
	else
	{
		// Download people
		$.getJSON('/channel/allUsers/people.json', function(data) {
			_.each(data.users, function(person) {
				self.addPerson(person);
			});
		})
	}
}
//TODO
PeopleContainer.prototype.subscribePath = function()
{
	return '/channel/people';
}
/*
	Crea el contenedor y lo deja como un elemento drop.
	Indica que todos los elementos 'li' dentro del contenedor son elementos drag
*/

//TODO
PeopleContainer.prototype.addEventClick = function()
{
	/*
	agregar evento click para addButton
	*/
	var self = this;
	var personAdd = $('#personAdd');
	personAdd.bind('click', function(e)
	{
		var data =
		{
		guid:Utils.guid()
		,name:"texto nombre de prueba"
		}
		self.addPerson(data);
	});
}

/*
	Eliminar una task
*/
//TODO
PeopleContainer.prototype.removeTask = function()
{
	var data = 
		{
		guid:this.guid
		,status:'remove'
		}
		
	this.client.sendSignal(data);
}

PeopleContainer.prototype.addPerson = function(data)
{
	var dom = document.createElement('div');
	var guid = data.guid || Utils.guid();
	dom.className = "people gButton";
	dom.id = guid;
	
	data.client = this.client;
	
	data.dom = dom;
	data.guid = guid;
	data.name = data.name;
	
	var person = new Person(data);
	this.allPeople.push(person);
	this.container.appendChild(dom);
	/*
	Para que el nuevo elemento agregado sea un Target tambien
	*/
	//this.Y.mynamespace.syncTargets();
}

PeopleContainer.prototype.getPerson = function(guid)
{
	var self = this;
	var person = _.detect(self.allPeople, function(s) { return s.guid == guid });
	
	return person.to_json();
}