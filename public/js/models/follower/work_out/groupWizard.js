YUI.add("groupwizard", function(Y)
{ 
	var Lang = Y.Lang;


	function GroupWizard(data)
	{
		GroupWizard.superclass.constructor.apply(this, arguments);
	}


	GroupWizard.NAME = "groupWizard";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	GroupWizard.ATTRS =
	{
		client:
			{
			value:null
			}
		,group:
			{
			value:[]
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(GroupWizard, Y.ModuleGeneric.GenericGroup,
	{
		initializer: function(data)
		{
			this.client = data.client;
			this.group = data.group;
			
			this.addPeople();
			this._showContainer();
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

		addPeople : function()
		{
		// Download roommates
			var self = this;
			Y.Array.each(this.group, function(person)
			{
				self.add(person);
			});	
		},
	  
		getGroup : function()
		{
			return this.roommatesContainer;
		},

		add : function(data)
		{
			if(data.guid == (this.client.guid))
			{
				data.selected = true;
				this._addInContainer(data);
				return;
			}
			var roommate = this._searchRoommate(data.guid);
			//Agregar el usuarios si no existe
			if(!roommate)
			{
				var user = this._addPerson(data);
				this._addEvent(user);
			}
		},

		_addEvent : function(roommate)
		{
			var self = this;
			roommate.on('click', function()
			{
				var id = this.get('id');
				self.userClick(id);
				
			});
		},

		userClick : function(id)
		{
			var roommate = this._searchRoommate(id);
			roommate.selected = !roommate.selected;
			if(roommate.selected)
				this._changeClass({guid:id},this.icon);
			else
				this._changeClass({guid:id},this.icon_off);
				
		},
	  
		_showContainer:function()
		{
			this._visible(this.group.length>1);
		},
	  
		_addPerson : function(data)
		{
			var self = this;
			var divUser = document.createElement('div');
			divUser.className = "roommate";
			var id = data.guid || Utils.guid();
			divUser.id = id
			
			var divIcon = document.createElement('div');
			divIcon.className = this.stringClassBase + this.icon_off;
			
			var spanName = document.createElement('span');
			spanName.className = "roommateName";
			spanName.innerText = data.name;
			
			Y.one(divUser).prepend(spanName);
			Y.one(divUser).prepend(divIcon);
			this.element.prepend(divUser);
			
			data.guid = id;
			
			this._addInContainer(data);
			
			return Y.one(divUser);
		},
	});

	Y.namespace("ModuleTask").GroupWizard = GroupWizard;

}, "1.0", {requires:['base','genericgroup','user']});