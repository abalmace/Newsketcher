YUI.add("showcontainercircle", function(Y)
{ 
	var Lang = Y.Lang;


	function ShowContainerCircle(data)
	{
		ShowContainerCircle.superclass.constructor.apply(this, arguments);
	}


	ShowContainerCircle.NAME = "showContainerCircle";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	ShowContainerCircle.ATTRS =
	{
		allCircles:
			{
			value:[]	
			}
		,container:
			{
			value:null
			}
		,subscriptions:
			{
			value:[]
			}
		,callback:
			{
			value:null
			}
		,showCircleType:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(ShowContainerCircle, Y.ModuleGenericContainer.GenericContainer,
	{
		initializer: function(data)
		{
			this.container = document.getElementById(data.container || 'unknow');
			this.subscriptions = [];
			this.allCircles = [];
			this.prefixIdTask = 'task_';
			this.callback = data.callback;
			
			//this._addEventClick();

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

		_subscribePath : function()
		{
			return '/channel/show/Task';
		},

		_handleClick : function(e)
		{
			
		},
	  
		_addEventClick : function()
		{
			Y.one(this.container).delegate('click', this._handleClick, 'div');
		},
	  
		_addMyCircle : function(circle)
		{
			circle.textElement = circle.name;
			circle.name = null;
			circle.callback = this.callback;
			var li = this._addElement(circle,this.showCircleType);
			this._setUI(li);
		},
	  
		_setUI:function(li)
		{
			var node = Y.one(li);
			
			node.addClass('liGroup');
			
			var nodeH2 = node.one(".mod h2");
			nodeH2.addClass('backgroundHeaderGroup');
			
			var nodeUl = node.one(".elementContainer");
			nodeUl.addClass('backgroundGroup');
		}
	});

	Y.namespace("ModuleContainerCircle").ShowContainerCircle = ShowContainerCircle;

}, "1.0", {requires:['node-event-delegate','node','connectionserver','genericcontainer']});