// atomicGL
//----------------------------------------------------------------------------------------
// author: RC				
// contact: cozot@irisa.fr
// version: 0.1
// current version date: 2017/11/27
//----------------------------------------------------------------------------------------
// atomicGL2Controls
//----------------------------------------------------------------------------------------

'use strict';

var mouseX = 0.0;
var mouseY = 0.0;
var windowHalfX, windowHalfY;
var currentlyPressedKeys = {};

function addControls() {
    // Mouse movements
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    //	Movement keyboard callbacks
    document.addEventListener('keydown', handleKeyDown, false);
    document.addEventListener('keyup', handleKeyUp, false);
    // Menu keyboard handling
    document.addEventListener('keyup', handleMenuKeyUp, false);
}

// keyboard
// --------------------------------
function handleKeyDown(event) { currentlyPressedKeys[event.keyCode] = true; }
function handleKeyUp(event) { currentlyPressedKeys[event.keyCode] = false; }

// ONLY FOR CAMERA MOVEMENT
function handleKeys() {
    //Mouse camera movement X
    if (Math.abs(mouseX) > 0.1) {
        agl.scenegraph.camera.turnright(1.0 * (mouseX * mouseX * mouseX));
    }
    //Mouse camera movement Y
    agl.scenegraph.camera.turnup(45 * mouseY);

    // Keyboard camera movement
    if (currentlyPressedKeys[68]) // (D) Right
    {
        agl.scenegraph.camera.right();
    }
    if (currentlyPressedKeys[81]) // (Q) Left
    {
        agl.scenegraph.camera.left();			//
    }
    if (currentlyPressedKeys[90]) // (Z) Up
    {
        agl.scenegraph.camera.up();			//
    }
    if (currentlyPressedKeys[83]) // (S) Down
    {
        agl.scenegraph.camera.down();			//
    }
    if (currentlyPressedKeys[32]) // (space)
    {
        agl.scenegraph.camera.flyUp();			//
    }
    if (currentlyPressedKeys[17]) // (ctrl)
    {
        agl.scenegraph.camera.flyDown();			//
    }
}

// Only for menus and such
function handleMenuKeyUp(event) {
    const keyName = event.code;
    if (keyName === 'NumpadDecimal') { // Show shaders menu
        $("#overlay").toggle();
    }
    if (keyName === "KeyP")	// Shader Cartoon
    {
        objectList.forEach(function (objet) {
            objet.setShader(agl.indexOfShader("cartoon"));
        });
        sgxml.root.shaderId = 0;
        document.getElementById("shadName").textContent = "cartoon";
    }
    if (keyName === "KeyO") { // Shader Old Movie
        objectList.forEach(function (objet) {
            objet.setShader(agl.indexOfShader("blackAndWhiteMovie"));
        });
        sgxml.root.shaderId = agl.indexOfShader("blackAndWhite");	// Apply shader to skybox
        document.getElementById("shadName").textContent = "old movie";
    }
    if (keyName === "KeyC") // (C) debug
    {
        console.log('atomicGL - Remi COZOT - 2015');
    }
}

// mouse movements
// ------------------------------
function onDocumentMouseMove(event) {
    //omouseX = mouseX;
    //Use client width and height instead of window's
    windowHalfX = agl.gl.canvas.clientWidth / 2;
    windowHalfY = agl.gl.canvas.clientHeight / 2;
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;
}