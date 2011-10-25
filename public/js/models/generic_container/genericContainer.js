YUI.add("genericcontainer", function(Y)
{ 
	var Lang = Y.Lang;


	function GenericContainer(data)
	{
		GenericContainer.superclass.constructor.apply(this, arguments);
	}


	GenericContainer.NAME = "genericContainer";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	GenericContainer.ATTRS =
	{
		client:
			{
			value:null
			}
		,allElements:
			{
			value:null	
			}
		,container:
			{
			value:null
			}
		,subcriptions:
			{
			value:null
			}
		,prefixIdTask:
			{
			value:null
			}
		,del:
			{
			value:null	
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(GenericContainer, Y.Base,
	{
		initializer: function(data)
		{
			this.client = data.client;
			this.allElements = [];
			this.container = document.getElementById(data.container || 'list1');
			this.subscriptions = [];
			this.prefixIdTask = 'task_';
			this._createContainer();

		this.publish("myEvent", {
		defaultFn: this._defMyEventFn,
		bubbles:false
		});
		},

		destructor : function()
		{
			this.client = null;
			this.container = null;
			this.del.destroy();
			Y.DD.DDM.destroy();
			this.del = null;
			Y.Array.each(this.allElements, function(element)
			{
				element.destroy();
			});
			this.allElements = null;
		},

		_subscribePath : function(zone)
		{
			return '/room/' + zone;
		},

		_createContainer : function()
		{
			//Setup some private variables..
			var goingUp = false, lastY = 0, trans = {};

			var elementsContainer = Y.one(this.container);
			this.del = new Y.DD.Delegate({
				container: elementsContainer
				,nodes: 'li'
				,target: true
			});
			var del = this.del;
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
			var uls = Y.Node.all(this.container);
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
				if (tagName === 'li' && parentClassName !== 'elementContainer')
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
				var node = drag.get('node');
				dragAux.set('innerHTML', node.get('innerHTML'));
				dragAux.setStyle('opacity','.5');
				node.one('div.mod').setStyle('visibility', 'hidden');
				node.addClass('moving');
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
		},
	  
		_syncTargets: function()
		{
			this.del.syncTargets();
		},
		
		/*
		Eliminar una task
		*/
		_removeTask : function()
		{
			var data = 
				{
				id:this.guid
				,status:'remove'
				}
				
			this.client.sendSignal(data);
		},

		_addElement : function(data, classElement)
		{
			var li = document.createElement('li');
			var id = data.guid || Utils.guid()
			li.className = "item";
			li.innerHTML = data.textElement;
			li.id = id;	
			data.client = this.client;
			
			data.li = li;
			data.guid = id;
			if(classElement)
			{
				var element = new classElement(data);
				this.allElements.push(element);
			}
			this.container.appendChild(li);
			/*
			Para que el nuevo elemento agregado sea un Target tambien
			*/
			this.del.syncTargets();
		}
	});

	Y.namespace("ModuleGenericContainer").GenericContainer = GenericContainer;

}, "1.0", {requires:['base','dd-constrain', 'dd-proxy', 'dd-drop','anim','dd-plugin', 'dd-delegate','dd-drop-plugin']});