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
		,people:
			{
			value:[]
			}
		,container:
			{
			value:null
			}
		,prefixIdTask:
			{
			value:null
			}
		,del:
			{
			value:null	
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(GroupWizard, Y.ModuleGeneric.GenericGroup,
	{
		initializer: function(data)
		{
			this.client = data.client;
			this.people = data.people;
			this.stringAddRoommate = "roommate_";
			this.stringClassBase = "roommateIconBase ";
			this.ROOMMATE_ICON_ADD = "roommateIconAdd";
			this.roommateIconRemove = "roommateIconRemoveOff";
			this.ROOMMATE_ICON_REMOVE_ON = "roommateIconRemoveOn";
			this.ROOMMATE_BASE = "roommate ";
			this.ROOMMATE_ICON_BASE = "roommateIconBase ";
			
			this.addPeople();

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

		addPeople : function()
		{
		// Download roommates
			var self = this;
			Y.Array.each(this.people, function(person)
			{
				self.add(person);
			});	
		},

		add : function(data)
		{
			//ver si el usuario a agregar soy yo
			if(data.guid == (this.client.guid))
				return;
			//Ver si el usuario ya ha sido agregado
			var roommate = this.searchRoommate(data.guid);
			//Agregar el usuarios si no existe
			if(!roommate)
			{
				if(data.userType == 'leader')
					this.addLeader(data);
				else if(data.selected)
				{
					if(!data.working)
						this.addWithClass(data,"roommateIconRemoveOff");
					else
						this.addWithClass(data,"roommateIconRemoveOn");
				
				}
				else
					this.addWithClass(data,"roommateIconAdd");
				
			}
			else if(roommate)
			{
				if(!data.working)
					this.leave(data);
				else if(data.selected)
					this.changeClass(data,"roommateIconRemoveOn");
				else
					this.changeClass(data,"roommateIconRemoveOff");
			}
		},

		leave : function(data)
		{
			this.changeClass(data,"roommateIconAdd")
		},

		addWithClass : function(data, classRoommate)
		{
			var roommate = this.addInContainer(data,classRoommate);
			this.addEvent(roommate);
		},

		addLeader : function(data)
		{
			this.addInContainer(data, "roommateIconLeader");
		},
	  
		addInContainer : function(data, classRoommate)
		{
			var self = this;
			var divUser = document.createElement('div');
			divUser.className = "roommate";
			var id = data.guid || Utils.guid();
			divUser.id = id
			
			var divIcon = document.createElement('div');
			divIcon.className = this.stringClassBase+classRoommate;
			
			var spanName = document.createElement('span');
			spanName.className = "roommateName";
			spanName.innerText = data.name;
			
			$(divUser).prepend(spanName);
			$(divUser).prepend(divIcon);
			self.element.prepend(divUser);
			
			var roommate = new Y.ModulePeople.User(
				{ 
					name:data.name
					,nick: data.nick
					,guid: id
					,selected : data.selected
					,working: data.working
				});

			this.roommatesContainer.push(roommate)
			
			return $(divUser);
		},

		addEvent : function(roommate)
		{
			var self = this;
			roommate.click(function()
			{
				var id = this.id;
				self.userClick(id);
				
			});
		},

		userClick : function(id)
		{
			var roommate = this.searchRoommate(id);
			roommate.selected = !roommate.selected;
			if(roommate.selected)
				this.changeStatusClass(id,this.ROOMMATE_ICON_BASE+this.ROOMMATE_ICON_REMOVE_ON);
			else
				this.changeStatusClass(id,this.ROOMMATE_ICON_BASE+this.ROOMMATE_ICON_ADD);
				
		}
	});

	Y.namespace("ModuleTask").GroupWizard = GroupWizard;

}, "1.0", {requires:['base','genericgroup','user']});