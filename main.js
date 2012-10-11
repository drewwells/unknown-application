var canvas = document.querySelector("#maincanvas"),
	context = canvas.getContext("2d"),
	engine = engineProto.clone();

//Now with NOS, start your engines
engine.start();

var render = function(){
	//Draw shape1
	context.clearRect(0, 0, canvas.width, canvas.height);
	shape1();
	//Draw shape2
	//Draw shape3
	//Draw shape4
};

var capture = {
	/*
	{ x, y, w, h, fire }
	*/
	handlers: [],
	handler: function( o ){
		capture.handlers.push( o );
	},
	click: function( e ){

		var x = e.offsetX,
		    y = e.offsetY;

		for( var i = 0; i < capture.handlers.length; i++ ){

			var handle = capture.handlers[i];
			if( x >= handle.x && x <= handle.x + handle.w
				&& y >= handle.y && y <= handle.y + handle.h ){
				handle.fire( x, y, e );
			    capture.handlers.splice(i,1);
			}

		}
	}
};

canvas.addEventListener("mousedown", capture.click );

var shape1 = (function(){

	var ctx = context,
	    hidden = [500,500,40,10],
	    current = initial = [10,10,80,50];

    var show = function(){

		capture.handler({
			x: hidden[0],
			y: hidden[1],
			w: hidden[2],
			h: hidden[3],
			fire: function(){

				engine.action({
					start: 0,
					end: 500,
					on: function( prog ){

    				    //Don't I wish I wrote something to handle this
    				    for( var i = 0; i < 4; i++ ){
    				    	current[i] = hidden[i] + ( initial[i] - hidden[i] ) * prog;
    				    }

    				},
    				final: hide
    			});
			}
		});
	};

	var hide = function(){

		capture.handler({
			x: initial[0],
			y: initial[1],
			w: initial[2],
			h: initial[3],
			fire: function(){

				engine.action({
					start: 0,
					end: 750,
					on: function( prog ){

    				    //Don't I wish I wrote something to handle this
    				    for( var i = 0; i < 4; i++ ){
    				    	current[i] = initial[i] + ( hidden[i] - initial[i] ) * prog;
    				    }
    				},
    				final: show
    			});
			}
		});
	};

	hide();

	return function(){

		ctx.fillRect.apply( ctx, current );
	};
})();

var shape2 = (function(){
	var ctx = context,
	    current = initial = [10,10,80,50];

	return function(){
		ctx.fillRect( current );
	};
})();


engine.action({
	start: 250,
	end: +Infinity,
	on: render
});


var init = function( ){
    var canvas = document.getElementById("maincanvas");
    context = canvas.getContext("2d");
	canvas.addEventListener('mousedown', 	MouseEvent.bind(null, OnMouseDown), false);
	canvas.addEventListener('mouseup',   	MouseEvent.bind(null, OnMouseUp), false);
	canvas.addEventListener('mousemove',   	MouseEvent.bind(null, OnMouseMove), false);
}

function mouse(handler, ev)
{

	var x, y;

	// Get the mouse position relative to the canvas element.
	if (ev.layerX || ev.layerX == 0) { // Firefox
		x = ev.layerX;
		y = ev.layerY;
	} else if (ev.offsetX || ev.offsetX == 0) { // Opera
		x = ev.offsetX;
		y = ev.offsetY;
	}

	handler(x, y);

}

function DrawRect(x, y, width, height, filled, color)
{
    if (filled)
    {
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    }
    else
    {
        context.strokeStyle = color;
        context.strokeRect(x, y, width, height);
    }
}

function ClearRect(x, y, width, height)
{
    context.clearRect(x, y, width, height);
}

function DrawText(x, y, color, text, size, bold)
{
    boldText = "";
    if (bold)
    {
        boldText = "bold";
    }
    context.font = boldText + (size.toString() + "px Arial");
    context.fillStyle = color;
    context.fillText(text, x, y);
}

function OnMouseDown(x, y)
{
}

function OnMouseUp(x, y)
{
}

function OnMouseMove(x, y)
{
}

function Update()
{
    ClearRect(0, 0, 400, 400);
    DrawGUI();
}

function DrawGUI()
{
    DrawRect(50, 100, 80, 20, true, "rgb(200, 20, 20)");

    ClearRect(60, 105, 60, 10);

    DrawRect(48, 98, 84, 24, false, "rgb(80, 100, 90)");

    DrawText(40, 70, "rgb(0, 0, 130)", "Hello", 20, false);
    DrawText(40, 90, "rgb(0, 130, 0)", "World!", 25, true);
}

//setInterval(Update, 20);

