YUI.add("elementsubtask", function(Y)
{ 
	var Lang = Y.Lang;


	function ElementSubTask(data)
	{
		ElementSubTask.superclass.constructor.apply(this, arguments);
	}

	ElementSubTask.NAME = "elementSubTask";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ElementSubTask.ATTRS =
	{
		dom:
			{
			value:null
			}
		,showroom:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(ElementSubTask, Y.Base,
	{
		initializer: function(data)
		{
			this.dom = data.dom;
			var aux = 
			{
				client : data.client
				,name : data.mapId
			}
			this.showroom = new Y.ModuleTask.ShowRoom(aux)
			
			this._addCss();
			this._addEventClick();

		this.publish("myEvent", {
		defaultFn: this._defMyEventFn,
		bubbles:false
		});
		},

		destructor : function()
		{
		/*
		* destructor is part of the lifecycle introduced by 
		* the Base class. It is invoked when destroy() is called,
		* and can be used to cleanup instance specific state.
		*
		* It does not need to invoke the superclass destructor. 
		* destroy() will call initializer() for all classes in the hierarchy.
		*/
		},

		/* MyComponent specific methods */

		_addCss: function()
		{
			
		},
	  
		_addEventClick : function()
		{
			var self = this;
			var element = Y.one(this.dom);
			element.on('click',function(e)
			{
				self.showroom.setActive(true);
			});
		}
	});

	Y.namespace("ModuleTask").ElementSubTask = ElementSubTask;

}, "1.0", {requires:['base','showroom']});