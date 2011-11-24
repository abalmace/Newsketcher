YUI().add('stepsview',function (Y)
{

	var Lang = Y.Lang;

	/* MyComponent class constructor */
	function StepsView(data)
	{
		StepsView.superclass.constructor.apply(this, arguments);
	}
	StepsView.NAME = "stepsView";

	StepsView.ATTRS =
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
		,div:
			{
			value:null
			}
		,stepList:
			{
			value:[]
			}
		,infoOnMaps:
			{
			value:[]
			}
		,prefixIdMap:
			{
			value: null
			}
	};

	Y.extend(StepsView, Y.Base,
	{

		initializer: function(data)
		{	
			var TodoAppView, TodoList, TodoModel, TodoView;
			var self = this;
			self.client = data.client;
			self.infoOnMaps = [];
			self.prefixIdMap = 'subTask_';

			// -- Model --------------------------------------------------------------------

			// The TodoModel class extends Y.Model and customizes it to use a localStorage
			// sync provider (the source for that is further below) and to provide
			// attributes and methods useful for todo items.

			TodoModel = Y.ModuleListModel.ListModel;

			// -- ModelList ----------------------------------------------------------------

			// The TodoList class extends Y.ModelList and customizes it to hold a list of
			// TodoModel instances, and to provide some convenience methods for getting
			// information about the todo items in the list.

			TodoList = Y.TodoList = Y.Base.create('todoList', Y.ModelList, [], {
			// This tells the list that it will hold instances of the TodoModel class.
			model: TodoModel,

			// This tells the list to use a localStorage sync provider (which we'll
			// create below) to load the list of todo items.
			sync : Y.ModuleToDo.LocalStorageSync('todo'),

			// Returns an array of all models in this list with the `done` attribute
			// set to `true`.
			done: function () {
				return Y.Array.filter(this.toArray(), function (model) {
				return model.get('done');
				});
			},

			// Returns an array of all models in this list with the `done` attribute
			// set to `false`.
			remaining: function () {
				return Y.Array.filter(this.toArray(), function (model) {
				return !model.get('done');
				});
			}
			});

			// -- Todo App View ------------------------------------------------------------

			// The TodoAppView class extends Y.View and customizes it to represent the
			// main shell of the application, including the new item input field and the
			// list of todo items.
			//
			// This class also takes care of initializing a TodoList instance and creating
			// and rendering a TodoView instance for each todo item when the list is
			// initially loaded or reset.

			TodoAppView = Y.TodoAppView = Y.Base.create('todoAppView', Y.View, [], {
			// The container node is the wrapper for this view.  All the view's events
			// will be delegated from the container. In this case, the #todo-app
			// node already exists on the page, so we don't need to create it.
			container: Y.one('#todo-steps'),

			// This is a custom property that we'll use to hold a reference to the
			// "new todo" input field.
			inputNode: Y.one('#new-todo-steps'),

			// The `template` property is a convenience property for holding a template
			// for this view. In this case, we'll use it to store the contents of the
			// #todo-stats-template element, which will serve as the template for the
			// statistics displayed at the bottom of the list.
			template: Y.one('#todo-stats-template').getContent(),

			// This is where we attach DOM events for the view. The `events` object is a
			// mapping of selectors to an object containing one or more events to attach
			// to the node(s) matching each selector.
			events: {
				// Handle <enter> keypresses on the "new todo" input field.
				'#new-todo-steps': {keypress: 'createTodo'},

				// Clear all completed items from the list when the "Clear" link is
				// clicked.
				'.todo-clear': {click: 'clearDone'},

				// Add and remove hover states on todo items.
				'.todo-item': {
				mouseover: 'hoverOn',
				mouseout : 'hoverOff'
				}
			},

			// The initializer runs when a TodoAppView instance is created, and gives
			// us an opportunity to set up the view.
			initializer: function () {
				// Create a new TodoList instance to hold the todo items.
				self.stepList = this.todoList = new TodoList();
				var list = self.stepList;
				
				// Update the display when a new item is added to the list, or when the
				// entire list is reset.
				list.after('add', this.add, this);
				list.after('reset', this.reset, this);

				// Re-render the stats in the footer whenever an item is added, removed
				// or changed, or when the entire list is reset.
				list.after(['add', 'reset', 'remove', 'moduleModel:doneChange'],
					this.render, this);

				// Load saved items from localStorage, if available.
				list.load();
			},

			// The render function is called whenever a todo item is added, removed, or
			// changed, thanks to the list event handler we attached in the initializer
			// above.
			render: function () {
				var todoList = this.todoList,
				stats    = this.container.one('#todo-stats-steps'),
				numRemaining, numDone;

				// If there are no todo items, then clear the stats.
				if (todoList.isEmpty()) {
				stats.empty();
				return this;
				}

				// Figure out how many todo items are completed and how many remain.
				numDone      = todoList.done().length;
				numRemaining = todoList.remaining().length;

				// Update the statistics.
				stats.setContent(Y.Lang.sub(this.template, {
				numDone       : numDone,
				numRemaining  : numRemaining,
				doneLabel     : numDone === 1 ? 'task' : 'tasks',
				remainingLabel: numRemaining === 1 ? 'task' : 'tasks'
				}));

				// If there are no completed todo items, don't show the "Clear
				// completed items" link.
				if (!numDone) {
				stats.one('.todo-clear').remove();
				}

				return this;
			},

			// -- Event Handlers -------------------------------------------------------

			// Creates a new TodoView instance and renders it into the list whenever a
			// todo item is added to the list.
			add: function (e) {
				var view = new TodoView({model: e.model});
				this.container.one('#todo-list-steps').append(view.render().container);
			},

			// Removes all finished todo items from the list.
			clearDone: function (e) {
				var done = this.todoList.done();

				e.preventDefault();

				// Remove all finished items from the list, but do it silently so as not
				// to re-render the app view after each item is removed.
				this.todoList.remove(done, {silent: true});

				// Destroy each removed TodoModel instance.
				Y.Array.each(done, function (todo) {
				// Passing {'delete': true} to the todo model's `destroy()` method
				// tells it to delete itself from localStorage as well.
				todo.destroy({'delete': true});
				});

				// Finally, re-render the app view.
				this.render();
			},

			// Creates a new todo item when the enter key is pressed in the new todo
			// input field.
			createTodo: function (e) {
				var value;

				if (e.keyCode === 13) { // enter key
				value = Y.Lang.trim(this.inputNode.get('value'));

				if (!value) { return; }

				// This tells the list to create a new TodoModel instance with the
				// specified text and automatically save it to localStorage in a
				// single step.
				this.todoList.create({text: value});

				this.inputNode.set('value', '');
				}
			},

			// Turns off the hover state on a todo item.
			hoverOff: function (e) {
				e.currentTarget.removeClass('todo-hover');
			},

			// Turns on the hover state on a todo item.
			hoverOn: function (e) {
				e.currentTarget.addClass('todo-hover');
			},

			// Creates and renders views for every todo item in the list when the entire
			// list is reset.
			reset: function (e) {
				var fragment = Y.one(Y.config.doc.createDocumentFragment());

				Y.Array.each(e.models, function (model) {
				var view = new TodoView({model: model});
				fragment.append(view.render().container);
				});

				this.container.one('#todo-list-steps').setContent(fragment);
			}
			});

			// -- Todo item view -----------------------------------------------------------

			// The TodoView class extends Y.View and customizes it to represent the content
			// of a single todo item in the list. It also handles DOM events on the item to
			// allow it to be edited and removed from the list.

			TodoView = Y.TodoView = Y.Base.create('todoView', Y.View, [], {
			// Specifying an HTML string as this view's container element causes that
			// HTML to be automatically converted into an unattached Y.Node instance.
			// The TodoAppView (above) will take care of appending it to the list.
			container: '<li class="todo-item"/>',

			// The template property holds the contents of the #todo-item-template
			// element, which will be used as the HTML template for each todo item.
			template: Y.one('#todo-item-template').getContent(),

			// Delegated DOM events to handle this view's interactions.
			events: {
				// Toggle the "done" state of this todo item when the checkbox is
				// clicked.
				'.todo-checkbox': {click: 'toggleDone'},

				// When the text of this todo item is clicked or focused, switch to edit
				// mode to allow editing.
				'.todo-content': {
				click: 'edit',
				focus: 'edit'
				},

				// On the edit field, when enter is pressed or the field loses focus,
				// save the current value and switch out of edit mode.
				'.todo-input'   : {
				blur    : 'save',
				keypress: 'enter'
				},

				// When the remove icon is clicked, delete this todo item.
				'.todo-remove': {click: 'remove'}
			},

			initializer: function () {
				// The model property is set to a TodoModel instance by TodoAppView when
				// it instantiates this TodoView.
				var model = this.model;

				// Re-render this view when the model changes, and destroy this view
				// when the model is destroyed.
				model.after('change', this.render, this);
				model.after('destroy', this.destroy, this);
				
				self._createMapInfo(this);
				
				model.set('guid',this.sketch.name);
				
			},

			render: function () {
				var container = this.container,
				model     = this.model,
				done      = model.get('done');

				container.setContent(Y.Lang.sub(this.template, {
				checked: done ? 'checked' : ''
				,text   : model.getAsHTML('text')
				,guid : this.sketch.name
				}));

				container[done ? 'addClass' : 'removeClass']('todo-done');
				this.inputNode = container.one('.todo-input');

				return this;
			},

			// -- Event Handlers -------------------------------------------------------

			// Toggles this item into edit mode.
			edit: function () {
				this.container.addClass('editing');
				this.inputNode.focus();
				
				this.sketch.setActive(true);
			},

			// When the enter key is pressed, focus the new todo input field. This
			// causes a blur event on the current edit field, which calls the save()
			// handler below.
			enter: function (e) {
				if (e.keyCode === 13) { // enter key
				Y.one('#new-todo-steps').focus();
				}
			},

			// Removes this item from the list.
			remove: function (e) {
				e.preventDefault();

				this.constructor.superclass.remove.call(this);
				this.model.destroy({'delete': true});
			},

			// Toggles this item out of edit mode and saves it.
			save: function () {
				this.container.removeClass('editing');
				this.model.set('text', this.inputNode.get('value')).save();
			},

			// Toggles the `done` state on this item's model.
			toggleDone: function () {
				this.model.toggleDone();
			}
			});


			// -- Start your engines! ------------------------------------------------------

			// Finally, all we have to do is instantiate a new TodoAppView to set everything
			// in motion and bring our todo list into existence.
			new TodoAppView();

		},
		
		destructor : function()
		{
			
		},
	  
		getSteps: function()
		{
			var list = this.stepList.remaining();
			var steps = [];
			Y.each(list, function(element)
			{
				steps.push(
					{
						description:element.getAsHTML('text')
						,guid: element.getAsHTML('guid')
					});
			});
			
			return steps;
		},
	  
		visible : function(bool)
		{
			if(bool)
				Y.one('#divDefinerStep').setStyle('visibility','visible');
			else
				Y.one('#divDefinerStep').setStyle('visibility','hidden');
		},
	  
		_createMapInfo : function(self)
		{
			var data = 
				{
				client : this.client
				,persisted : true
				,name :this.prefixIdMap+Utils.guid()
				}
			
			var infoOnMap = new Y.ModuleTask.InfoOnMap(data);
			self.sketch = infoOnMap;
			this.infoOnMaps.push(infoOnMap);
		},
	});
	Y.namespace("ModuleList").StepsView = StepsView;

}, "1.0", {requires:['event-focus', 'json', 'model', 'model-list', 'view','base','listmodel']});

