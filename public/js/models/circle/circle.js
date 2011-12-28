YUI.add("circle", function(Y)
{

   
	var Lang = Y.Lang;


	function Circle(data)
	{
	Circle.superclass.constructor.apply(this, arguments);
	}


	Circle.NAME = "circle";

	/*
	* The attribute configuration for the component. This defines the core user facing state of the component
	*/
	Circle.ATTRS =
	{
		dom:
			{
			value:null
			}
		,name:
			{
			value:''	
			}
		,owner:
			{
			value:null
			}
		,guid:
			{
			value:null
			}
		,people:
			{
			value:[]
			}
		,tasks:
			{
			value:[]
			}
		,selected:
			{
			value : false	
			}
	};

    /* MyComponent extends the Base class */
    Y.extend(Circle, Y.Base, {

        initializer: function(data)
	{
		this.dom = data.dom;
		this.name = data.name;
		this.owner = data.owner;
		this.guid = data.guid;
		this.people = data.people || [];
		this.tasks = data.tasks || [];
		this.callback = data.callback;
		
		this._defineDOMElement();
		this._addEvents();

             this.publish("click", {
                defaultFn: this._defMyEventFn,
                bubbles:false
             });
        },

        destructor : function()
	{
            this.owner = null;
	    this.guid = null;
	    this.people = null;
	    this.tasks = null;
        },

        addPerson : function(person)
	{
		var personAux = _.detect(this.people, function(s) { return s.guid == person.guid });
		if(!personAux)
		{
			this.people.push(person);
			var element = $(this.dom).find('.circle_number');
			element.html(this.people.length);
		}
	},
	
	removePerson : function(person)
	{
		var personAux = _.detect(this.people, function(s) { return s.guid == person.guid });
		if(personAux)
		{
			this.people = _.without(this.people, personAux);
			var element = $(this.dom).find('.circle_number');
			element.html(this.people.length);
			var personDOM = document.getElementById(personAux.guid)
			Y.one(personDOM).remove(true);
		}
	},
	
	addTask : function(task)
	{
		var taskAux = _.detect(this.tasks, function(s) { return s.guid == task.guid });
		if(!taskAux)
			this.tasks.push(task);		
	},
	
	removeTask : function(task)
	{
		var taskAux = _.detect(this.tasks, function(s) { return s.guid == task.guid });
		if(taskAux)
		{
			this.tasks = _.without(this.tasks, taskAux);
			
			Y.one(document.getElementById(taskAux.guid)).remove(true);
		}
	},

        _defineDOMElement : function()
	{
		
		var divOuter = document.createElement('div');
		divOuter.className = 'outer_circle';
		
		var divInner = document.createElement('div');
		divInner.className = "inner_circle";

		var divLabel = document.createElement('div');
		divLabel.className = "circle_label";
		divLabel.innerHTML =this.name;

		var divNumber = document.createElement('div');
		divNumber.className = "circle_number";
		divNumber.innerHTML = this.people.length;
		
		var divDragHidden = document.createElement('div');
		divDragHidden.className = "dragHidden";

		divInner.appendChild(divLabel);
		divInner.appendChild(divNumber);
		divInner.appendChild(divDragHidden);
		divOuter.appendChild(divInner);
		this.dom.appendChild(divOuter);
        },
	//TODO
        _addEvents : function()
	{
		var self = this;
		
		
		
		$(this.dom).bind('click', function(e)
		{
			if(self.callback && self.callback.click)
				self.callback.click(self);
		});
		
		
		
	/*	
		
		
           var element = $(this.dom);
	var element2 = element.find('div.outer_circle');
	
	
		element2.mouseover(function() {
			element.find('.outer_circle').addClass('outer_circle_open');
			element.find('.inner_circle').animate({left:'47px',top:'76px'},0);
		});
		element.find('.outer_circle').mouseout(function() {
			element.find('.outer_circle').removeClass('outer_circle_open');
			element.find('.inner_circle').animate({left:'18px',top:'47px'},0);
		});
	
						
	element.find('.circle_del').click(function(){
		element.find('.circle_del').remove();
		element.find('.outer_circle').addClass('outer_circle_open').animate({height: '183px', width: '183px'},100);
		element.find('.inner_circle').animate({left:'47',top:'76'},0)
		element.find('.circle_label').addClass('rotate_label');
		element.find('.outer_circle').animate({"top":"150px"},300).animate({"bottom":"20px"}, 100, function(){ });
		element.find('.outer_circle').animate({"opacity":"0","margin-left":"600px"}, 800, 'linear');	
	});
	*/
	
        }
    });

    Y.namespace("ModuleCircle").Circle = Circle;

}, "1.0", {requires:["base","node","node-core",'event',]});