// http://jsfiddle.net/2z49s/2/
/*
 * Sample usage
EngineAnimation( saying, {
    start: function() {
        console.log('start');
        return false;
    },
    on: function(ev) {

        if (ev.elapsedTime >= 3) {
            ev.target.style.webkitAnimationPlayState = 'paused';
            ev.target.innerHTML = 'Pausing!!';
            setTimeout(function() {
                ev.target.style.webkitAnimationPlayState = 'running';
                ev.target.innerHTML = 'BLINK';
            }, 2000);
        }

    },
    end: function() {
        console.log('end');
    },
    name: 'glow',
    duration: '1500ms',
    iterations: 3
});

 */

var EngineAnimation = function( elem, props ){
    //Fuck new, this is an awesome constructor
    return Object.create( EngineAnimation.prototype.init( elem, props ) );
};

EngineAnimation.prototype = {
    //These are different for every browser
    events: {
        start: 'webkitAnimationStart',
        on: 'webkitAnimationIteration',
        end: 'webkitAnimationEnd'
    },
    map: (function(){

              var stub = {
                  name: 'animationName',
                  iterations: 'AnimationIterationCount',
                  delay: 'AnimationDelay',
                  easing: 'AnimationTimingFunction',
                  fill: 'AnimationFillMode',
                  state: 'AnimationPlayState',
                  direction: 'AnimationDirection',
                  duration: 'AnimationDuration',
                  fillmode: 'AnimationFillMode',
                  timing: 'AnimationTimingFunction'
              };

              for( prop in stub){
                  stub[ prop ] = Modernizr.prefixed( stub[ prop ] );
              }

              return stub;
          })(),
    styles: {
        timing: 'linear',
        duration: '500ms',
        fillmode: 'forwards'
    },
    //How many of these damned callbacks are you adding to the global scope?
    global: 0,
    init: function( elem, props ){

        var prop, style,
            self = this;

        if( !elem ){
            return false;
        }

        //Bind events
        Object.keys( this.events ).forEach(function( ev ){

            var name, event;

            if( props[ ev ] ){

                name = 'creep' + self.global++;
                event = self.events[ ev ];

                window[ name ] = function() {
                    props[ ev ].apply( self, arguments );
                };
                //Bind those creep fns
                elem.addEventListener( event, props[ ev ] );
            }

        });

        //Bind props
        for( prop in this.map ){

            if( prop in props ){

                this.styles[ prop ] = props[ prop ];
            }
        }

        for( style in this.styles ){
            //Translate and set the properties
            elem.style[ this.map[ style ] ] = this.styles[ style ];
        }
        //Return styles successfully added
        return elem.style;
    }
};
