YUI.add("animationcontainer", function(Y)
{ 
	var Lang = Y.Lang;


	function AnimationContainer(data)
	{
		AnimationContainer.superclass.constructor.apply(this, arguments);
	}


	AnimationContainer.NAME = "animationContainer";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	AnimationContainer.ATTRS =
	{
		anim:
			{
			value:null
			}	
	};

    /* MyComponent extends the Base class */
	Y.extend(AnimationContainer, Y.ModuleContainer.Generic_Container,
	{
		initializer: function(data)
		{
			this._createModule();
		},

		destructor : function()
		{
		},

		_createModule:function()
		{
			var str = 
				'<div class="mod">' + 
				'<h2><a title="minimize module" class="min" href="#"></a></h2>' +
				'<div class="inner">' +
				'    <ul class="elementContainer"></ul>' + 
				'</div>' +
				'</div>';
			
			var domTag = this.dom;
			domTag.innerHTML = str;
			
			var node = Y.one(domTag);
			//define
			this.container = node.one('.elementContainer');
			
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
		}
	});

	Y.namespace("ModuleGeneric").AnimationContainer = AnimationContainer;

}, "1.0", {requires:['generic_container','node','anim']});