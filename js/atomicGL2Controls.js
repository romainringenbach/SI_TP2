import atomicGL2UI from './atomicGL2UI.js';

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
    
    constructor() {
        this.agl;
        this.sgxml;
        this.mouseX = 0.0;
        this.mouseY = 0.0;
        this.windowHalfX = 0;
        this.windowHalfY = 0;
        this.currentlyPressedKeys = {};
        this.menuOpened = false;
        this.UI = new atomicGL2UI();

        // Mouse movements
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        //	Movement keyboard callbacks
        document.addEventListener('keydown', this.key.bind(this, true), false);
        document.addEventListener('keyup', this.key.bind(this, false), false);
        // Menu keyboard handling
        document.addEventListener('keyup', this.handleMenuKeyUp.bind(this), false);
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
    handleKeys() {
        //Mouse camera movement X
        if (Math.abs(this.mouseX) > 0.1) {
            this.agl.scenegraph.camera.turnright(1.0 * (this.mouseX * this.mouseX * this.mouseX));
        }
        //Mouse camera movement Y
        this.agl.scenegraph.camera.turnup(45 * this.mouseY);

        // Keyboard camera movement
        if (this.currentlyPressedKeys["d"]) // (D) Right
        {
            this.agl.scenegraph.camera.right();
        }
        if (this.currentlyPressedKeys["q"]) // (Q) Left
        {
            this.agl.scenegraph.camera.left();			//
        }
        if (this.currentlyPressedKeys["z"]) // (Z) Up
        {
            this.agl.scenegraph.camera.up();			//
        }
        if (this.currentlyPressedKeys["s"]) // (S) Down
        {
            this.agl.scenegraph.camera.down();			//
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
        if (eventKey === ".") { // Show shaders menu
            $("#overlay").toggle();
            // let overlay = document.getElementById('overlay');
            // if (overlay.style.display === 'none') {
            //     overlay.style.display = 'inline';
            // } else {
            //     overlay.style.display = 'none';
            // }
        }
        if (eventKey === "p")	// Shader Cartoon
        {
            let shaderBox = document.getElementById("shadName");
            if (shaderBox.textContent != "cartoon") {
                //Avec la syntaxe => 'this' réfère à l'instance d'atomicGL2Controls
                this.sgxml.objectList.forEach(objet => objet.setShader(this.agl.indexOfShader("cartoon")));
                this.sgxml.root.shaderId = 0;
                shaderBox.textContent = "cartoon";
            }
        }
        if (eventKey === "o") { // Shader Old Movie
            let shaderBox = document.getElementById("shadName");
            if (shaderBox.textContent != "old movie") {
                this.sgxml.objectList.forEach(objet => objet.setShader(this.agl.indexOfShader("blackAndWhiteMovie")));
                this.sgxml.root.shaderId = this.agl.indexOfShader("blackAndWhite");	// Apply shader to skybox
                shaderBox.textContent = "old movie";
            }
        }
        if (eventKey === "f") { // Fog Diff Shader
            let shaderBox = document.getElementById("shadName");
            if (shaderBox.textContent != "fog") {
                this.sgxml.objectList.forEach(objet => objet.setShader(this.agl.indexOfShader("texDiffFog")));
                this.sgxml.root.shaderId = 0;
                shaderBox.textContent = "fog";
            }
        }
        if (eventKey === "c") // (C) debug
        {
            console.log('atomicGL - Remi COZOT - 2015');
        }
        if (eventKey === "m") // (M) Side Menu
        {
            if (this.menuOpened) {
                this.UI.closeNav();
                this.menuOpened = false;
            } else {
                this.UI.openNav();
                this.menuOpened = true;
            }
        }
    }

    // mouse movements
    // ------------------------------
    onDocumentMouseMove(event) {
        //Use client width and height instead of window's
        this.windowHalfX = this.agl.gl.canvas.clientWidth / 2;
        this.windowHalfY = this.agl.gl.canvas.clientHeight / 2;
        this.mouseX = (event.clientX - this.windowHalfX) / this.windowHalfX;
        this.mouseY = (event.clientY - this.windowHalfY) / this.windowHalfY;
    }
}

export default atomicGL2Controls;