/* Controllers for poi game. */

var CIRCLE_X = 500;
var CIRCLE_Y = 500;
var CIRCLE_R = 300;
var GAMEPAD_INTERVAL = 25;  // millis

function gameLoop() {
    /* todo: look at
     * Matter.Engine.update
     *   http://brm.io/matter-js/docs/classes/Engine.html#method_update
     * Matter.Render.tick
     *   http://brm.io/matter-js/docs/classes/Runner.html#method_tick
     */
     
     // TODO: make the poi "hands" (worldbody constraints) move.
};

function onMouseUpdate(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
    var newCoords = circleLimiter(mouseX, mouseY);
    dirtyConstraint.pointA.x = newCoords[0];
    dirtyConstraint.pointA.y = newCoords[1];
}

function circleLimiter(x, y) {
    /* limits the motion of the poi to within a circle */

    var r = Math.sqrt(Math.pow(x - CIRCLE_X, 2) + Math.pow(y - CIRCLE_Y, 2));
    if (r <= CIRCLE_R) {
        return [x, y];
    }

    var ratio = CIRCLE_R / r;
    return [
        CIRCLE_X + (x - CIRCLE_X) * ratio,
        CIRCLE_Y + (y - CIRCLE_Y) * ratio
    ];
}


//document.addEventListener('mousemove', onMouseUpdate, false);
//document.addEventListener('mouseenter', onMouseUpdate, false);



/* our code for dealing with gamepads */

function onGamepadChange() {
    ///reportOnGamepad(); //game pad tester bit

    var gp = navigator.getGamepads()[0]; // TODO safety checks (is it connected, does one exist)
    
    var stick1 = {
        x: gp.axes[0] * CIRCLE_R + CIRCLE_X,
        y: gp.axes[1] * CIRCLE_R + CIRCLE_Y,
    };

    console.log(stick1);
    var newCoords = circleLimiter(stick1.x, stick1.y);
    dirtyConstraint.pointA.x = newCoords[0];
    dirtyConstraint.pointA.y = newCoords[1];
}



/* example code for dealing with gamepads */

var hasGP = false;
var repGP;

function canGame() {
    return "getGamepads" in navigator;
}

function reportOnGamepad() {
    var gp = navigator.getGamepads()[0];
    var html = "";
        html += "id: "+gp.id+"<br/>";

    for(var i=0;i<gp.buttons.length;i++) {
        html+= "Button "+(i+1)+": ";
        if(gp.buttons[i].pressed) html+= " pressed";
        html+= "<br/>";
    }

    for(var i=0;i<gp.axes.length; i+=2) {
        html+= "Stick "+(Math.ceil(i/2)+1)+": "+gp.axes[i]+","+gp.axes[i+1]+"<br/>";
    }

    $("#gamepadDisplay").html(html);
}

$(document).ready(function() {

    if(canGame()) {

        var prompt = "To begin using your gamepad, connect it and press any button!";
        $("#gamepadPrompt").text(prompt);

        $(window).on("gamepadconnected", function() {
            hasGP = true;
            $("#gamepadPrompt").html("Gamepad connected!");
            console.log("connection event");
            repGP = window.setInterval(onGamepadChange, GAMEPAD_INTERVAL);
        });

        $(window).on("gamepaddisconnected", function() {
            console.log("disconnection event");
            $("#gamepadPrompt").text(prompt);
            window.clearInterval(repGP);
        });

        //setup an interval for Chrome
        var checkGP = window.setInterval(function() {
            console.log('checkGP');
            if(navigator.getGamepads()[0]) {
                if(!hasGP) $(window).trigger("gamepadconnected");
                window.clearInterval(checkGP);
            }
        }, 500);
    }

});