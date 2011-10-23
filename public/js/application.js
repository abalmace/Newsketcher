var newsketcherClient;

YUI().use('node','node-load','newsketcher_client','connectionserver', function(Y) {
 
	var configClient;
	function init()
	{
		var activityDesigner;
		var taskcreator;
		var personCreator;
		
		Y.ModuleConnectionServer.getJSON('/config.json',function(config)
		{
			config.hostname = window.location.hostname
			configClient = config;
			
			Y.one('#ajaxContainer').load('/partialView/login.ejs', _submitLogin); 	
		});
		
		Y.one('#btnActivityLeader').on('click', function(e)
		{
			Y.one('#ajaxContainer').load('/partialView/mainContainer.ejs', function(){}); 	
			e.stopImmediatePropagation()
		});
		
		Y.one('#btnTaskLeader').on('click', function(e)
		{
			Y.one('#ajaxContainer').load('/partialView/definerTaskContainer.ejs', function(e)
			{
			
				Y.use('taskcreator', function(Y)
				{
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
					personCreator = new Y.ModulePeople.PersonCreator({client:newsketcherClient});
				});
				
			}); 
			e.stopImmediatePropagation()
		});
	/*
		//select all the a tag with name equal to modal
			//Get the A tag
			var id = "#dialog1";
		
			//Get the screen height and width
			var maskHeight = $(document).height();
			var maskWidth = $(window).width();
		
			//Set heigth and width to mask to fill up the whole screen
			$('#mask').css({'width':maskWidth,'height':maskHeight});
			
			//transition effect		
			$('#mask').fadeIn(1000);	
			$('#mask').fadeTo("slow",0.8);	
		
			//Get the window height and width
			var winH = $(window).height();
			var winW = $(window).width();
		
			//Set the popup window to center
			$(id).css('top',  winH/2-$(id).height()/2);
			$(id).css('left', winW/2-$(id).width()/2);
		
			//transition effect
			$(id).fadeIn(2000);
			
			var data =
				{
				name:name
				,username:Utils.guid()
				,usertype:"hola"
				}
			*/




		
			/*
			//if close button is clicked
		$('.window .close').click(function (e)
		{
			//Cancel the link behavior
			e.preventDefault();
			var configClient; 
			$('#mask').hide();
			$('.window').hide();
			var name = $("#name").attr('value');
			var username = $("#username").attr('value');
			var usertype = $("#userType").attr('value');
			var data =
				{
				name:name
				,username:username
				,usertype:usertype
				}
			initMapSketcher(data);
		});	

	*/
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
 
     Y.on("domready", init); 
     
     var initMapSketcher = function(data)
{
	
	

	$("a[rel]").overlay(
	{
		mask:
		{
			color: '#ebecff'
			,loadSpeed: 200
			,opacity: 0.9
			,onLoad: function(){$('#name').focus()}
			, onClose: function(){$('#workspace').focus()}
		}
	})
	
}

});



