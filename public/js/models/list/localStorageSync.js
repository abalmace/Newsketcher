YUI.add("localstoragesync", function(Y)
{	
	// -- localStorage Sync Implementation -----------------------------------------
	// This is a simple factory function that returns a `sync()` function that can
	// be used as a sync layer for either a Model or a ModelList instance. The
	// TodoModel and TodoList instances above use it to save and load items.
	
	function LocalStorageSync(key)
	{
		var localStorage;

		if (!key)
		{
			Y.error('No storage key specified.');
		}

		if (Y.config.win.localStorage)
		{
			localStorage = Y.config.win.localStorage;
		}

		// Try to retrieve existing data from localStorage, if there is any.
		// Otherwise, initialize `data` to an empty object.
		var data = Y.JSON.parse((localStorage && localStorage.getItem(key)) || '{}');

		// Delete a model with the specified id.
		function destroy(id)
		{
			var modelHash;

			if ((modelHash = data[id])) {
			delete data[id];
			save();
			}

			return modelHash;
		}

		// Generate a unique id to assign to a newly-created model.
		function generateId()
		{
			var id = '',
			i  = 4;

			while (i--) {
			id += (((1 + Math.random()) * 0x10000) | 0)
				.toString(16).substring(1);
			}

			return id;
		}

		// Loads a model with the specified id. This method is a little tricky,
		// since it handles loading for both individual models and for an entire
		// model list.
		//
		// If an id is specified, then it loads a single model. If no id is
		// specified then it loads an array of all models. This allows the same sync
		// layer to be used for both the TodoModel and TodoList classes.
		function get(id)
		{
			return id ? data[id] : Y.Object.values(data);
		}

		// Saves the entire `data` object to localStorage.
		function save()
		{
			localStorage && localStorage.setItem(key, Y.JSON.stringify(data));
		}

		// Sets the id attribute of the specified model (generating a new id if
		// necessary), then saves it to localStorage.
		function set(model)
		{
			var hash = model.toJSON(),
			idAttribute = model.idAttribute;

			if (!Y.Lang.isValue(hash[idAttribute])) {
			hash[idAttribute] = generateId();
			}

			data[hash[idAttribute]] = hash;
			save();

			return hash;
		}

		// Returns a `sync()` function that can be used with either a Model or a
		// ModelList instance.
		return function (action, options, callback)
		{
			// `this` refers to the Model or ModelList instance to which this sync
			// method is attached.
			var isModel = Y.Model && this instanceof Y.Model;

			switch (action) {
			case 'create': // intentional fallthru
			case 'update':
			callback(null, set(this));
			return;

			case 'read':
			callback(null, get(isModel && this.get('id')));
			return;

			case 'delete':
			callback(null, destroy(isModel && this.get('id')));
			return;
			}
		};
	}
	
	Y.namespace("ModuleToDo").LocalStorageSync = LocalStorageSync;


}, "1.0", {requires:['model']});