function PeopleContainer(data)
{
	this.client = data.client;
	this.allPeople = [];
	this.container = document.getElementById('peopleContainer');
	this.subscriptions = [];
	this.Y = null;			//Ambiente de Yui
	this.init();
	this.prefixIdTask = 'people_';
	
}

PeopleContainer.prototype.init = function()
{
    //this.createContainer();
    this.addEventClick();
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
	
// Download previos Tasks
	$.getJSON('/channel/Circles/circles.json', function(data) {
		_.each(data.circles, function(circle) {
			self.addCircle(circle);
		});
	})	
}
//TODO
PeopleContainer.prototype.subscribePath = function()
{
	return '/channel/circles';
}
/*
	Crea el contenedor y lo deja como un elemento drop.
	Indica que todos los elementos 'li' dentro del contenedor son elementos drag
*/
//TODO
PeopleContainer.prototype.createContainer = function()
{
	var self = this;
	//Use loader to grab the modules needed
	YUI().use('dd-constrain', 'dd-proxy', 'dd-drop','anim','dd-plugin', 'dd-delegate','dd-drop-plugin', function(Y)
	{ 
		//Setup some private variables..
		var goingUp = false, lastY = 0, trans = {};

		var elementsContainer = Y.one('#play ul');
		var del = new Y.DD.Delegate({
			container: elementsContainer
			,nodes: 'li'
			,target: true
		});
		del.dd.plug(Y.Plugin.DDProxy,
			{
			moveOnEnd: false
			,borderStyle: 'none'
			});
		del.dd.plug(Y.Plugin.DDConstrained,
			{
			constrain2node: elementsContainer
			});
		del.dd.addHandle('.drag');
		
		
		//Create simple targets for the 2 lists.
		var uls = Y.Node.all('#play ul');
		uls.each(function(v, k)
		{
			var tar = new Y.DD.Drop({node: v});
		});
		

		//Listen for all drop:over events
		Y.DD.DDM.on('drop:over', function(e)
		{
			//Get a reference to our drag and drop nodes
			var drag = e.drag.get('node'),
			drop = e.drop.get('node');
			if(!drop)
				alert("error");

			//Are we dropping on a li node?
			var tagName = drop.get('tagName').toLowerCase();
			var parentClassName = drop.get('parentNode').get('className');
			if (tagName === 'li' && parentClassName !== 'instanceContainer')
			{
				//Are we not going up?
				if (!goingUp)
				{
					drop = drop.get('nextSibling');
				}
				//Add the node to this list
				e.drop.get('node').get('parentNode').insertBefore(drag, drop);
				//Resize this nodes shim, so we can drop on it later.
				e.drop.sizeShim();
			}
			else if (drop.get('tagName').toLowerCase() !== 'li')
			{
				var str = drop.get('tagName').toLowerCase();
				var bool = drop.contains(drag);
				if (!bool)
				{
					drop.appendChild(drag);
					Y.Lang.later(50, Y, function()
					{
						Y.DD.DDM.syncActiveShims(true);
					});
				}
			}
			del.syncTargets();
		});
		
		//Listen for all drag:drag events
		del.on('drag:drag', function(e)
		{
			//Get the last y point
			var y = e.target.lastXY[1];
			//is it greater than the lastY var?
			if(y < lastY)
			{
				//We are going up
				goingUp = true;
			}
			else
			{
				//We are going down.
				goingUp = false;
			}
			//Cache for next check
			lastY = y;
		});
		
		//Listen for all drag:start events
		del.on('drag:start', function(e)
		{
			var drag = e.target;
			if (drag.target)
			{
				drag.target.set('locked', true);
			}
			var dragAux = drag.get('dragNode');
			drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
			drag.get('dragNode').setStyle('opacity','.5');
			drag.get('node').one('div.mod').setStyle('visibility', 'hidden');
			drag.get('node').addClass('moving');
		});
		//Listen for a drag:end events
		del.on('drag:end', function(e)
		{
			var drag = e.target;
			if(drag.target)
			{
				drag.target.set('locked', false);
			}
			drag.get('node').setStyle('visibility', '');
			drag.get('node').one('div.mod').setStyle('visibility', '');
			drag.get('node').removeClass('moving');
			drag.get('dragNode').set('innerHTML', '');
		});
		
		//Listen for all drag:drophit events
		del.on('drag:drophit', function(e)
		{
			var drop = e.drop.get('node'),
			drag = e.drag.get('node');

			//if we are not on an li, we must have been dropped on a ul
			if(drop.get('tagName').toLowerCase() !== 'li')
			{
				if(!drop.contains(drag))
				{
					drop.appendChild(drag);
				}
			}
		});
		
		Y.namespace('mynamespace');

		Y.mynamespace.syncTargets = function()
		{
			del.syncTargets();
		};
		self.Y=Y;
		
		  self.addSubscriptions();
	});
	
}
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
		id:Utils.guid()
		,name:"texto nombre de prueba"
		}
		self.addPerson();
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
		id:this.guid
		,status:'remove'
		}
		
	this.client.sendSignal(data);
}

PeopleContainer.prototype.addPerson = function(data)
{
	var dom = document.createElement('a');
	var id = data.id || Utils.guid();
	dom.className = "people";
	dom.id = id;
	
	data.client = this.client;
	
	data.dom = dom;
	data.id = id;
	data.name = data.name;
	
	var person = new People(data);
	this.allPeople.push(circle);
	this.container.appendChild(dom);
	/*
	Para que el nuevo elemento agregado sea un Target tambien
	*/
	//this.Y.mynamespace.syncTargets();
}