// atomicGL
//----------------------------------------------------------------------------------------
// author: RC				
// contact: cozot@irisa.fr
// version: 0.1
// current version date: 2017/11/27
//----------------------------------------------------------------------------------------
// atomicGL2Controls
//----------------------------------------------------------------------------------------

class atomicGL2Controls {

    constructor(canvas) {
        this.agl;
        this.canvas = canvas;
        this.sgxml;
        this.mouseX = 0.0;
        this.mouseY = 0.0;
        this.mouseLocked = false;
        this.friction = 0.025;
        this.currentlyPressedKeys = {};
        this.blocker = document.getElementById('blocker');
        this.instructions = document.getElementById('instructions');

        // Mouse movements
        this.canvas.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        //	Movement keyboard callbacks
        document.addEventListener('keydown', this.key.bind(this, true), false);
        document.addEventListener('keyup', this.key.bind(this, false), false);
        // Menu keyboard handling
        document.addEventListener('keyup', this.handleMenuKeyUp.bind(this), false);

        // Mouse pointer lock in canvas
        this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
            this.canvas.mozRequestPointerLock;

        if (! this.canvas.requestPointerLock) {
            this.instructions.innerHTML = 'Your browser does not support Pointer Lock API.<br/> \
                                        Update your browser and try again.';
        }

        document.exitPointerLock = document.exitPointerLock ||
            document.mozExitPointerLock;

        document.addEventListener('pointerlockerror', this.lockError, false);
        document.addEventListener('mozpointerlockerror', this.lockError, false);
        document.addEventListener( 'webkitpointerlockerror', this.lockError, false );

        this.instructions.onclick = (function () {
            this.instructions.style.display = 'none';
            this.canvas.requestPointerLock();
        }).bind(this);

        document.addEventListener('pointerlockchange', this.pointerlockChange.bind(this), false);
        document.addEventListener('mozpointerlockchange', this.pointerlockChange.bind(this), false);
        document.addEventListener('webkitpointerlockchange', this.pointerlockChange.bind(this), false);
    }

    setAglXml(agl, sgxml) {
        this.agl = agl;
        this.sgxml = sgxml;
    }

    // keyboard movements
    // --------------------------------
    key(pressed, event) { this.currentlyPressedKeys[event.key] = pressed; }

    // ONLY FOR CAMERA MOVEMENT
    // --------------------------------
    // Called each frame
    handleKeys() {
        // Keyboard camera movement
        if (this.currentlyPressedKeys["d"]) // (D) strafeRight
        {
            this.agl.scenegraph.camera.strafeRight();
        }
        if (this.currentlyPressedKeys["q"]) // (Q) strafeLeft
        {
            this.agl.scenegraph.camera.strafeLeft();			//
        }
        if (this.currentlyPressedKeys["z"]) // (Z) forward
        {
            this.agl.scenegraph.camera.forward();			//
        }
        if (this.currentlyPressedKeys["s"]) // (S) backward
        {
            this.agl.scenegraph.camera.backward();			//
        }
        if (this.currentlyPressedKeys[" "]) // (space)
        {
            this.agl.scenegraph.camera.flyUp();			//
        }
        if (this.currentlyPressedKeys["Control"]) // (ctrl)
        {
            this.agl.scenegraph.camera.flyDown();			//
        }
    }

    // Only for menus and such
    // --------------------------------
    handleMenuKeyUp(event) {
        const eventKey = event.key;
        let shaderBox = document.getElementById("shadName");
        if (eventKey === ".") { // Show shaders menu
            $("#shaderMenu").toggle();
        }
        if (eventKey === "p")	// Shader Cartoon
        {
            if (shaderBox.textContent != "cartoon") {
                //Avec la syntaxe => 'this' réfère à l'instance d'atomicGL2Controls
                this.sgxml.objectList.forEach(objet => objet.setShader(this.agl.indexOfShader("cartoon")));
                this.sgxml.root.shaderId = 0;
                shaderBox.textContent = "cartoon";
            }
        }
        if (eventKey === "o") { // Shader Old Movie
            if (shaderBox.textContent != "old movie") {
                this.sgxml.objectList.forEach(objet => objet.setShader(this.agl.indexOfShader("blackAndWhiteMovie")));
                this.sgxml.root.shaderId = this.agl.indexOfShader("blackAndWhite");	// Apply shader to skybox
                shaderBox.textContent = "old movie";
            }
        }
        if (eventKey === "f") { // Fog Diff Shader
            if (shaderBox.textContent != "fog") {
                this.sgxml.objectList.forEach(objet => objet.setShader(this.agl.indexOfShader("texDiffFog")));
                this.sgxml.root.shaderId = 0;
                shaderBox.textContent = "fog";
            }
        }
        if (eventKey === "i") { // Sepia
            if (shaderBox.textContent != "Sepia") {
                this.sgxml.objectList.forEach(objet => objet.setShader(this.agl.indexOfShader("texDiffSepia")));
                this.sgxml.root.shaderId = this.agl.indexOfShader("sepiaSkybox");	// Apply shader to skybox
                shaderBox.textContent = "Sepia";
            }
        }
        if (eventKey === "u") { // shaderPsycho
            if (shaderBox.textContent != "shaderPsycho") {
                this.sgxml.objectList.forEach(objet => objet.setShader(this.agl.indexOfShader("shaderPsycho")));
                this.sgxml.root.shaderId = 0;
                shaderBox.textContent = "shaderPsycho";
            }
        }
        if (eventKey === "c") // (C) debug
        {
            console.log('atomicGL - Remi COZOT - 2015');
        }
    }

    // mouse movements
    // ------------------------------
    onDocumentMouseMove(event) {
        //Use client width and height instead of window's
            /* this.windowHalfX = this.agl.gl.canvas.clientWidth / 2;
            this.windowHalfY = this.agl.gl.canvas.clientHeight / 2;
            this.mouseX = (event.clientX - this.windowHalfX) / this.windowHalfX;
            this.mouseY = (event.clientY - this.windowHalfY) / this.windowHalfY; */
        if (this.mouseLocked) {
            this.mouseX = this.friction * event.movementX;
            this.mouseY = this.friction * event.movementY;
            this.agl.scenegraph.camera.turnright(this.mouseX);
            this.agl.scenegraph.camera.turnup(this.mouseY);
        }
    }

    pointerlockChange() {
        if (document.pointerLockElement === this.canvas ||
            document.mozPointerLockElement === this.canvas) {
            console.log('The pointer lock status is now locked');
            this.mouseLocked = true;
            this.blocker.style.display = 'none';
        } else {
            console.log('The pointer lock status is now unlocked');
            this.mouseLocked = false;
            this.blocker.style.display = 'box';
            this.blocker.style.display = '-moz-box';
            this.blocker.style.display = '-webkit-box';
            this.instructions.style.display = '';
        }
    }

    lockError(e) {
        alert("Pointer lock failed");
        this.instructions.style.display = '';
    }
}

export default atomicGL2Controls;