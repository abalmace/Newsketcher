YUI.add("newsketcher_client", function(Y)
{ 
	var Lang = Y.Lang;


	function NewsketcherClient(options,data)
	{
	NewsketcherClient.superclass.constructor.apply(this, arguments);
	}


	NewsketcherClient.NAME = "newsketcherClient";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	NewsketcherClient.ATTRS =
	{
		settings:
			{
			value:[]
			}
		,socket:
			{
			value:[]	
			}
		,guid:
			{
			value:null
			}
		,name:
			{
			value:null
			}
		,userType:
			{
			value:null
			}
		,nick:
			{
			value:null
			}
		,currentRoomId:
			{
			value:null
			}
		,activeRoom:
			{
			value:null
			}
		,instanceSubTaskGroup:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(NewsketcherClient, Y.Base,
	{
		initializer: function(data)
		{
			var options = data.options;
			var data = data.data;
			
			this.settings =
			{
				port: options.port
				,hostname: options.hostname	
			};
		/*
		* Setup BayeauxClient
		*/
			this.socket = new Faye.Client("http://"
				+ this.settings.hostname
				+ ':' + this.settings.port 
				+ '/socket', {
				timeout: 120
			});
			
		/*
		 * fin setup BayeauxClient
		 */
		
			this.guid = data.guid || Utils.guid();
			this.name = data.name || "unknow";
			this.userType = data.usertype || "follower";
			this.nick = data.nick || this.name;
			
			this._sendInfoToServer();

		},

		destructor : function()
		{
			this.socket = null;
			this.settings = null;
		},

		/* MyComponent specific methods */

		subscribe : function(chanel,callback)
		{
			return this.socket.subscribe(chanel,callback);
		},

		sendSignal : function(path, data)
		{		
			this.socket.publish(path, data);
		},
	  
		getWorkspaceMapDom : function()
		{
			return document.getElementById('map');
		},
	  
		_sendInfoToServer:function()
		{
			var data = 
			{
				name:this.name
				,guid:this.guid
			}
			this.sendSignal('/user/connect',data);
		}
	});

	Y.namespace("NewSketcher").NewsketcherClient = NewsketcherClient;

}, "1.0", {requires:["base"]});