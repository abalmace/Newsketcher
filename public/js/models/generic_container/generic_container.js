YUI.add("generic_container", function(Y)
{ 
	var Lang = Y.Lang;


	function Generic_Container(data)
	{
		Generic_Container.superclass.constructor.apply(this, arguments);
	}


	Generic_Container.NAME = "generic_container";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	Generic_Container.ATTRS =
	{
		dom:
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
			}	
	};

    /* MyComponent extends the Base class */
	Y.extend(Generic_Container, Y.Base,
	{
		initializer: function(data)
		{
			this.dom = data.dom || document.createElement('div');		//elemento html que representa al módulo
			this.LIFP = data.LIFP
			this.elements = [];
			this.container = Y.one(this.dom);
		},

		destructor : function()
		{
			var self = this;
			Y.Array.each(self.elements, function(element)
			{
				element.destroy();
			});
		},
	  
		/*
		 * LIFP: Last In First Position
		 */
		addElement : function(data,classElement)
		{
			var dom = data.dom || document.createElement('div');
			var guid = data.guid || Utils.guid();
			dom.id = dom.id || guid;
			data.dom = dom;
			data.guid = guid;
			if(classElement)
			{
				var element = new classElement(data);
				this.elements.push(element);
			}
			if(!this.LIFP)
				this.container.appendChild(dom);
			else
				this.container.prepend(dom);
			
			return dom;
		},
	  
		removeElement:function(guid)
		{
			
		},
		
		removeAll:function()
		{
			Y.Array.each(this.elements, function(s)
			{
				s.destroy();
			});
			this.elements = [];
			this.container.all('*').remove();
		},
	  
		getDOMContainer : function()
		{
			return this.container.getDOMNode();
		},
	  
		getDOMElementContainer:function()
		{
			return this.dom;
		},
	  
		getElement:function(guid)
		{
			var self = this;
			var element = _.detect(self.elements, function(s) { return s.guid == guid });
			
			return element;
		}
	});

	Y.namespace("ModuleContainer").Generic_Container = Generic_Container;

}, "1.0", {requires:['base','node']});