YUI.add("selectedtask", function(Y)
{ 
	var Lang = Y.Lang;


	function SelectedTask(data)
	{
	SelectedTask.superclass.constructor.apply(this, arguments);
	}


	SelectedTask.NAME = "selectedTask";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	SelectedTask.ATTRS =
	{
		dom:
			{
			value:null
			}
		,title:
			{
			value:null	
			}
		,guid:
			{
			value:null
			}
		,clicked:
			{
			value:null
			}
		,selected:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(SelectedTask, Y.Base,
	{
		initializer: function(data)
		{
			this.dom = data.dom;
			this.title = data.title;
			this.guid = data.guid;
			this.clicked = data.clicked;
			this.selected = false;
			
			this._defineDOMElement();
			this._addEvents();

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

		to_json : function()
		{
			var data =
			{
			title:this.title
			,guid:this.guid
			}
			return data;
		},

		_defineDOMElement : function()
		{
			this.dom.innerHTML =this.title;
		},

		_addEvents : function(e)
		{
			var dom = $(this.dom);
			var self = this;
			dom.bind('click',function(e)
			{
				self._clickEvent();
				if(self.clicked)
					self.clicked(self.selected,self.guid);
			});
		}
	});

	Y.namespace("ModuleSelectedTask").SelectedTask = SelectedTask;

}, "1.0", {requires:["base"]});