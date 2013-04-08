
var Stater = module.exports = function() {
	this.states = {};
	this.stash = {};
};

Stater.prototype.addState = function(name, handler) {
	this.states[name] = handler;
};

Stater.prototype.set = function(name, value) {
	this.stash[name] = value;
};

Stater.prototype.get = function(name) {
	return this.stash[name];
};

Stater.prototype.clear = function(name) {
	if(name)
		return delete this.stash[name];
	
	// Full state reset
	this.stash = {};
};

Stater.prototype.state = function() {
	return this.current;
};

Stater.prototype.start = function(name) {
	if(!this.states[name])
		throw Error("Invalid state");
	
	this.handler = this.states[name];
	this.current = name;
};

Stater.prototype.tick = function(input) {
	if(!this.handler)
		throw Error("FSM has not been started!");
	
	this.handler.call(this, input, (function(next) {
		if(!next)
			return;
		
		if(!this.states[next])
			throw Error("Invalid state");
		
		this.handler = this.states[next];
		this.current = next;
	}).bind(this));
};
