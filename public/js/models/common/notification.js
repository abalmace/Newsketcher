YUI.add("notification", function(Y)
{ 
	var Lang = Y.Lang;


	function Notification()
	{
		Notification.superclass.constructor.apply(this, arguments);
	}


	Notification.NAME = "notification";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	Notification.ATTRS =
	{
		notification:
			{
			value:null
			}
		,message:
			{
			value:null
			}
		,type:
			{
			value:null
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(Notification, Y.Base,
	{
		initializer: function()
		{
			this.notification = null;
			this.message = "no notification";
		},

		destructor : function()
		{
			this.notification.ondisplay = null;
			this.notification.onclose = null;
			this.notification = null;
		},

		/* MyComponent specific methods */
		
		notify:function(message,type)
		{
			this.message = message;
			this.type = type;
			this._support();
		},

		_support : function()
		{
			// check for notifications support
			// you can omit the 'window' keyword
			if (window.webkitNotifications)
			{
				console.log("Notifications are supported!");
				this._permission();
			}
			else
			{
				console.log("Notifications are not supported for this Browser/OS version yet.");
			}
		},

		_createNotificationInstance:function(options)
		{
			if (options.notificationType == 'simple')
			{
				return window.webkitNotifications.createNotification(
				this.message.icon , this.message.title, this.message.content);
			}
			else if (options.notificationType == 'html') {
				return window.webkitNotifications.createHTMLNotification(this.message);
			}
		},
	  
		_permission : function()
		{
			if (window.webkitNotifications.checkPermission() == 0)// 0 is PERMISSION_ALLOWED
				this._setNotificationInstance();
			else
				window.webkitNotifications.requestPermission();
		},
		
		_setNotificationInstance : function()
		{
			var self = this;
			this.notification = this._createNotificationInstance({ notificationType: this.type });
			this.notification.ondisplay = function()
			{
				setTimeout(function(e)
				{
					self.notification.cancel()
				}, 15000)
			};
			this.notification.show();
		},
	});

	Y.namespace("ModuleNotification").Notification = Notification;

}, "1.0", {requires:['base']});