/*
	Corresponde a una tarea.
	Una tarea puede tener muchas instancias. Por esta razón se considera un módulo.
*/

/*
data = {client: cliente}
*/
function ModuleTask(data)
{
	if(data)
	{
		this.client = data.client;	//cliente
		this.taskName = data.id;
		this.li = data.li;		//elemento html que representa al módulo
		this.title = data.title;
		this.group = data.group;	//integrantes de la task	
	}
	this.instances = [];			//arreglo que contiene los objetos InstanceTask
	this.subscriptions = [];		//subscripciones agregadas.
	this.Container = null;			//elemento html que contiene las instancias
	this.Y = null;				//environment de YUI
	this.init(data);
	this.prefixIdInstanceTask = 'instaceTask_';
}

ModuleTask.prototype.init = function(data)
{
	this.createModule(this.li,this.title);
	this.addEventButtonAdd();
	this.addSubscriptions();
}

ModuleTask.prototype.addSubscriptions = function()
{
	var self = this;
//suscribirse a la edicion de Rooms
	self.subscriptions.push(self.client.subscribe(self.subscribePath('instanceTasks'), function(data) {
		if (data.status == 'join')
			self.joinInstanceTask(data);
		else if (data.status == 'delete')
			self.removeInstanceTask(data);

	}));
	
// Download previos instanceTasks
	$.getJSON('/room/'+ this.taskName +'/instanceTasks.json', function(data) {
		_.each(data.instanceTasks, function(info) {
			self.joinInstanceTask(info);
	  });
	})
}

ModuleTask.prototype.subscribePath = function(zone)
{
	return '/room/' +this.taskName+'/'+ zone;
}

ModuleTask.prototype.joinInstanceTask = function(data)
{
	var li = document.createElement('li');
	li.className = "instanceTask";
	var id = data.id || Utils.guid();
	li.id = id;	
	
	var dataAux = 
		{
		client : this.client
		,persisted : true
		,dom:li
		,name :id
		,title:data.title
		}
	var insTask = new InstanceTask(dataAux);
	this.instances.push(insTask);
	this.Container.appendChild(li);
	
	if(data.active != undefined)
		insTask.setActive(data);
	
	/*
	Para que la nueva instancia agregada sea un Target tambien
	*/
	this.Y.mynamespace.syncTargets();
	
	return insTask.name;
}

ModuleTask.prototype.addCurrentInstances = function(instances)
{
	var self = this;
	_.each(instances, function(instance)
	{
		self.addNewInstanceTask(instance);
	});
}

ModuleTask.prototype.createModule = function(liTag,title)
{
	var self = this;
	YUI().use('node','anim', function(Y)
	{
		
		var str = 
			'<div class="mod">' + 
			'<h2><div class = "drag"></div><strong>' + title + '</strong>'+ 
			'<a title="minimize module" class="min" href="#">-</a>' +
			'<a title="close module" class="close" href="#">X</a></h2>' +
			'<div class ="instanceAdd"></div>'+
			'<div class="inner">' +
			'    <ul class="instanceContainer"></ul>' + 
			'</div>' +
			'</div>';
		
		liTag.innerHTML = str;
		self.li = liTag;
		
		var node = Y.one(liTag);
		//define
		self.Container = liTag.getElementsByClassName("instanceContainer")[0];
		
		//eventos de botones.
		var _moduleClick = function(e)
		{
			//Is the target an href?
			if (e.target.test('a'))
			{
				var a = e.target, anim = null, div = a.get('parentNode').get('parentNode');
				//Did they click on the min button
				if (a.hasClass('min'))
				{
					//Get some node references
					var ul = div.one('div ul'),
					h2 = div.one('h2'),
					h = h2.get('offsetHeight'),
					hUL = ul.get('offsetHeight'),
					inner = div.one('div.inner');

					//Create an anim instance on this node.
					anim = new Y.Anim({node: inner});
			
					//Is it expanded?
					if (!div.hasClass('minned'))
					{
						//Set the vars for collapsing it
						anim.setAttrs({
							to:
							{
								height: 0
							}
							,duration: '.25'
							,easing: Y.Easing.easeOut
							,iteration: 1
						});
						//On the end, toggle the minned class
				
						anim.on('end', function()
						{
							div.toggleClass('minned');
						});
					}
					else
					{
						//Set the vars for expanding it
						anim.setAttrs({
							to:
							{
								height: (hUL)
							}
							,duration: '.25'
							,easing: Y.Easing.easeOut
							,iteration: 1
						});
						//Toggle the minned class
						//Then set the cookies for state
						div.toggleClass('minned');

					}
					//Run the animation
					anim.run();

				}
				//Was close clicked?
				if (a.hasClass('close'))
				{
					//Get some Node references..
					var li = div.get('parentNode'),
					id = li.get('id');
					/*
					dd = Y.DD.DDM.getDrag('#' + id),
					data = dd.get('data'),
					item = Y.one('#' + data.id);

					//Destroy the DD instance.
					dd.destroy();
					*/
			
					//Setup the animation for making it disappear
					anim = new Y.Anim({
						node: div
						,to:
						{
							opacity: 0
						}
						,duration: '.25'
						,easing: Y.Easing.easeOut
					});
					anim.on('end', function()
					{
						//On end of the first anim, setup another to make it collapse
						var anim = new Y.Anim({
							node: div
							,to:
							{
								height: 0
							}
							,duration: '.25'
							,easing: Y.Easing.easeOut
						});
						anim.on('end', function()
						{
							//Remove it from the document
							li.get('parentNode').removeChild(li);
						});
						//Run the animation
						anim.run();
					});
					//Run the animation
					anim.run();
				}
				//Stop the click
				e.halt();
			}
		}	
		node.one('h2').on('click', _moduleClick);
		self.createInstanceContainer();	
	});
}

ModuleTask.prototype.addEventButtonAdd = function()
{
	var self = this;
	var li =jQuery(this.li);
	var add =li.find("div.instanceAdd");
	add.bind('click', function(e)
	{
		var instanceTaskCreator = new InstanceTaskCreator(
			{
			client:self.client
			,group:self.group
			,function:
				{
				click:function(data)
					{
					this.client.sendSignal(this.subscribePath('instanceTasks'), data);
					}
				}
			});
	});
}

ModuleTask.prototype.findInstanceTask = function(id)
{
	id = id.toLowerCase();
	var instance = _.detect(this.instances, function(s) { return s.name === id });
	return instance;
}

ModuleTask.prototype.createInstanceContainer = function()
{
	var self = this;
	YUI().use('dd-constrain', 'dd-proxy', 'dd-delegate', 'node', function(Y)
	{
		var container = Y.one(self.Container);
		var liTag = Y.one(self.li);
		var uls = liTag.all('div.inner');
		//Setup some private variables..
		var goingUp = false, lastY = 0, trans = {};

		var del = new Y.DD.Delegate({
			container: container
			,nodes: 'li'
			,target:true
			,startCentered: true
		});
		del.dd.plug(Y.Plugin.DDProxy,
			{
			moveOnEnd: false
			,borderStyle: 'none'
			});
		del.dd.plug(Y.Plugin.DDConstrained,
			{
			constrain2node: container
			});


		//Listen for all drop:over events
		del.on('drop:enter', function(e)
		{
			//Get a reference to our drag and drop nodes
			var drag = e.drag.get('node'),
			drop = e.drop.get('node');
			drop.addClass("insTaskOver");
		});
		del.on('drop:exit', function(e)
		{
			var node = e.target.get('node');
			node.removeClass("insTaskOver");
		});
		
		
		//Listen for all drag:start events
		del.on('drag:start', function(e)
		{
			var target = e.target;
			var node = target.get('node');
			var drag = target.get('dragNode');
			if (target.target)
			{
				drag.target.set('locked', true);
			};
			
			drag.addClass('insTaskMoving');
			drag.set('offsetWidth', '10px');
			node.addClass('insTaskNode');	
		});
		
		del.on('drag:end', function(e)
		{
			var target = e.target;
			var node = target.get('node');
			var drag = target.get('dragNode');
			node.removeClass('insTaskNode');
			drag.removeClass('insTaskMoving');
		});
		del.on('drop:hit', function(e)
		{
			var target = e.target;
			var node = target.get('node');
			var drag = e.drag.get('node');
			_dropHit(drag,node);
			node.removeClass('insTaskOver');
		});
		
		var _dropHit = function(node, drop)
		{
			var nodeId = node.get('id');
			var dropId = drop.get('id');
			var nodeInstance = self.findInstanceTask(nodeId);
			var dropInstance = self.findInstanceTask(dropId);
			
			dropInstance.copyOverlays(nodeInstance);
		}
		/*
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

		
		*/
		
		//Create simple targets for the list.
		uls.each(function(v, k)
		{
			var tar = new Y.DD.Drop({node: v});
		});
		
		Y.namespace('mynamespace');

		Y.mynamespace.syncTargets = function()
		{
			del.syncTargets();
		};
		self.Y=Y;
		//self.addCurrentInstances({primero:{title:"instances of this task"},segundo:{title:"instances of this task..."}});
	});
}
