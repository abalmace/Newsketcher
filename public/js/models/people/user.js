YUI.add("user", function(Y)
{ 
	var Lang = Y.Lang;


	function User(data)
	{
		User.superclass.constructor.apply(this, arguments);
	}


	User.NAME = "user";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	User.ATTRS =
	{
		name:
			{
			value:null
			}
		,guid:
			{
			value:null	
			}
		,nick:
			{
			value:null
			}
		,selected:
			{
			value:false
			}
		,working:
			{
			value:false
			}
		,userType:
			{
			value:null	
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(User, Y.Base,
	{
		initializer: function(data)
		{
			this.name = data.name;	//nombre de usuario
			this.guid = data.guid;		//id de usuario
			this.nick = data.nick;	//nick de usuario
			this.selected = data.selected;	//el usuario puede entrar a la habitación
			this.working = data.working;		//el usuario esta trabajando en la room
			this.userType = data.type;		//tipo de usuario ( Follower - Leader )

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
	  
		to_json : function()
		{
			var data =
			{
				name : this.name
				,guid: this.guid
				,nick : this.nick
				,selected : this.selected
				,working : this.working
				,userType : this.userType
			}
			return data;
		}
	});

	Y.namespace("ModulePeople").User = User;

}, "1.0", {requires:['base']});