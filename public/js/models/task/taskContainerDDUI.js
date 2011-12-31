YUI.add("taskcontainerddui", function(Y)
{ 
	var Lang = Y.Lang;


	function TaskContainerDDUI(data)
	{
		TaskContainerDDUI.superclass.constructor.apply(this, arguments);
	}


	TaskContainerDDUI.NAME = "taskContainerDDUI";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	TaskContainerDDUI.ATTRS =
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
	Y.extend(TaskContainerDDUI, Y.ModuleTask.TaskContainerUI,
	{
		initializer: function(data)
		{	
			this._addDDTarget();
		},

		destructor : function()
		{
		
		},

		/* MyComponent specific methods */

		_addDDTarget : function()
		{
			var node = Y.one(this.dom);		
			var h2 = node.one('h2');
			var drag = document.createElement('div');
			drag.className = 'drag dragTask';
			h2.appendChild(drag);
		},
	});

	Y.namespace("ModuleTask").TaskContainerDDUI = TaskContainerDDUI;

}, "1.0", {requires:["taskcontainerui"]});