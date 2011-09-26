function User(options)
{	
	this.name = options.name;	//nombre de usuario
	this.guid = options.guid;		//id de usuario
	this.nick = options.nick;	//nick de usuario
	this.selected = options.selected;	//el usuario puede entrar a la habitación
	this.working = options.working;		//el usuario esta trabajando en la room
	this.userType = options.type;		//tipo de usuario ( Follower - Leader )
}	
