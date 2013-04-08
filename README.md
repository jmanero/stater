Stater
======
A simple finite state machine

The design pattern should be somewhat familiar to anyone who's written VHDL, the major
difference being that we don't need an input-synchronizer process to generate events.
NodeJS does that for us...

The following is a very basic usage example. It expects external events and message
events from the socket to be interleaved, and makes no attempt to handle external
state violations to that end, e.g. two ticks in-a-row from the external event.
HINT: Put a queue before the FSM in your pipeline... 

    var mySocket = ...;

    var s = new Stater();
    s.addState("Ready", function(input, next) {
        input = input || {}; // Input
        
        // Stash things for other sates to consume
        this.set("result", input.callback);
        
        mySocket.write(input.data, function() {
            next("Waiting");
        });
    });
    
    s.addState("Waiting", function(input, next) {
        input = input || {};
        
        // This is a bad example of blocking, but I think it illustrates
        // the point. If this isn't a message from the socket, drop it on the floor 
        if(!input.err && !input.res) {
            next(false);
            return'
        }
        
        var result = this.get("result");
        result(input.err, input.res);
        
        next("Ready")
    });
    
    s.start("Ready"); // Set initial state
    
    function on_some_event(data, callback) {
        s.tick({
            data : data
            callback : callback
        });
    }
    
    mySocket.on('message', function(data) {
        data = magicallyParse(data);
        s.tick({
            err : data.err,
            res : data.res
        });
    });

### MIT License
Copyright (c) 2013 John Manero, Dynamic Network Services

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
