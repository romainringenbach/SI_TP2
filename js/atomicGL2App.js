import atomicGL2Controls from './atomicGL2Controls.js';
import atomicGL2MatrixStack from './atomicGL2MatrixStack.js';
import atomicGL2Context from './atomicGL2Context.js';
import atomicGL2Clock from './atomicGL2Clock.js';
import atomicGL2xml from './atomicGL2xml.2.js';
// atomicGL
//----------------------------------------------------------------------------------------
// author: RC				
// contact: cozot@irisa.fr
// version: 0.1
// current version date: 2017/11/27
//----------------------------------------------------------------------------------------
// atomicGL2App
//----------------------------------------------------------------------------------------

// -------------------------------------------------
class atomicGL2App {

    constructor() {
        // GL context
        this.agl;
        // matrix stack
        this.ams;
        // clock
        this.sceneClock;
        //Scene graph xml
        this.sgxml;
        // 3D Ojbect list
        this.objectList;
        // requestAnimFrame ID
        this.requestId;
        // Performance monitor
        this.stats;
        // Controls
        this.controls;
        // Field of view (for camera perspective)
        this.fov = 45;
        // Canvas background color
        this.bgcolor = [0.15, 0.1, 0.5];

        this.webGLStart();
    }
    
    webGLStart() {
        // init
        // -----------------------------
        // recover OpenGL canvas
        this.agl = new atomicGL2Context();
        this.ams = new atomicGL2MatrixStack();
        this.sceneClock = new atomicGL2Clock();
    
    
        let canvas = document.getElementById("oglcanvas");
        // Handle context lost
        canvas.addEventListener('webglcontextlost', this.handleContextLost.bind(this), false);
        // init OpenGL context
        // canvas, background color
        this.agl.initGL(canvas, this.bgcolor);
    
        // scenegraph creation from xml file
        let sceneXmlFile = document.getElementsByTagName("body")[0].id;
        console.log(sceneXmlFile);
        this.sgxml = new atomicGL2xml(this.agl, sceneXmlFile); //'example_castle_scene.xml'
        this.objectList = this.sgxml.objectList;
    
        // init Matrix Stack
        this.ams.initMatrix(this.agl, this.fov);
    
        //Init controls
        this.controls = new atomicGL2Controls(this.agl, this.sgxml);
    
        //Add default text to shader menu
        document.getElementById("shadName").textContent = "default shaders";
    
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.getElementById('oglcontainer').appendChild(this.stats.dom);
    
        // start the animation
        this.nextFrame();
    }
    
    // draw
    // -----------------------------
    sceneDraw() {
        this.agl.initDraw();
        this.agl.scenegraph.draw(this.agl, this.ams);
    }
    
    // nextFrame
    // -----------------------------
    nextFrame() {
        this.controls.handleKeys();
        this.requestId = requestAnimFrame(this.nextFrame.bind(this)); //called every frame
        this.sceneDraw();
        this.animate();
        this.stats.update();
    }
    
    // animate
    // ------------------------------
    animate() {
        // increase time
        this.sceneClock.tick();
    }
    
    // If WebGL Context lost
    handleContextLost(event) {
        event.preventDefault();
        cancelRequestAnimFrame(this.requestId);
    }
}

let app = new atomicGL2App();
// window.addEventListener("load", new atomicGL2App());