/* Set up environment for two poi
 * Fork of Matter.js Newton's cradle example
 *   http://brm.io/matter-js/demo/#newtonsCradle
 */

var dirtyConstraint = null;

var Example = Example || {};

Example.poi = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Composites = Matter.Composites,
        Composite = Matter.Composite,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: Math.min(document.documentElement.clientWidth, 1920),
            height: Math.min(document.documentElement.clientHeight, 1080),
            //showVelocity: true,
            wireframes: false,
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies

    Composites.poi = function(xx, yy, number, size, length) {
        var newtonsCradle = Composite.create({ label: 'poi' });

        for (var i = 0; i < number; i++) {
            var separation = 1.9,
                circle = Bodies.circle(
                    xx + i * (size * separation), yy + length, size, 
                    {
                        inertia: Infinity,
                        restitution: 1,
                        friction: 0,
                        frictionAir: 0.0001, 
                        slop: 1,
                        render: {
                            strokeStyle: 'transparent',
                            //lineWidth: 0, 
                            fillStyle: '#11EFDE',

                        },
                    });
                
                tether = Constraint.create(
                { 
                    pointA: { 
                        x: xx + i * (size * separation), 
                        y: yy 
                    }, 
                    bodyB: circle,
                    render: {
                        strokeStyle: 'blue',
                    } 
                });
                dirtyConstraint = tether;

            /*
            var shameCircle = Bodies.circle(
                xx + i * (size * separation), yy + length, size, 
                    {
                        inertia: Infinity,
                        restitution: 1,
                        friction: 0,
                        frictionAir: 0.0001, 
                        slop: 1,
                        render: {
                            strokeStyle: 'transparent',
                            fillStyle: '#11EFDE',
                        }
                    }
                );
            var shameConstraint = Constraint.create({ 
                bodyA: shameCircle,
                bodyB: circle,
            });
            */

            Composite.addConstraint(newtonsCradle, tether);    
            Composite.addBody(newtonsCradle, circle);
            //Composite.addConstraint(newtonsCradle, shameConstraint);    
            //Composite.addBody(newtonsCradle, shameCircle);
        }

        return newtonsCradle;
    };

    var cradle = Composites.poi(200, 100, 1, 30, 200);
    World.add(world, cradle);
    Body.translate(cradle.bodies[0], { x: -180, y: -100 });
    
    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 50 },
        max: { x: 800, y: 600 }
    });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};
