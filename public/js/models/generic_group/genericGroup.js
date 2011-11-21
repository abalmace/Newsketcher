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
		,edit:
			{
			value:null	
			}
		,icon:
			{
			value:null
			,getter:function()
				{
				return this.icon
				}
			}
		,icon_off:
			{
			value:null	
			,getter:function()
				{
				return this.icon_off
				}
			}
		,stringAddRoommate:
			{
			value:null
			,getter:function()
				{
				return this.stringAddRoommate
				}
			}
		,stringClassBase:
			{
			value:null
			,getter:function()
				{
				return this.stringClassBase
				}
			}
		,roomName:
			{
			value:null	
			}
		,roommatesContainer:
			{
			value:[]
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(GenericGroup, Y.Base,
	{
		initializer: function(data)
		{
			this.element = Y.one('#divRoommateContainer');	//elemento html utilizado como contenedor 
			this.subscriptions = [];			//arreglo que contiene todas las subcripciones
			this.roommatesContainer = [];			//compañeros
			this.edit = data.edit;
			this.client = data.client;
			this.roomName = data.roomName;
			this.active = false;
			this.stringAddRoommate = "roommate_";
			this.stringClassBase = "roommateIconBase ";
			this.icon =  'roommateIcon';
			this.icon_off = 'roommateIconOff';
			
			this.element.empty();
		},

		destructor : function()
		{
			this.element.empty();
			Y.Array.each(this.roommatesContainer,function(roommate)
			{
				roommate.destroy();
			});
		},

		joinRoom : function(data)
		{
			data.status = "join";
			data.working = true;
			this.client.sendSignal(this.roommatePath(), data)
		},

		leaveRoom : function(data)
		{
			data.working = false;
			data.status = 'leave';
			this.client.sendSignal(this.roommatePath(),data)
		},

		_changeClass : function(data,className)
		{
			var dom = document.getElementById(data.guid);
			var node = Y.one(dom);
			node = node.one('div.roommateIconBase');
			node.set('className',this.stringClassBase+className);
		},

		roommatePath : function()
		{
			return '/roommates/' + this.stringAddRoommate + this.roomName
		},

		setVisible : function(visible)
		{
			var node = document.getElementById("divRoommateContainer");
			if(visible)
				node.style.visibility = "visible";
			else
				node.style.visibility = "hidden"
		},

		removeRoommate : function(roommate)
		{
			this.roommatesContainer = _.without(this.roommatesContainer, roommate);
		},

		getAllUsers : function()
		{
			return this.roommatesContainer	
		},
	  
		_searchRoommate : function(guid)
		{
			return  _.detect(this.roommatesContainer, function(s) { return s.guid == guid });	
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
	  
		_addInContainer:function(data)
		{
			var roommate = new Y.ModulePeople.User(
			{ 
				name:data.name
				,nick: data.nick
				,guid: data.guid
				,selected:data.selected
				,working: data.working
			});

			this.roommatesContainer.push(roommate)
		},
	  
		_visible:function(bool)
		{
			if(bool)
				this.element.setStyle('visibility','visible');
			else
				this.element.setStyle('visibility','hidden');
				
		}
	});

	Y.namespace("ModuleGeneric").GenericGroup = GenericGroup;

}, "1.0", {requires:['base']});