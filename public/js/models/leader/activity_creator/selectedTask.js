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
		title:
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
		,subTasks:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(SelectedTask, Y.ModuleGeneric.AnimationContainer,
	{
		initializer: function(data)
		{
			this.dom = data.dom;
			this.title = data.title;
			this.guid = data.guid;
			this.subTasks = data.subTasks;
			this.clicked = data.clicked;
			this.selected = false;
			
			this._defineDOMElement();
			this._addEvents();
			this._addSubTasks();
		},

		destructor : function()
		{
		
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
			var ui = new Y.ModuleTask.TaskContainerDDUI({dom:this.dom,title:this.title})
		},

		_addEvents : function(e)
		{
			var dom = $(this.dom);
			var self = this;
			dom.bind('click',function(e)
			{
				self.clickEvent();
				if(self.clicked)
					self.clicked(self.selected,self.guid);
			});
		},
	  
		clickEvent : function()
		{
			if(!this.selected)
			{
				$(this.dom).addClass('gButtonSelected');
			}
			else
			{
				$(this.dom).removeClass('gButtonSelected');
			}
			this.selected = !this.selected;
		},
	  
		_addSubTasks:function()
		{
			var self = this;
			Y.Array.each(this.subTasks,function(s)
			{
				self._addSubTask(s);
			});
		},
	  
		_addSubTask:function(data)
		{
			data.dom = document.createElement('li');
			this.addElement(data,null,false);
			new Y.ModuleTask.SubTaskUI(data)
			
		}
	});

	Y.namespace("ModuleLeader").SelectedTask = SelectedTask;

}, "1.0", {requires:["animationcontainer","subtaskui","taskcontainerddui"]});