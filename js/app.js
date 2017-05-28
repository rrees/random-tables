(function () {
'use strict';

function assign ( target ) {
	for ( var i = 1; i < arguments.length; i += 1 ) {
		var source = arguments[i];
		for ( var k in source ) target[k] = source[k];
	}

	return target;
}

function appendNode ( node, target ) {
	target.appendChild( node );
}

function insertNode ( node, target, anchor ) {
	target.insertBefore( node, anchor );
}

function detachNode ( node ) {
	node.parentNode.removeChild( node );
}

function destroyEach ( iterations, detach, start ) {
	for ( var i = start; i < iterations.length; i += 1 ) {
		if ( iterations[i] ) iterations[i].destroy( detach );
	}
}

function createElement ( name ) {
	return document.createElement( name );
}

function createText ( data ) {
	return document.createTextNode( data );
}

function addEventListener ( node, event, handler ) {
	node.addEventListener( event, handler, false );
}

function removeEventListener ( node, event, handler ) {
	node.removeEventListener( event, handler, false );
}

var transitionManager = {
	running: false,
	transitions: [],

	add: function ( transition ) {
		transitionManager.transitions.push( transition );

		if ( !this.running ) {
			this.running = true;
			this.next();
		}
	},

	next: function () {
		transitionManager.running = false;

		var now = window.performance.now();
		var i = transitionManager.transitions.length;

		while ( i-- ) {
			var transition = transitionManager.transitions[i];

			if ( transition.program && now >= transition.program.end ) {
				transition.done();
			}

			if ( transition.pending && now >= transition.pending.start ) {
				transition.start( transition.pending );
			}

			if ( transition.running ) {
				transition.update( now );
				transitionManager.running = true;
			} else if ( !transition.pending ) {
				transitionManager.transitions.splice( i, 1 );
			}
		}

		if ( transitionManager.running ) {
			requestAnimationFrame( transitionManager.next );
		}
	}
};

function differs ( a, b ) {
	return ( a !== b ) || ( a && ( typeof a === 'object' ) || ( typeof a === 'function' ) );
}

function dispatchObservers ( component, group, newState, oldState ) {
	for ( var key in group ) {
		if ( !( key in newState ) ) continue;

		var newValue = newState[ key ];
		var oldValue = oldState[ key ];

		if ( differs( newValue, oldValue ) ) {
			var callbacks = group[ key ];
			if ( !callbacks ) continue;

			for ( var i = 0; i < callbacks.length; i += 1 ) {
				var callback = callbacks[i];
				if ( callback.__calling ) continue;

				callback.__calling = true;
				callback.call( component, newValue, oldValue );
				callback.__calling = false;
			}
		}
	}
}

function get ( key ) {
	return key ? this._state[ key ] : this._state;
}

function fire ( eventName, data ) {
	var handlers = eventName in this._handlers && this._handlers[ eventName ].slice();
	if ( !handlers ) return;

	for ( var i = 0; i < handlers.length; i += 1 ) {
		handlers[i].call( this, data );
	}
}

function observe ( key, callback, options ) {
	var group = ( options && options.defer ) ? this._observers.post : this._observers.pre;

	( group[ key ] || ( group[ key ] = [] ) ).push( callback );

	if ( !options || options.init !== false ) {
		callback.__calling = true;
		callback.call( this, this._state[ key ] );
		callback.__calling = false;
	}

	return {
		cancel: function () {
			var index = group[ key ].indexOf( callback );
			if ( ~index ) group[ key ].splice( index, 1 );
		}
	};
}

function on ( eventName, handler ) {
	if ( eventName === 'teardown' ) return this.on( 'destroy', handler );

	var handlers = this._handlers[ eventName ] || ( this._handlers[ eventName ] = [] );
	handlers.push( handler );

	return {
		cancel: function () {
			var index = handlers.indexOf( handler );
			if ( ~index ) handlers.splice( index, 1 );
		}
	};
}

function set ( newState ) {
	this._set( assign( {}, newState ) );
	this._root._flush();
}

function _flush () {
	if ( !this._renderHooks ) return;

	while ( this._renderHooks.length ) {
		this._renderHooks.pop()();
	}
}

var proto = {
	get: get,
	fire: fire,
	observe: observe,
	on: on,
	set: set,
	_flush: _flush
};

function create_main_fragment ( state, component ) {
	var text_1_value;

	var h2 = createElement( 'h2' );
	appendNode( createText( "Hello " ), h2 );
	var text_1 = createText( text_1_value = state.name );
	appendNode( text_1, h2 );
	appendNode( createText( "!" ), h2 );

	return {
		mount: function ( target, anchor ) {
			insertNode( h2, target, anchor );
		},

		update: function ( changed, state ) {
			if ( text_1_value !== ( text_1_value = state.name ) ) {
				text_1.data = text_1_value;
			}
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( h2 );
			}
		}
	};
}

function Hello ( options ) {
	options = options || {};
	this._state = options.data || {};

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Hello.prototype, proto );

Hello.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Hello.prototype.teardown = Hello.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

const animals = ["Dog", "Cat", "Goat", "Monkey", "Whale", "Shark", "Possum"];

function animal$1() {
	return random.choose(animals);
}

var animals$1 = {
	animal: animal$1
};

function selectFrom(upperLimit) {
	return Math.floor(Math.random() * upperLimit);
}

function choose(array) {
	return array[selectFrom(array.length)]
}

var random = {
	choose: choose,
	animal: animals$1.animal
};

var template = (function () {
return {
	data() {
		return {
			animal: random.animal()
		}
	},
	methods: {
		newAnimal() {
			this.set({
				animal: random.animal()
			});
		}
	}
}
}());

function create_main_fragment$1 ( state, component ) {
	var text_1_value;

	var p = createElement( 'p' );
	appendNode( createText( "It's a " ), p );
	var text_1 = createText( text_1_value = state.animal );
	appendNode( text_1, p );
	var text_2 = createText( "\n\n" );
	var button = createElement( 'button' );

	function click_handler ( event ) {
		component.newAnimal();
	}

	addEventListener( button, 'click', click_handler );
	appendNode( createText( "No it isn't!" ), button );

	return {
		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
			insertNode( text_2, target, anchor );
			insertNode( button, target, anchor );
		},

		update: function ( changed, state ) {
			if ( text_1_value !== ( text_1_value = state.animal ) ) {
				text_1.data = text_1_value;
			}
		},

		destroy: function ( detach ) {
			removeEventListener( button, 'click', click_handler );

			if ( detach ) {
				detachNode( p );
				detachNode( text_2 );
				detachNode( button );
			}
		}
	};
}

function Animal$1 ( options ) {
	options = options || {};
	this._state = assign( template.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$1( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Animal$1.prototype, template.methods, proto );

Animal$1.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Animal$1.prototype.teardown = Animal$1.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var classic = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.populationTable = {
    choices: [
        [1, 3, 'Village'],
        [4, 7, 'Town'],
        [8, 9, 'City'],
        [10, 10, 'Large city']
    ],
    upperLimit: 10,
    modifier: undefined
};
exports.governmentTable = {
    choices: [
        [0, 0, "As needed"],
        [1, 2, "Eldest"],
        [3, 4, "Elected Head"],
        [5, 6, "Elected council"],
        [7, 7, "Lottery"],
        [8, 9, "Hereditary council"],
        [10, 11, "Hereditary ruler"]
    ],
    upperLimit: 10,
    modifier: (state) => {
        if (state.Population === "Village") {
            return -1;
        }
        if (state.Population === "City"
            || state.Population === "Large city") {
            return 1;
        }
        return 0;
    }
};
exports.buildings = {
    upperLimit: 6,
    choices: [
        "Bridge",
        "Market",
        "Shrine",
        "Speciality production",
        "Civic center",
        "Monument",
        "Castle",
    ],
    modifier: function (state) {
        const population = state.get('Population');
        if (population.value === "City"
            || population.value === "Large city") {
            return 1;
        }
        return 0;
    }
};
exports.specialityGoods = {
    upperLimit: 10,
    choices: [
        "Cotton, wool and flax",
        "Grain, vegetables and staples",
        "Raw metal",
        "Lumber",
        "Wine, ale and spirits",
        "Furs, hides, cloth",
        "Livestock and pets",
        "Leather goods",
        "Wooden goods",
        "Housewares",
        "Herbs, salt, spices and sugar",
        "Clothing, armour and weapons",
        "Exotic fruits",
        "Painting and sculpture",
        "Jewelery",
        "Perfumes and potions",
        "Scrolls and books",
        "Magical items",
    ],
    modifier: function (state) {
        const modifiers = [
            ["Town", 2],
            ["City", 5],
            ["Large city", 8]
        ];
        const population = state.get('Population');
        function reducer(currentModifer, [size, modifier]) {
            if (population.value === size) {
                return modifier;
            }
            return currentModifer;
        }
        return modifiers.reduce(reducer, 0);
    }
};
exports.rulingAttitudes = [
    "Resistant to change",
    "Secretive",
    "Cynical",
    "Lazy",
    "Inexperienced",
    "Crude",
    "Forgetful",
    "Generous",
    "Meticulous",
    "Idealistic"
];
exports.environment = [
    'Forest',
    'Valley',
    'Coast',
    'Cliff',
    'Wasteland',
    'Plains',
    'Trees',
    'Hills'
];
exports.sights = [
    'Greenery',
    'Festive colours',
    'Drab buildings',
    'Gleaming buildings',
    "Organic shapes",
    "Geometric designs"
];
exports.sounds = [
    'Running water',
    'Birds',
    'Market hawkers',
    'Clanging metal',
    'Children',
    'Livestock'
];
exports.smells = [
    "Animals",
    "Cookfires",
    "Forest",
    "Water",
    "Speciality goods",
    "Waste"
];
exports.threats = [
    'Famine',
    'Drought',
    'Monsters',
    "Natural disaster",
    "Bandits",
    "Plague",
    "Unfair treatment",
    "Missing people",
    "Vermin",
    "Isolated"
];

});

var selectors = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function select(upperLimit, lowerLimit = 0) {
    return lowerLimit + Math.floor(Math.random() * upperLimit);
}
function chooseOne(key, choices, town) {
    return town.set(key, {
        name: key,
        value: choices[select(choices.length)]
    });
}
exports.chooseOne = chooseOne;
function chooseFromTable(key, table, town) {
    const choice = table.modifier ? select(table.upperLimit, 1) + table.modifier(town) : select(table.upperLimit, 1);
    return town.set(key, {
        name: key,
        value: table.choices.find((row) => row[0] <= choice && choice <= row[1])[2]
    });
}
exports.chooseFromTable = chooseFromTable;
function chooseOneWithModifier(key, table, town) {
    const choice = table.modifier ? select(table.upperLimit, 1) + table.modifier(town) : select(table.upperLimit, 1);
    return town.set(key, {
        name: key,
        value: table.choices[choice]
    });
}
exports.chooseOneWithModifier = chooseOneWithModifier;

});

var town$1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });


function classic$$1() {
    const townBuilders = [
        (town) => selectors.chooseFromTable('Population', classic.populationTable, town),
        (town) => selectors.chooseFromTable('Government', classic.governmentTable, town),
        (town) => selectors.chooseOne('Ruling attitude', classic.rulingAttitudes, town),
        (town) => selectors.chooseOne('Environment', classic.environment, town),
        (town) => selectors.chooseOneWithModifier('Building', classic.buildings, town),
        (town) => selectors.chooseOneWithModifier('Speciality goods', classic.specialityGoods, town),
        (town) => selectors.chooseOne('Sights', classic.sights, town),
        (town) => selectors.chooseOne('Sounds', classic.sounds, town),
        (town) => selectors.chooseOne('Smells', classic.smells, town),
        (town) => selectors.chooseOne('Threats', classic.threats, town),
    ];
    return townBuilders.reduce((town, builder) => builder(town), new Map());
}
exports.classic = classic$$1;

});

var index$1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

function generate() {
    return town$1.classic();
}
exports.generate = generate;

});

var index_1 = index$1.generate;

function recompute ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'town' in newState && differs( state.town, oldState.town ) ) ) {
		state.elements = newState.elements = template$1.computed.elements( state.town );
	}
}

var template$1 = (function () {

const town = index_1();

console.log(town);

return {
	data() {
		return {
			town: index_1(),
		}
	},
	computed: {
		elements: town => Array.from(town.values())
	}
}

}());

function create_main_fragment$2 ( state, component ) {
	var table = createElement( 'table' );
	var each_block_value = state.elements;

	var each_block_iterations = [];

	for ( var i = 0; i < each_block_value.length; i += 1 ) {
		each_block_iterations[i] = create_each_block( state, each_block_value, each_block_value[i], i, component );
		each_block_iterations[i].mount( table, null );
	}

	return {
		mount: function ( target, anchor ) {
			insertNode( table, target, anchor );
		},

		update: function ( changed, state ) {
			var each_block_value = state.elements;

			if ( 'elements' in changed ) {
				for ( var i = 0; i < each_block_value.length; i += 1 ) {
					if ( each_block_iterations[i] ) {
						each_block_iterations[i].update( changed, state, each_block_value, each_block_value[i], i );
					} else {
						each_block_iterations[i] = create_each_block( state, each_block_value, each_block_value[i], i, component );
						each_block_iterations[i].mount( table, null );
					}
				}

				destroyEach( each_block_iterations, true, each_block_value.length );
				each_block_iterations.length = each_block_value.length;
			}
		},

		destroy: function ( detach ) {
			destroyEach( each_block_iterations, false, 0 );

			if ( detach ) {
				detachNode( table );
			}
		}
	};
}

function create_each_block ( state, each_block_value, element, element_index, component ) {
	var text_value, text_2_value;

	var tr = createElement( 'tr' );
	var th = createElement( 'th' );
	appendNode( th, tr );
	var text = createText( text_value = element.name );
	appendNode( text, th );
	appendNode( createText( "\n\t" ), tr );
	var td = createElement( 'td' );
	appendNode( td, tr );
	var text_2 = createText( text_2_value = element.value );
	appendNode( text_2, td );

	return {
		mount: function ( target, anchor ) {
			insertNode( tr, target, anchor );
		},

		update: function ( changed, state, each_block_value, element, element_index ) {
			if ( text_value !== ( text_value = element.name ) ) {
				text.data = text_value;
			}

			if ( text_2_value !== ( text_2_value = element.value ) ) {
				text_2.data = text_2_value;
			}
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( tr );
			}
		}
	};
}

function Town$1 ( options ) {
	options = options || {};
	this._state = assign( template$1.data(), options.data );
	recompute( this._state, this._state, {}, true );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$2( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Town$1.prototype, proto );

Town$1.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute( this._state, newState, oldState, false );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Town$1.prototype.teardown = Town$1.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function create_main_fragment$3 ( state, component ) {
	var p = createElement( 'p' );
	appendNode( createText( "A random code" ), p );

	return {
		mount: function ( target, anchor ) {
			insertNode( p, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( p );
			}
		}
	};
}

function Code ( options ) {
	options = options || {};
	this._state = options.data || {};

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$3( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

assign( Code.prototype, proto );

Code.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Code.prototype.teardown = Code.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

const hello = new Hello({
	target: document.getElementById('hello-app'),
	data: {
		name: "World"
	}
});

const animal = new Animal$1({
	target: document.getElementById('animal-app')
});

const town = new Town$1({
	target: document.getElementById('ryuutama-town')
});

const code = new Code({
	target: document.getElementById('random-code')
});

}());
