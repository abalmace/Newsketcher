var mapSketcherClient;
$(document).ready(function()
{
	var activityDesigner;
	
	$('#btnActivityLeader').click(function(e){
		var data =
			{
			name:'mila'
			,username:'mila'
			,usertype:"Leader"
			}
		$('#ajaxContainer').load('/partialView/mainContainer.ejs', function(){initMapSketcher(data)}); 	
	});
	
	$('#btnTaskLeader').click(function(e){
		$('#ajaxContainer').load('/partialView/definerTaskContainer.ejs'); 
	});
	
	$('#btnGroupLeader').click(function(e){
		$('#ajaxContainer').load('/partialView/definerGroupContainer.ejs', function()
		{
			activityDesigner = new ActivityDesigner({client:mapSketcherClient});
			
		}); 
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

	
	
});

var initMapSketcher = function(data)
{
	jQuery.getJSON('/config.json', function(config)
	{
		config.hostname = window.location.hostname
		mapSketcherClient = new MapSketcherClient(config,data);
		mapSketcherClient.launch();
	});
	
	

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


