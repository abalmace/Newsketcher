var newsketcherClient;

YUI().use('node','node-load','newsketcher_client','connectionserver', function(Y) {
 
	var configClient;
	var activityDesigner;
	var taskcreator;
	var personCreator;
	var showContainerCircle;
	var activity;
	var login = true;
	
	function _init()
	{
		Y.ModuleConnectionServer.getJSON('/config.json',function(config)
		{
			config.hostname = window.location.hostname
			configClient = config;
			
			Y.one('#ajaxContainer').load('/partialView/login.ejs', _logScreen); 	
		});
	}
	
	function _logScreen()
	{
		memoryFree();
		_logIn();
		_singUp();
	}
	
	function _logIn()
	{
		Y.one('#signIn').on('click', function(e)
		{
			var userName = Y.one('#login_UserName').get('value');
			var password = Y.one('#login_Password').get('value');
			Y.ModuleConnectionServer.getJSON('/channel/Person/'+userName+'/'+password+'/person.json',function(data)
			{
				continueOrLogAgain(data.person && data.person[0])
			});
		});
		
	}
	
	function _singUp()
	{
		var btnRegister = Y.one('#register');
		btnRegister.on('click', function(e)
		{
			Y.one('#ajaxContainer').load('/partialView/register.ejs', _registerForm); 
		});
	}
	
	function _registerForm()
	{
		Y.one('#login_form').on('click', function(e)
		{
			Y.one('#ajaxContainer').load('/partialView/login.ejs', _logScreen); 
		});
		
		Y.use('personcreator', function(Y)
		{
			memoryFree();
			personCreator = new Y.ModulePeople.PersonCreator(
			{
				callback:function()
				{
					Y.one('#ajaxContainer').load('/partialView/login.ejs', _logScreen); 
				}
			});
		});
	}
	
	function continueOrLogAgain(person)
	{
		memoryFree();
		//athenticate
		if(person)
		{
			var data =
				{
				name:person.name
				,nick:person.nick
				,userType:person.userType
				,guid:person.guid
				};
			newsketcherClient = new Y.NewSketcher.NewsketcherClient({options:configClient,data:data});
			if(person.userType == 'leader')
			{
				_activityDesigner()
			}
			else if(person.userType == 'follower')
			{
				_startActivity()
			}
		}
		//wrong user - pass
		else
		{
			alert("no esta en la base de datos");
		}
	}
	
	function _startActivity()
	{
	
		var node = Y.one('#ajaxContainer');
		node.load('/partialView/follower/activityWorkOut.ejs',null,function()
		{
			Y.use('showcontainercircle','showcontainercirclefollower', function(Y)
			{
				memoryFree();
				showContainerCircle = new Y.ModuleFollower.ShowContainerCircleFollower(
				{
					client:newsketcherClient
					,container:'div_containerSelectorTask'
					,callback :
					{
						click:function(data)
						{
							//_startTask(data);
						}
					}
				});
			});
			
		}); 
	}
	
	function _mainMenuLeader()
	{
		var node = Y.one('#ajaxContainer');
		node.load('/partialView/mainMenuLeader.ejs',null,function()
		{	
			Y.one('#btn_create_task').on('click', function(e)
			{
				Y.one('#ajaxContainer').load('/partialView/leader/definerTask.ejs', function(e)
				{
				
					Y.use('taskcreator', function(Y)
					{
						memoryFree();
						taskcreator = new Y.ModuleTask.TaskCreator({client:newsketcherClient});
					});
				});
				e.stopImmediatePropagation()
			});
			
			Y.one('#btn_create_activity').on('click', function(e)
			{
				var node = Y.one('#ajaxContainer');
				node.load('/partialView/leader/definerGroupContainer.ejs',null,function()
				{
					var btn = Y.one('#closeActivityDesigner');
					btn.on('click', function(e)
					{
						btn.destroy();
						_mainMenuLeader();
					});
					
					Y.use('activity-designer', function(Y)
					{
						memoryFree();
						activityDesigner = new Y.NewSketcher.ActivityDesigner({client:newsketcherClient});
					});
					
				}); 
				e.stopImmediatePropagation()
			});
			
		}); 
	}
	
	function _definerTaskContainer()
	{
		Y.one('#ajaxContainer').load('/partialView/leader/definerTask.ejs', function(e)
		{
			var btnDesigner = Y.one('#changeActivityDesigner');
			btnDesigner.on('click', function(e)
			{
				btnDesigner.destroy();
				btnMonitor.destroy();
				_activityDesigner();
			});
			
			var btnMonitor = Y.one('#changeActivityMonitor');
			btnMonitor.on('click', function(e)
			{
				btnDesigner.destroy();
				btnMonitor.destroy();
				_activityMonitoring();
			});
			
			Y.use('taskcreator', function(Y)
			{
				memoryFree();
				taskcreator = new Y.ModuleTask.TaskCreator(
					{
						client:newsketcherClient
						,li :document.getElementById('divSubTasks')
						,textElement:'SubTasks'
					});
			});
			
			var buttonCreate = Y.one('#buttonAddTask');
			buttonCreate.on('click', function(e)
			{
				var bool = taskcreator.createTask();
				if(bool)
				{
					_definerTaskContainer()
				}
				
			});
		});
	}
	
	function _activityDesigner()
	{
		var node = Y.one('#ajaxContainer');
		node.load('/partialView/leader/definerGroupContainer.ejs',null,function()
		{
			var btnCreator = Y.one('#changeTaskCreator');
			btnCreator.on('click', function(e)
			{
				btnCreator.destroy();
				btnMonitor.destroy();
				_definerTaskContainer();
			});
			var btnMonitor = Y.one('#changeActivityMonitor');
			btnMonitor.on('click', function(e)
			{
				btnCreator.destroy();
				btnMonitor.destroy();
				_activityMonitoring();
			});
			
			Y.use('activity-designer', function(Y)
			{
				memoryFree();
				activityDesigner = new Y.NewSketcher.ActivityDesigner({client:newsketcherClient});
			});
			
		}); 
	}
	
	function _activityMonitoring()
	{
		var node = Y.one('#ajaxContainer');
		node.load('/partialView/leader/activityMonitor.ejs',null,function()
		{
			var btnCreator = Y.one('#changeTaskCreator');
			btnCreator.on('click', function(e)
			{
				btnCreator.destroy();
				btnDesigner.destroy();
				_definerTaskContainer();
			});
			var btnDesigner = Y.one('#changeActivityDesigner');
			btnDesigner.on('click', function(e)
			{
				btnCreator.destroy();
				btnDesigner.destroy();
				_activityDesigner();
			});
			
			Y.use('showcontainercircleleader', function(Y)
			{
				memoryFree();
				showContainerCircle = new Y.ModuleLeader.ShowContainerCircleLeader(
				{
					client:newsketcherClient
					,container:'div_containerSelectorTask'
					,callback :
					{
						click:function(data)
						{
							//_startTask(data);
						}
					}
				});
			});
			
		}); 
	}
	
	function memoryFree()
	{
		if(showContainerCircle)
		{
			showContainerCircle.destroy();
			showContainerCircle = null;
		}
		if(personCreator)
		{
			personCreator.destroy();
			personCreator = null;
		}
		if(activityDesigner)
		{
			activityDesigner.destroy();
			activityDesigner = null;
		}
		if(taskcreator)
		{
			taskcreator.destroy()
			taskcreator = null;
		}
	}
 
     Y.on("domready", _init); 
});



