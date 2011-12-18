YUI.add("genericdivanimation", function(Y)
{ 
	var Lang = Y.Lang;


	function GenericDivAnimation(data)
	{
		GenericDivAnimation.superclass.constructor.apply(this, arguments);
	}


	GenericDivAnimation.NAME = "genericDivAnimation";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	GenericDivAnimation.ATTRS =
	{
		client:
			{
			value:null
			}
		,div:
			{
			value:null	
			}
		,textElement:
			{
			value:null
			}
		,anim:
			{
			value:null
			}
		,elements:
			{
			value:[]
			}
		,container:
			{
			value:null
			,getter:function()
				{
				return this.container	
				}
			}	
	};

    /* MyComponent extends the Base class */
	Y.extend(GenericDivAnimation, Y.Base,
	{
		initializer: function(data)
		{
			this.client = data.client;	//cliente
			this.li = data.li;		//elemento html que representa al módulo
			this.textElement = data.textElement;
			this.elements = [];
			
			this._createModule();

		this.publish("myEvent", {
		defaultFn: this._defMyEventFn,
		bubbles:false
		});
		},

		destructor : function()
		{
			this.client = null;
		},

		_createModule:function()
		{
			var str = 
				'<div class="mod">' + 
				'<h2><div class = "drag"></div><strong>' + this.textElement + '</strong>'+ 
				'<a title="minimize module" class="min" href="#"></a>' +
				'<a title="close module" class="close" href="#" style = "display:none">X</a></h2>' +
				'<div class ="instanceAdd"></div>'+
				'<div class="inner">' +
				'    <ul class="elementContainer"></ul>' + 
				'</div>' +
				'</div>';
			
			var liTag = this.li;
			liTag.innerHTML = str;
			
			var node = Y.one(liTag);
			//define
			this.container = liTag.getElementsByClassName("elementContainer")[0];
			
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
						this.anim = new Y.Anim({node: inner});
						var anim = this.anim;
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
		},
		
		_addElement : function(data, classElement)
		{
			var li = document.createElement('li');
			li.className = "genericDivAnimation";
			var id = data.guid || Utils.guid();
			li.id = id;
			li.innerHTML = data.textElement;
			data.li = li;
			data.guid = id;
			if(classElement)
			{
				var element = new classElement(data);
				this.elements.push(element);
			}
			this.container.appendChild(li);
			return li;
		},
	  
		_getContainer : function()
		{
			return this.container;
		}
	});

	Y.namespace("ModuleGeneric").GenericDivAnimation = GenericDivAnimation;

}, "1.0", {requires:['base','node','anim']});