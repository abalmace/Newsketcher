var newsketcherClient;

YUI().use('node','node-load','newsketcher_client','connectionserver', function(Y) {
 
	var configClient;
	var activityDesigner;
	var taskcreator;
	var personCreator;
	var showContainerCircle;
	function init()
	{
		Y.ModuleConnectionServer.getJSON('/config.json',function(config)
		{
			config.hostname = window.location.hostname
			configClient = config;
			
			Y.one('#ajaxContainer').load('/partialView/login.ejs', _submitLogin); 	
		});
		
		Y.one('#btnActivityLeader').on('click', function(e)
		{
			memoryFree();
			Y.one('#ajaxContainer').load('/partialView/mainContainer.ejs', function(){}); 	
			e.stopImmediatePropagation()
		});
		
		Y.one('#btnTaskLeader').on('click', function(e)
		{
			Y.one('#ajaxContainer').load('/partialView/definerTaskContainer.ejs', function(e)
			{
			
				Y.use('taskcreator', function(Y)
				{
					memoryFree();
					taskcreator = new Y.ModuleTask.TaskCreator({client:newsketcherClient});
				});
			});
			e.stopImmediatePropagation()
		});
		
		Y.one('#btnGroupLeader').on('click', function(e)
		{
			var node = Y.one('#ajaxContainer');
			node.load('/partialView/definerGroupContainer.ejs',null,function()
			{
				Y.use('activity-designer', function(Y)
				{
					memoryFree();
					activityDesigner = new Y.NewSketcher.ActivityDesigner({client:newsketcherClient});
				});
				
			}); 
			e.stopImmediatePropagation()
		});
		
		Y.one('#personAdd').on('click', function(e)
		{
			var node = Y.one('#ajaxContainer');
			node.load('/partialView/personCreator.ejs',null,function()
			{
				Y.use('personcreator', function(Y)
				{
					memoryFree();
					personCreator = new Y.ModulePeople.PersonCreator({client:newsketcherClient});
				});
				
			}); 
			e.stopImmediatePropagation()
		});
		
		Y.one('#btnSelectTask').on('click', function(e)
		{
			var node = Y.one('#ajaxContainer');
			node.load('/partialView/screenSelectTask.ejs',null,function()
			{
				Y.use('showcontainercircle', function(Y)
				{
					memoryFree();
					showContainerCircle = new Y.ModuleContainerCircle.ShowContainerCircle({client:newsketcherClient,container:'div_containerSelectorTask'});
				});
				
				
			}); 
			e.stopImmediatePropagation()
		});
	
	}
	
	function _submitLogin()
	{
		Y.one('#signIn').on('click', function(e)
			{
				Y.ModuleConnectionServer.getJSON('/channel/Person/'+Y.one('#login_UserName').get('value')+'/'+Y.one('#login_Password').get('value')+'/person.json',function(data)
				{
					continueOrLogAgain(data.person && data.person[0])
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
		}
		//wrong user - pass
		else
		{
			
		}
	}
	
	function memoryFree()
	{
		if(showContainerCircle)
		{
			showContainerCircle.destroy();
			showContainerCircle = null;
		}
		
	}
 
     Y.on("domready", init); 
});



