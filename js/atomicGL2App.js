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
        //HTML canvas
        this.canvas;

        // this.init();
    }
    
    // Basic components init
    init() {
        this.ams = new atomicGL2MatrixStack();
        this.sceneClock = new atomicGL2Clock();
        //Init controls
        this.controls = new atomicGL2Controls();
        //Add default text to shader menu
        document.getElementById("shadName").textContent = "default shaders";
        //fps counter
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.getElementById('oglcontainer').appendChild(this.stats.dom);

        this.canvas = document.getElementById("oglcanvas");
        
        // DEBUG : test context lost and restore
        /* this.canvas = WebGLDebugUtils.makeLostContextSimulatingCanvas(this.canvas);
        // lose the context when I press click the mouse.
        var _this = this;
        window.addEventListener("mousedown", function() {
            _this.canvas.loseContext();
        }, false);
        this.canvas.setRestoreTimeout(5000);  // recover in 5 seconds */

        // Handle context lost
        this.canvas.addEventListener('webglcontextlost', this.handleContextLost.bind(this), false);
        this.canvas.addEventListener('webglcontextrestored', this.restoreLostContext.bind(this), false);
        
        this.webGLStart();
    }
    
    //WebGL init
    webGLStart() {
        // init OpenGL context
        // canvas, background color
        this.agl = new atomicGL2Context();
        this.agl.initGL(this.canvas, this.bgcolor);
        // scenegraph creation from xml file : shaders, program, textures, buffers
        let sceneXmlFile = document.getElementsByTagName("body")[0].id;
        console.log(sceneXmlFile);
        this.sgxml = new atomicGL2xml(this.agl, sceneXmlFile);
        this.objectList = this.sgxml.objectList;
        //reset attribs if context lost
        this.controls.setAglXml(this.agl, this.sgxml);
        // init Matrix Stack
        this.ams.initMatrix(this.agl, this.fov);
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
		// animate objects
		for each (obj in this.agl.shapes) {
			// if needs to be animated
			if(obj.animation) {
				obj.animate();
			}
		}
    }
    
    // If WebGL Context lost
    handleContextLost(event) {
        event.preventDefault();
        console.log('context lost');
        cancelRequestAnimFrame(this.requestId);
    }

    restoreLostContext(e) {
        console.log('context restored');
        this.webGLStart();
    }
}

let app = new atomicGL2App();
window.addEventListener("load", app.init());