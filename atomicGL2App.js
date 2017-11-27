// atomicGL
//----------------------------------------------------------------------------------------
// author: RC				
// contact: cozot@irisa.fr
// version: 0.1
// current version date: 2017/11/27
//----------------------------------------------------------------------------------------
// atomicGL2App
//----------------------------------------------------------------------------------------

'use strict';

// GL context
var agl;
// matrix stack
var ams;
// clock
var sceneClock;
//Scene graph xml
var sgxml;
// 3D Ojbect list
var objectList;
// requestAnimFrame ID
var requestId;
// Performance monitor
var stats;
// -------------------------------------------------

function webGLStart(sceneXmlFile) {
    // init
    // -----------------------------
    // recover OpenGL canvas
    agl = new atomicGL2Context();
    ams = new atomicGL2MatrixStack();
    sceneClock = new atomicGL2Clock();

    var canvas = document.getElementById("oglcanvas");
    // Handle context lost
    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    // init OpenGL context
    // canvas, background color
    agl.initGL(canvas, [0.15, 0.1, 0.5]);

    // scenegraph creation from xml file
    sgxml = new atomicGL2xml(agl, sceneXmlFile); //'example_castle_scene.xml'
    objectList = sgxml.objectList;

    // Ambiant light
    agl.ambientLightColor = [0.1, 0.05, 0.0];	// color

    // init Matrix Stack
    ams.initMatrix(agl, 45); // fov = 45 degrees

    //Init controls
    addControls();

    //Add default text to shader menu
    document.getElementById("shadName").textContent = "default shaders";

    stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.getElementById('oglcontainer').appendChild(stats.dom);

    // start the animation
    nextFrame();
}

// draw
// -----------------------------
function sceneDraw() {
    agl.initDraw();
    agl.scenegraph.draw(agl, ams);
}

// nextFrame
// -----------------------------
function nextFrame() {
    handleKeys();
    requestId = requestAnimFrame(nextFrame); //called every frame
    sceneDraw();
    animate();
    stats.update();
}

// animate
// ------------------------------
function animate() {
    // increase time
    sceneClock.tick();
}

// If WebGL Context lost
function handleContextLost(event) {
    event.preventDefault();
    cancelRequestAnimFrame(requestId);
}