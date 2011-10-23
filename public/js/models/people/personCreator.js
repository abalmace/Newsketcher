YUI.add("personcreator", function(Y)
{ 
	var Lang = Y.Lang;


	function PersonCreator(data)
	{
	PersonCreator.superclass.constructor.apply(this, arguments);
	}


	PersonCreator.NAME = "personcreator";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	PersonCreator.ATTRS =
	{
		client:
			{
			value:null
			}
		,name:
			{
			value:null	
			}
		,nick:
			{
			value:null	
			}
		,password:
			{
			value:null	
			}
		,guid:
			{
			value:null
			}
		,userType:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(PersonCreator, Y.Base,
	{
		initializer: function(data)
		{
			this.client = data.client;
			
			this._addEvents();

			this.publish("myEvent", {
			defaultFn: this._defMyEventFn,
			bubbles:false
			});
		},

		destructor : function()
		{
			this.cient = null;
		},

		_addEvents : function(e)
		{
			var buttonCreate = Y.one('#buttonAddPerson');
			var self = this;
			buttonCreate.on('click', function(e)
			{
				var data = self._createPerson();
				self.client.sendSignal(self._subscribePath(), data);
			});
		},
	  
		_createPerson : function()
		{
			var node = Y.one('#divCreatorPeople');
			var nodeName = node.one('.selector_name');
			var nodeNick = node.one('.selector_nick');
			var nodePassword = node.one('.selector_passwordR');
			var nodePasswordR = node.one('.selector_passwordR');
			
			var data =
			{
				name : nodeName.get('value')
				,nick : nodeNick.get('value')
				,password: nodePassword.get('value')
				,guid : Utils.guid()
				,status : 'new'
			}
			
			return data;
		},
	  
		_subscribePath : function()
		{
			return '/channel/People/person'
		}
	});

	Y.namespace("ModulePeople").PersonCreator = PersonCreator;

}, "1.0", {requires:["base"]});