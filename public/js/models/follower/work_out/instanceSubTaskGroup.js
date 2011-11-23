YUI.add("instancesubtaskgroup", function(Y)
{ 
	var Lang = Y.Lang;


	function InstanceSubTaskGroup(data)
	{
		InstanceSubTaskGroup.superclass.constructor.apply(this, arguments);
	}


	InstanceSubTaskGroup.NAME = "instanceSubTaskGroup";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	InstanceSubTaskGroup.ATTRS =
	{
		client:
			{
			value:null
			}
		,group:
			{
			value:[]
			}
		,subscriptions:
			{
			value:[]
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(InstanceSubTaskGroup, Y.ModuleGeneric.GenericGroup,
	{
		initializer: function(data)
		{
			this.client = data.client;
			this.group = data.group;
			this.subscriptions = [];
			this._subscriptionsInit();
// 			this.addPeople();
// 			this._showContainer();
// 			this.joinRoom({guid:this.client.guid});
// 			this._whoIsHere();
		},

		destructor : function()
		{
			
			//this.leaveRoom({guid:this.client.guid})
		},
		
		stop:function()
		{
			_.each(this.subscriptions, function(s)
			{
				s.cancel();
				s.cancel();
			});
		},
	  
		addPeople : function()
		{
		// Download roommates
			var self = this;
			Y.Array.each(this.group, function(person)
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
			var roommate = this._searchRoommate(data.guid);
			//Agregar el usuarios si no existe
			if(!roommate)
				this._addPerson(data,data.selected);
			else
				this._changeClassIndicator(data,this.onlineClass)
			
		},

		leave : function(data)
		{
			this.changeClassIndicator(data,this.offlineClass)
		},

		
		_showContainer:function()
		{
			this._visible(this.group.length>1);
		},
		
		_subscriptionsInit : function()
		{
			var self = this;
			
			//suscribirse a grupo de trabajo (Roommates)
			self.subscriptions.push(self.client.subscribe(self.roommatePath(), function(data) {
				if (data.status == 'join')
					self.add(data);
				else if (data.status == 'leave')
					self.leave(data);
				else if(data.status =='quit')
					self.quitRoom(data);
				else if(data.status =='answer')
					self.joinRoom({guid:self.client.guid});
			
			}));
			
			self.subscriptions[0].cancel();
			this.leaveRoom({guid:this.client.guid})
			
		},
	  
		_whoIsHere:function()
		{
			this.client.sendSignal(this.roommatePath(),{status:'answer'});
		},
	  
		_addPerson : function(data,selected)
		{
			var self = this;
			var divUser = document.createElement('div');
			divUser.className = "roommate";
			var id = data.guid || Utils.guid();
			divUser.id = id
			
			var divIcon = document.createElement('div');
			divIcon.className = this.stringClassBase;
			divIcon.className += selected?this.icon:this.icon_off;
			
			var divIndicator = document.createElement('div');
			divIndicator.className = this.stringClassIndicatorBase+this.offlineClass;
			
			
			var spanName = document.createElement('span');
			spanName.className = "roommateName";
			spanName.innerText = data.name;
			
			
			var nodeUser = Y.one(divUser)
			nodeUser.prepend(spanName);
			nodeUser.prepend(divIcon);
			nodeUser.prepend(divIndicator);
			this.element.prepend(divUser);
			
			data.guid = id;
			
			this._addInContainer(data);
			
			return Y.one(divUser);
		},
	});

	Y.namespace("ModuleTask").InstanceSubTaskGroup = InstanceSubTaskGroup;

}, "1.0", {requires:['base','genericgroup','user']});