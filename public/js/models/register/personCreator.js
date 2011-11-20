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
		name:
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
		,btnCreate:
			{
			value:null	
			}
		,notification:
			{
			value:null	
			}	
		,callback:
			{
			value:null	
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(PersonCreator, Y.Base,
	{
		initializer: function(data)
		{	
			this.callback = data.callback;
			this.notification = new Y.ModuleNotification.Notification();
			this._addEvents();
		},

		destructor : function()
		{
			this.btnCreate.destroy();
			this.cient = null;
		},

		_addEvents : function(e)
		{
			this.btnCreate = Y.one('#signUp');
			var self = this;
			this.btnCreate.on('click', function(e)
			{
				var data = self._createPerson();
				self._sendUserData(data);
			});
		},
	  
		_createPerson : function()
		{
			var nodeName = Y.one('#login_name');
			var nodeNick = Y.one('#login_userName');
			var nodeUserType = Y.one('#login_userType');
			var nodePassword = Y.one('#login_password');
			var nodePasswordR = Y.one('#login_retypePassword');
			
			var data =
			{
				name : nodeName.get('value')
				,nick : nodeNick.get('value')
				,password: nodePassword.get('value')
				,userType : nodeUserType.get('value')
				,guid : Utils.guid()
			}
			
			return data;
		},
	  
		_sendUserData: function(data)
		{
			var self = this;
			var bool;
			Y.ModuleConnectionServer.getJSON('/channel/Person/'+data.name+'/'+data.nick+'/'+data.password+'/'+data.userType+'/'+data.guid+'/bool.json',function(data)
			{
				if(data && data.bool)
				{
					var info =
					{
					icon:'./css/images/user_on.png'
					,title:'Register'
					,content:'The user was successfully created'	
					}
					self.notification.notify(info,'simple');
					self.callback && self.callback()
				}	
			});
		}
	});

	Y.namespace("ModulePeople").PersonCreator = PersonCreator;

}, "1.0", {requires:['base','connectionserver','notification']});