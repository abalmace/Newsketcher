YUI().add('modulemodel',function (Y)
{
	var moduleModel = Y.Base.create('moduleModel', Y.Model, [],
	{
		// This tells the Model to use a localStorage sync provider (which we'll
		// create below) to save and load information about a todo item.
		sync: Y.ModuleToDo.LocalStorageSync('todo'),

		// This method will toggle the `done` attribute from `true` to `false`, or
		// vice versa.
		toggleDone: function ()
		{
			this.set('done', !this.get('done')).save();
		}
	}
	,{
		ATTRS:
		{
			// Indicates whether or not this todo item has been completed.
			done: {value: false},

			// Contains the text of the todo item.
			text: {value: ''}
		}
	});
	
	Y.namespace('ModuleModel').ModuleModel = moduleModel;
	
}, "1.0", {requires:['base','model', 'model-list','localstoragesync']});