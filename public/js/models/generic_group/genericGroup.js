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
		,stringClassIndicatorBase:
			{
			value:null
			,getter:function()
				{
				return this.stringClassIndicatorBase
				}
			}
		,onlineClass:
			{
			value:null
			,getter:function()
				{
				return this.onlineClass
				}
			}
		,offlineClass:
			{
			value:null
			,getter:function()
				{
				return this.offlineClass
				}
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(GenericGroup, Y.Base,
	{
		initializer: function(data)
		{
			this.element = Y.one('#divRoommateContainer');	//elemento html utilizado como contenedor 
			this.roommatesContainer = [];			//compañeros
			this.edit = data.edit;
			this.client = data.client;
			this.roomName = data.roomName;
			this.active = false;
			this.stringAddRoommate = "roommate_";
			this.stringClassBase = "roommateIconBase ";
			this.icon =  'roommateIcon';
			this.icon_off = 'roommateIconOff';
			this.stringClassIndicatorBase = "indicator_roommate ";
			this.onlineClass = "onLine_roommate";
			this.offlineClass = "offLine_roommate";
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

		_leaveRoom : function(data)
		{
			data.working = false;
			data.status = 'leave';
			this.client.sendSignal(this.roommatePath(),data)
		},
	  
		_changeClassIndicator : function(data,className)
		{
			var dom = document.getElementById(data.guid);
			var node = Y.one(dom);
			node = node.one('div.'+this.stringClassIndicatorBase);
			node.set('className',this.stringClassIndicatorBase+className);
		},
	  
		_changeClassIcon : function(data,className)
		{
			var dom = document.getElementById(data.guid);
			var node = Y.one(dom);
			node = node.one('div.roommateIconBase');
			node.set('className',this.stringClassBase+className);
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

}, "1.0", {requires:['base','user']});