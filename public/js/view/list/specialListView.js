YUI.add("speciallistview", function(Y)
{

	//// -- Todo item view -----------------------------------------------------------

	// The TodoView class extends Y.View and customizes it to represent the content
	// of a single todo item in the list. It also handles DOM events on the item to
	// allow it to be edited and removed from the list.

	Y.namespace("ModuleView").SpecialListView = Y.Base.create('specialListView', Y.View, [],
	{
		// Specifying an HTML string as this view's container element causes that
		// HTML to be automatically converted into an unattached Y.Node instance.
		// The TodoAppView (above) will take care of appending it to the list.
		container: '<li class="todo-item"/>',

		// The template property holds the contents of the #todo-item-template
		// element, which will be used as the HTML template for each todo item.
		template: Y.one('#todo-item-template').getContent(),

		// Delegated DOM events to handle this view's interactions.
		events:
		{
			// When the text of this todo item is clicked or focused, switch to edit
			// mode to allow editing.
			'.todo-content':
			{
			click: 'edit',
			focus: 'edit'
			},

			// On the edit field, when enter is pressed or the field loses focus,
			// save the current value and switch out of edit mode.
			'.todo-input'   :
			{
			blur    : 'save',
			keypress: 'enter'
			},

			// When the remove icon is clicked, delete this todo item.
			'.todo-remove': {click: 'remove'}
		},

		initializer: function ()
		{
			// The model property is set to a TodoModel instance by TodoAppView when
			// it instantiates this TodoView.
			var model = this.model;

			// Re-render this view when the model changes, and destroy this view
			// when the model is destroyed.
			model.after('change', this.render, this);
			model.after('destroy', this.destroy, this);
		},

		render: function ()
		{
			var container = this.container,
			model     = this.model,
			done      = model.get('done');

			container.setContent(Y.Lang.sub(this.template, {
			checked: done ? 'checked' : '',
			text   : model.getAsHTML('text')
			}));

			container[done ? 'addClass' : 'removeClass']('todo-done');
			this.inputNode = container.one('.todo-input');

			return this;
		},

		// -- Event Handlers ----------conprar leche y bebida---------------------------------------------

		// Toggles this item into edit mode.
		edit: function () 
		{
			this.container.addClass('editing');
			this.inputNode.focus();
		},

		// When the enter key is pressed, focus the new todo input field. This
		// causes a blur event on the current edit field, which calls the save()
		// handler below.
		enter: function (e)
		{
			if (e.keyCode === 13)
			{ // enter key
				Y.one('#new-todo').focus();
			}
		},

		// Removes this item from the list.
		remove: function (e)
		{
			e.preventDefault();

			this.constructor.superclass.remove.call(this);
			this.model.destroy({'delete': true});
		},

		// Toggles this item out of edit mode and saves it.
		save: function ()
		{
			this.container.removeClass('editing');
			this.model.set('text', this.inputNode.get('value')).save();
		},

		// Toggles the `done` state on this item's model.
		toggleDone: function ()
		{
			this.model.toggleDone();
		}
	});
	

}, "1.0", {requires:['base','node','node-core','event']});