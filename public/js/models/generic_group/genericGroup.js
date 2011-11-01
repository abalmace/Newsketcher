YUI.add("genericgroup", function(Y)
{ 
	var Lang = Y.Lang;


	function GenericGroup(data)
	{
		GenericGroup.superclass.constructor.apply(this, arguments);
	}


	GenericGroup.NAME = "genericGroup";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	GenericGroup.ATTRS =
	{
		client:
			{
			value:null
			}
		,element:
			{
			value:null	
			}
		,container:
			{
			value:null
			}
		,subscriptions:
			{
			value:[]
			}
		,prefixIdTask:
			{
			value:null
			}
		,edit:
			{
			value:null	
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(GenericGroup, Y.Base,
	{
		initializer: function(data)
		{
			this.element = $('#divRoommateContainer');	//elemento html utilizado como contenedor 
			this.subscriptions = [];			//arreglo que contiene todas las subcripciones
			this.roommatesContainer = [];			//compañeros
			this.edit = data.edit;
			this.show = data.show;
			this.client = data.client;
			this.roomName = data.roomName;
			this.active = false;
			this.stringAddRoommate = "roommate_";
			
			this.element.empty();
			this.subscriptionsInit();

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

		subscriptionsInit : function()
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
			}));
		},
		
		addRoommates : function(data)
		{
			data.status = "join";
			data.working = true;
			this.client.sendRoommatesSignal(this, data)
		},

		leaveRoom : function(data)
		{
			data.working = false;
			data.status = 'leave';
			this.client.sendRoommatesSignal(this,data)
		},

		quitRoom : function(data)
		{
			var roommate = this.searchRoommate(data.id);
			
			if (roommate)
			{
				var node = document.getElementById(data.id);
				var parent =node.parentNode;
				parent.removeChild(node);
				this.removeRoommate(roommate);
				room.stop();
			}

		},

		changeClass : function(data,className)
		{
			var user = document.getElementById(data.guid);
			user.className = this.stringClassBase+className
		},

		joinRoom : function(data) 
		{
			var self = this;
			self.roommatesContainer = self.roommatesContainer || self.createRoommateContainer();	
			self.roommatesContainer.addRoommates(data)
		},

		createRoommateContainer : function()
		{
			var self = this;
			var data = 
			{
				enabled : self.enabled
				,show : self.show
			};
				
			return new Roomates(data);
		},

		roommatePath : function()
		{
			return '/roommates/' + this.stringAddRoommate + this.roomName
		},

		stop : function()
		{
			var self = this;

			_.each(self.subscriptions, function(s)
			{
				s.cancel();
			})
		},

		setVisible : function(visible)
		{
			var node = document.getElementById("divRoommateContainer");
			if(visible)
				node.style.visibility = "visible";
			else
				node.style.visibility = "hidden"
		},

		searchRoommate : function(guid)
		{
			return  _.detect(this.roommatesContainer, function(s) { return s.guid == guid });	
		},

		removeRoommate : function(roommate)
		{
			this.roommatesContainer = _.without(this.roommatesContainer, roommate);
		},

		changeStatusClass : function(id, className)
		{
			var userIcon = $('#'+id+' div.roommateIconBase');
			userIcon.removeClass();
			userIcon.addClass(className);	
		},

		getAllUsers : function()
		{
			return this.roommatesContainer	
		}
	});

	Y.namespace("ModuleGeneric").GenericGroup = GenericGroup;

}, "1.0", {requires:['base']});