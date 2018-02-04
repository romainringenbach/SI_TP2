import atomicGL2Sounds from './atomicGL2Sounds.js';
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
        this.mouseLookFriction = 0.025;
        this.currentlyPressedKeys = {};
        this.blocker = document.getElementById('blocker');
        this.instructions = document.getElementById('instructions');
        // Sounds
        this.howlers;

        this.showLoadStatus();
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
        if (!this.mouseLocked)
            return;

        //Set un attribut frameDelta avec clock.get() dans la classe camera depuis ici
        //plutôt que d'appeler plusieurs fois get() dans la camera.
        this.agl.scenegraph.camera.setframeTime(this.agl.clock.get());
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
            // $("#shaderMenu").toggle();
            let shaderMenu = document.getElementById('shaderMenu');
            if (shaderMenu.style.display === 'none') {
                shaderMenu.style.display = 'inline';
            } else {
                shaderMenu.style.display = 'none';
            }
        }
        if (eventKey === "p")	// Shader Cartoon
        {
            if (shaderBox.textContent != "cartoon") {
                //Avec la syntaxe => 'this' réfère à l'instance d'atomicGL2Controls
                this.sgxml.objectList.forEach(objet => objet.setShader(this.agl.indexOfShader("cartoon")));
                this.sgxml.root.shaderId = 0;
                shaderBox.textContent = "cartoon";
                this.howlers.playTheme('PianoSong');
            }
        }
        if (eventKey === "o") { // Shader Old Movie
            if (shaderBox.textContent != "old movie") {
                this.sgxml.objectList.forEach(objet => objet.setShader(this.agl.indexOfShader("blackAndWhiteMovie")));
                this.sgxml.root.shaderId = this.agl.indexOfShader("blackAndWhite");	// Apply shader to skybox
                shaderBox.textContent = "old movie";
                this.howlers.playTheme('JazzMusic');
            }
        }
        if (eventKey === "f") { // Fog Diff Shader
            if (shaderBox.textContent != "fog") {
                this.sgxml.objectList.forEach(objet => objet.setShader(this.agl.indexOfShader("texDiffFog")));
                this.sgxml.root.shaderId = this.agl.indexOfShader("texDiffFogSkybox");	// Apply shader to skybox
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
                this.sgxml.root.shaderId = this.agl.indexOfShader("psychoSkybox");	// Apply shader to skybox
                shaderBox.textContent = "shaderPsycho";
                this.howlers.playTheme('psychedelic');
            }
        }
        if (eventKey === "c") // (C) debug
        {
            console.log('atomicGL - Remi COZOT - 2015');
        }
    }

    enableControls() {
        this.initListeners();
        this.howlers = new atomicGL2Sounds();
        this.howlers.playTheme('harmonica');
    }

    initListeners() {
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

        if (!this.canvas.requestPointerLock) {
            this.instructions.innerHTML = 'Your browser does not support Pointer Lock API.<br/> \
                                        Update your browser and try again.';
        }

        document.exitPointerLock = document.exitPointerLock ||
            document.mozExitPointerLock;

        document.addEventListener('pointerlockerror', this.lockError, false);
        document.addEventListener('mozpointerlockerror', this.lockError, false);
        document.addEventListener('webkitpointerlockerror', this.lockError, false);

        this.instructions.addEventListener('click', this.lockPointer.bind(this), false);

        document.addEventListener('pointerlockchange', this.pointerlockChange.bind(this), false);
        document.addEventListener('mozpointerlockchange', this.pointerlockChange.bind(this), false);
        document.addEventListener('webkitpointerlockchange', this.pointerlockChange.bind(this), false);

        // FullScreen stuff
        if (
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled
        ) {
            this.canvas.requestFullscreen = this.canvas.requestFullscreen ||
                this.canvas.webkitRequestFullscreen || this.canvas.mozRequestFullScreen ||
                this.canvas.msRequestFullscreen;

            document.addEventListener("fullscreenchange", this.fullScreenChange.bind(this), false);
            document.addEventListener("mozfullscreenchange", this.fullScreenChange.bind(this), false);
            document.addEventListener("webkitfullscreenchange", this.fullScreenChange.bind(this), false);
            document.addEventListener("MSFullscreenChange", this.fullScreenChange.bind(this), false);

            document.getElementById('FullScreenBtn').addEventListener('click', this.clickFullScreen.bind(this), false);
        } else {
            document.getElementById('FullScreenBtn').src = './images/x-button.png';
            document.getElementById('FullScreenBtn').style.cursor = 'not-allowed';
        }
    }
    // mouse movements
    // ------------------------------
    onDocumentMouseMove(event) {
        if (this.mouseLocked) {
            this.mouseX = this.mouseLookFriction * event.movementX;
            this.mouseY = this.mouseLookFriction * event.movementY;
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

    lockPointer() {
        this.instructions.style.display = 'none';
        this.canvas.requestPointerLock();
    }

    clickFullScreen() {
        this.canvas.requestFullscreen();
    }

    fullScreenChange() {
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        ) {
            this.instructions.style.display = 'none';
            this.canvas.requestPointerLock();
        }
    }

    lockError(e) {
        alert("Pointer lock failed");
        this.instructions.style.display = '';
    }

    showLoadStatus() {
        this.instructions.innerHTML = '<span style="font-size:40px">Loading scene...</span> \
                                    <br /> Please wait.';
    }

    clearLoadStatus() {
        this.instructions.innerHTML = '<span style="font-size:40px">Click to begin</span> \
                                    <br /> (Z,Q,S,D = Move, SPACE = Fly up, CTRL = Fly down, MOUSE = Look) \
                                    <br /> (ESC = Exit pointerLock or fullScreen)';
        this.enableControls();
    }
}

export default atomicGL2Controls;
