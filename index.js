/* Controllers for poi game. */

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
    var CIRCLE_X = 500;
    var CIRCLE_Y = 500;
    var CIRCLE_R = 300;

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


document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);