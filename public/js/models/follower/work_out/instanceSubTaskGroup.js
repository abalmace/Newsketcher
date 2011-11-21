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
	};

    /* MyComponent extends the Base class */
	Y.extend(InstanceSubTaskGroup, Y.ModuleGeneric.GenericGroup,
	{
		initializer: function(data)
		{
			this.client = data.client;
			this.group = data.group;
			
			this._subscriptionsInit();
			this.addPeople();
			this._showContainer();
			this.joinRoom({guid:this.client.guid});
			this._whoIsHere();
		},

		destructor : function()
		{
			Y.Array.each(this.subscriptions, function(s)
			{
				s.cancel();
			});
			this.leaveRoom({guid:this.client.guid})
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
			{
				this._addPerson(data);
			}
			else
				this._changeClass(data,this.icon);
			
		},

		leave : function(data)
		{
			this._changeClass(data,this.icon_off)
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
			
		},
	  
		_whoIsHere:function()
		{
			this.client.sendSignal(this.roommatePath(),{status:'answer'});
		}
	});

	Y.namespace("ModuleTask").InstanceSubTaskGroup = InstanceSubTaskGroup;

}, "1.0", {requires:['base','genericgroup','user']});