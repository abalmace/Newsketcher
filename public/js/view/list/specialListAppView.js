YUI.add("speciallistappview", function(Y)
{

	//// -- Todo item view -----------------------------------------------------------

	// The TodoView class extends Y.View and customizes it to represent the content
	// of a single todo item in the list. It also handles DOM events on the item to
	// allow it to be edited and removed from the list.

	Y.namespace("ModuleView").SpecialListAppView = Y.Base.create('specialListAppView', Y.View, [],
	{
		// The container node is the wrapper for this view.  All the view's events
		// will be delegated from the container. In this case, the #todo-app
		// node already exists on the page, so we don't need to create it.
		container: Y.one('#todo-app'),

		// This is a custom property that we'll use to hold a reference to the
		// "new todo" input field.
		inputNode: Y.one('#new-todo'),

		// The `template` property is a convenience property for holding a template
		// for this view. In this case, we'll use it to store the contents of the
		// #todo-stats-template element, which will serve as the template for the
		// statistics displayed at the bottom of the list.
		template: null,

		// This is where we attach DOM events for the view. The `events` object is a
		// mapping of selectors to an object containing one or more events to attach
		// to the node(s) matching each selector.
		events: {
			// Handle <enter> keypresses on the "new todo" input field.
			'#new-todo': {keypress: 'createTodo'},

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
			var list = this.todoList = new TodoList();

			// Update the display when a new item is added to the list, or when the
			// entire list is reset.
			list.after('add', this.add, this);
			list.after('reset', this.reset, this);

			// Load saved items from localStorage, if available.
			list.load();
		},

		// The render function is called whenever a todo item is added, removed, or
		// changed, thanks to the list event handler we attached in the initializer
		// above.
		render: function ()
		{
			return this;
		},

		// -- Event Handlers -------------------------------------------------------

		// Creates a new TodoView instance and renders it into the list whenever a
		// todo item is added to the list.
		add: function (e)
		{
			var view = new TodoView({model: e.model});
			this.container.one('#todo-list').append(view.render().container);
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

			this.container.one('#todo-list').setContent(fragment);
		}
	});

}, "1.0", {requires:['view']});