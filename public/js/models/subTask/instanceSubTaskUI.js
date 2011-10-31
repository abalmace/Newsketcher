YUI.add("instancesubtaskui", function(Y)
{ 
	var Lang = Y.Lang;


	function InstanceSubTaskUI(data)
	{
		InstanceSubTaskUI.superclass.constructor.apply(this, arguments);
	}


	InstanceSubTaskUI.NAME = "instanceSubTaskUI";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	InstanceSubTaskUI.ATTRS =
	{
		dom:
			{
			value:null
			}
		,title:
			{
			value:null	
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(InstanceSubTaskUI, Y.Base,
	{
		initializer: function(data)
		{
			this.dom = data.dom;
			this.title = data.title
			
			this._createUI();

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

		_createUI : function()
		{
			this.dom.innerHTML = this.title;	
		},

		active : function(bool)
		{
			if(bool)
				this.dom.className += " instanceTaskActive";
			else
				this.dom.className = " instanceTask";
		}
	});

	Y.namespace("ModuleTask").InstanceSubTaskUI = InstanceSubTaskUI;

}, "1.0", {requires:['base']});