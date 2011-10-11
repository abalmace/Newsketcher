YUI.add("peoplecontainer", function(Y)
{

   
	var Lang = Y.Lang;


	function PeopleContainer(data)
	{
	PeopleContainer.superclass.constructor.apply(this, arguments);
	}


	PeopleContainer.NAME = "peopleContainer";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	PeopleContainer.ATTRS =
	{
		client:
			{
			value:null
			}
		,allPeople:
			{
			value:[]	
			}
		,container:
			{
			value:null
			}
		,subscriptions:
			{
			value:[]
			}
		,clicked:
			{
			value:[]
			}
		,prefixIdTask:
			{
			value:[]
			}
	};

    /* MyComponent extends the Base class */
	Y.extend(PeopleContainer, Y.Base,
	{

		initializer: function(data)
		{
			this.client = data.client;
			this.allPeople = [];
			this.container = data.container;
			this.clicked = data.clicked;
			this.subscriptions = [];
			this.prefixIdTask = 'people_';
			
			this.reload();

		     this.publish("myEvent", {
		        defaultFn: this._defMyEventFn,
		        bubbles:false
		     });
		},

		destructor : function()
		{
		    /*
		     * destructor is part of the lifecycle introduced by 
		     * the Base class. It is invoked when destroy() is called,
		     * and can be used to cleanup instance specific state.
		     *
		     * It does not need to invoke the superclass destructor. 
		     * destroy() will call initializer() for all classes in the hierarchy.
		     */
		},

		/* MyComponent specific methods */

		reload : function(people)
		{
			var self = this;
			$(this.container).empty();
			this.allPeople = [];
			if(people)
			{
				_.each(people, function(person) {
					self.addPerson(person);
				});
			}
			else
			{
			// Download people
				$.getJSON('/channel/allUsers/people.json', function(data)
				{
				_.each(data.users, function(person) {
					self.addPerson(person);
				});
				})
			}
		},

		addPerson: function(data)
		{
			var dom = document.createElement('div');
			var guid = data.guid || Utils.guid();
			dom.className = "people gButton";
			dom.id = guid;

			data.client = this.client;

			data.dom = dom;
			data.guid = guid;

			data.clicked = this.clicked;

			var person = new Y.ModulePerson.Person(data);
			this.allPeople.push(person);
			this.container.appendChild(dom);
		},

		getPerson : function(guid)
		{
			var self = this;
			var person = _.detect(self.allPeople, function(s) { return s.guid == guid });

			return person.to_json();
		}
	});

	Y.namespace("ModulePeopleContainer").PeopleContainer = PeopleContainer;

}, "1.0", {requires:['base','person']});