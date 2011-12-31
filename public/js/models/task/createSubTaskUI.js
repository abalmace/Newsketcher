YUI.add("createsubtaskui", function(Y)
{ 
	var Lang = Y.Lang;


	function CreateSubTaskUI(data)
	{
		CreateSubTaskUI.superclass.constructor.apply(this, arguments);
	}


	CreateSubTaskUI.NAME = "createSubTaskUI";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	CreateSubTaskUI.ATTRS =
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
	Y.extend(CreateSubTaskUI, Y.Base,
	{
		initializer: function(data)
		{
			this.dom = data.dom;
			this.title = data.title
			
			this._createUI();
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
			var dom = this.dom;
			
			dom.className = 'liTask'
			
			var div = document.createElement('div');
			div.className = 'mod';
			
			var h2 = document.createElement('h2');
			h2.className = 'backgroundHeaderSubTask';
			
			var strong = document.createElement('strong');
			strong.innerHTML = this.title;
			
			h2.appendChild(strong);
			div.appendChild(h2);
			dom.appendChild(div);
		},

		active : function(bool)
		{
			if(bool)
				this.dom.className += " instanceTaskActive";
			else
				this.dom.className = " liTask";
		}
	});

	Y.namespace("ModuleTask").CreateSubTaskUI = CreateSubTaskUI;

}, "1.0", {requires:['base']});