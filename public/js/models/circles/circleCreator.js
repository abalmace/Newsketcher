YUI.add("modulecircle", function(Y)
{
	/* Any frequently used shortcuts, strings and constants */
	var Lang = Y.Lang;

	/* MyComponent class constructor */
	function CircleCreator(data)
	{
		CircleCreator.superclass.constructor.apply(this, arguments);
	}
	CircleCreator.NAME = "moduleCircle";

	CircleCreator.ATTRS =
	{
		client:
			{
			value:null
			}
		,callback:
			{
			value:null	
			}
		,prefixIdCircle:
			{
			value:null
			}
		,modal:
			{
			value:null
			}
	};

	Y.extend(CircleCreator, Y.Base,
	{

		initializer: function(data)
		{
			client = data.client;
			callback = data.function;
			prefixIdCircle = "circle_";
			this._createModal();
		},

		destructor : function()
		{
			client = null;
			callback = null;
			modal.destructor();
			
		},


		_createModal : function()
		{
			var self = this;
			modal = new Y.Overlay(
			{
						
			srcNode : '#modalCircleCreator'
			,width : '540px'
			,height : '300px'
			,zIndex : 10000
			,centered : true
			,constrain : true
			,render : true
			,visible : false
			,plugins :
			[	
				{ fn: Y.Plugin.OverlayModal },
				{ fn: Y.Plugin.OverlayKeepaligned },
				{ fn: Y.Plugin.OverlayAutohide }
			]
								
			});
			
			Y.one('#circleAdd').on('click', Y.bind(modal.show, modal));
		
			var modalDOM = Y.one('#modalCircleCreator');
			
			modalDOM.one('.cancelModal').on('click', Y.bind(modal.hide, modal));
			modalDOM.one('.createModal').on('click', function(e)
			{
				modal.hide();
				self._createCircle(modalDOM.one('.textModal').get('value'));
			});
		},
	  
		_createCircle : function(name)
		{
			var data = 
				{
				name:name
				,guid: prefixIdCircle + Utils.guid()
				,status:'add'
				,owner:client.guid
				}
			if(callback.click)
				callback.click(data);
		}
	});

	Y.namespace("moduleCircle").CircleCreator = CircleCreator;

}, "1.0", {requires:['base','node', 'overlay', 'widget-anim', 'gallery-overlay-extras']});

