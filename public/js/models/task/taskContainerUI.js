YUI.add("taskcontainerui", function(Y)
{ 
	var Lang = Y.Lang;


	function TaskContainerUI(data)
	{
		TaskContainerUI.superclass.constructor.apply(this, arguments);
	}


	TaskContainerUI.NAME = "taskContainerUI";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	TaskContainerUI.ATTRS =
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
	Y.extend(TaskContainerUI, Y.Base,
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
			var node = Y.one(this.dom);
			
			node.addClass('liTask');
			
			var h2 = node.one('h2');
			h2.addClass('backgroundHeaderTask');
			
			var strong = document.createElement('strong');
			strong.innerHTML = this.title;
			
			h2.appendChild(strong);
			
			var ul = node.one('ul');
			ul.addClass('backgroundTask');
		},

		active : function(bool)
		{
			if(bool)
				this.dom.className += " instanceTaskActive";
			else
				this.dom.className = " liTask";
		}
	});

	Y.namespace("ModuleTask").TaskContainerUI = TaskContainerUI;

}, "1.0", {requires:['base']});