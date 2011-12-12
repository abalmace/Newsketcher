YUI.add("person", function(Y)
{ 
	var Lang = Y.Lang;


	function Person(data)
	{
	Person.superclass.constructor.apply(this, arguments);
	}


	Person.NAME = "person";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	Person.ATTRS =
	{
		dom:
			{
			value:null
			}
		,name:
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
			value:false
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(Person, Y.Base,
	{
		initializer: function(data)
		{
			this.dom = data.dom;
			this.name = data.name;
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
			name:this.name
			,guid:this.guid
			}
			return data;
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

		_defineDOMElement : function()
		{	
			var self = this;
		
			var divIcon = document.createElement('div');
			divIcon.className = 'cssIconPerson';
			
			var spanName = document.createElement('span');
			spanName.className = "cssNamePerson";
			spanName.innerText = this.name;
			
			
			var nodeUser = Y.one(self.dom)
			nodeUser.prepend(spanName);
			nodeUser.prepend(divIcon);
			
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
		}
	});

	Y.namespace("ModulePerson").Person = Person;

}, "1.0", {requires:["base"]});