/*
 *  Timing Engine
 *  @author Drew Wells, inspirations from Google Doodle http://www.google.com/logos/lem/
 */

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

var engineProto = {

    startTime: +new Date(),
    currentTime: +new Date(),
    tick: 0,
    gameDelta: 1000,
    maxFPS: 60,
    dom: null,
    maxFramerateTime: 1000 / 60,
    start: function(){

	    this.nextTick();
    },
    clone: function(){

	    return Object.create( this );
    },
    proxy: function( fn, ctx ){

        return function(){
            ctx[ fn ].apply( ctx, arguments );
        };
    },
    nextTick: function(){

	    window.requestAnimFrame( this.proxy( 'logicalTick', this ), this.dom );
    },
    updateTimers: function(){

	    this.currentTime = +new Date();
    },
    //Needed?
    actions: [],
    //TODO: parse an array of actions
    action: function( o ){

	    var action = {
	        start: this.currentTime + o.start,
	        end: o.end ? this.currentTime + o.end : +Infinity,
	        on: o.on,
            final: o.final
	    };
        if( o.elem ){
            this.dom = o.elem;
        }
	    this.actions.push( action );
	    return action;
    },
    removeAction: function( o ){

        var actions = this.actions;
        for( var i = 0; i < actions.length; i++ ){

            if( actions[ i ] === o ){

                actions.splice( i, 1 );
                break;
            }
        }
    },
    logicalTick: function(){

	    this.tick++;
	    var time = +new Date();
	    var gameDelta = time - this.startTime;

	    if( gameDelta < this.maxFramerateTime ){
	        this.nextTick();
	        return;
	    }

	    //this.startTime = this.currentTime;

	    this.render();
	    this.updateTimers();
        this.tickActions();
	    this.lastTick = time;
	    this.nextTick();

    },
    tickActions: function(){

        var actions = this.actions;

        for( var i = 0; i < actions.length; i++ ){

            var progress,
                action = actions[ i ];

            if( action.end != +Infinity ){
                progress = (this.currentTime - action.start) / (action.end - action.start);
            } else {
                progress = 0;
            }

            if( action.start <= this.currentTime ){

                if( !action.end || action.end <= this.currentTime ){

                    //Ensure final position
                    action.on( 1 );
                    if( action.final ){
                        action.final();
                    }
                    //Consider notifying action of pending death
                    this.removeAction( action );
                } else {
                    action.on( progress );
                }
            }
        }
    },
    //Ticking of the throttled game engine
    render: function(){

    },
    updateRollingFPS: function(){

    }

};
