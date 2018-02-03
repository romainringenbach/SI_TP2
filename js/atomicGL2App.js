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
    }

    // Basic components init
    init() {
        this.ams = new atomicGL2MatrixStack();
        this.sceneClock = new atomicGL2Clock();
        //Add default text to shader menu
        document.getElementById("shadName").textContent = "default shaders";
        //fps counter
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        this.stats.dom.style.position = 'absolute';
        this.stats.dom.style.top = '15px';
        this.stats.dom.style.left = '15px';
        document.getElementById('canvas-container').appendChild(this.stats.dom);
        document.querySelector('input[name=FpsBtn]').addEventListener('change', this.toggleStatsPanel.bind(this), false);

        this.canvas = document.getElementById("oglcanvas");

        //Init controls
        this.controls = new atomicGL2Controls(this.canvas);

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

    toggleStatsPanel() {
        let checked = document.querySelector('input[name=FpsBtn]').checked;
        this.stats.dom.style.display = checked ? 'block' : 'none';
    }

    //WebGL init
    webGLStart() {
        // init OpenGL context
        // canvas, background color
        this.agl = new atomicGL2Context(this.sceneClock);
        this.agl.initGL(this.canvas, this.bgcolor);
        // scenegraph creation from xml file : shaders, program, textures, buffers
        let sceneXmlFile = document.getElementsByTagName("body")[0].id;
        this.sgxml = new atomicGL2xml(this.agl, sceneXmlFile);
        this.objectList = this.sgxml.objectList;
        //set attribs (or reset if context lost)
        this.controls.setAglXml(this.agl, this.sgxml);
        // init Matrix Stack
        this.ams.initMatrix(this.agl, this.fov);
        // start the animation

        //Waiting for objects/textures loading
        let wait = function () {
            if (this.agl.nbTextureLoaded != this.agl.nbTexture) {
                console.log("waiting for texture loading ......")
                window.setTimeout(wait, 1000);
            } else {
                this.controls.clearLoadStatus();
                this.nextFrame();
            }
        }.bind(this);

        wait();
    }

    // draw
    // -----------------------------
    sceneDraw() {
        this.agl.initDraw();
        // Actually "moves" the camera
        this.agl.scenegraph.draw(this.agl, this.ams);
    }

    // nextFrame
    // -----------------------------
    //https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    nextFrame(timestamp) {
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
        for (var i = 0; i < this.sgxml.animatedTransformations.length; i++) {
            this.sgxml.animatedTransformations[i].updateTime(this.sceneClock.getTotal());
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
window.addEventListener('load', app.init());
