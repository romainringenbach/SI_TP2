// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.3
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGL2Context
//----------------------------------------------------------------------------------------
class atomicGL2Context {
	// constructor
	// clk : scene clock
	//------------------------
	constructor(clk) {
		// attributes
		// -------------------------------------------------
		// GL context
		this.gl;
		// GL context size
		this.viewportWidth;
		this.viewportHeight;

		// lights
		// ambient
		this.ambientLightColor = [0.01, 0.01, 0.01];
		// omniDirLight
		this.omniLightColor = [];
		this.omniLightLocation = [];
		this.omniLightNumber = 0;
		this.omniLightScope = [];
		this.omniLightAbsolutePos = [];

		// GLtexture
		this.GLtexture = [];

		this.nbTexture = 0;
		this.nbTextureLoaded = 0;

		// -------------------------------------------------
		// scene assets
		// -------------------------------------------------
		// shaders
		this.shaderPrograms = [];
		// textures
		this.textures = [];
		// shapes
		this.shapes = [];
		// scene graph
		this.scenegraph = null;
		// Scene Clock
		this.clock = clk;

		this.t = 0;
	}

	// methods
	// --------------------------------------------------
	// initGL(canvas)
	//---------------------------
	// inputs: 	canvas: html canvas
	// 			backgroundColor: [float, float, float]
	initGL(canvas, backgroundColor) {
		// debug
		//console.log("atomicGLContext::initGL");
		// recover canvas openGL
		//Simplified way to grab WebGL context (see https://www.khronos.org/webgl/wiki/FAQ)
		this.gl = WebGLUtils.setupWebGL(canvas);
		console.log(this.gl.getSupportedExtensions());

		if (!this.gl) { // error in the initialisation of GL context
			alert("atomicGLContext::Could not initialise WebGL");
		}
		else { // GL context initialised -> first init (background color, DEPTH_TEST)
			//DEBUG
			//console.log(this.gl.getContextAttributes());
			this.viewportWidth = canvas.width;
			this.viewportHeight = canvas.height;
			this.gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], 1.0);
			this.gl.enable(this.gl.DEPTH_TEST);
			// For derivative functions : fwidth, dFdx, dFdy
			this.gl.getExtension('OES_standard_derivatives');
		}

		// GLtexture
		this.GLtexture.push(this.gl.TEXTURE0);
		this.GLtexture.push(this.gl.TEXTURE1);
		this.GLtexture.push(this.gl.TEXTURE2);
		this.GLtexture.push(this.gl.TEXTURE3);
		this.GLtexture.push(this.gl.TEXTURE4);
		this.GLtexture.push(this.gl.TEXTURE5);
		this.GLtexture.push(this.gl.TEXTURE6);
		this.GLtexture.push(this.gl.TEXTURE7);
	}
	// initDraw()
	//---------------------------
	initDraw() {
		//console.log("atomicGLContext::initDraw");
		resizeCanvasToDisplaySize(this.gl.canvas, window.devicePixelRatio); //WebGL-utils standard compliant
		this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight); //WebGL Standard compliant

		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}

	// pushLight(lightPos,lightColor)
	// ---------------------------
	// inputs: 	lightPos : float3 - light position
	// 			lightColor: float3 - light color
	//			lightScope: float3 - light scope
	pushLight(lightPos, lightColor, lightScope, absolutePos) {
		//console.log("atomicGLContext::pushLight");
		// increase Light number
		this.omniLightNumber = this.omniLightNumber + 1;
		// set data
		this.omniLightLocation.push(lightPos[0]);
		this.omniLightLocation.push(lightPos[1]);
		this.omniLightLocation.push(lightPos[2]);
		this.omniLightColor.push(lightColor[0]);
		this.omniLightColor.push(lightColor[1]);
		this.omniLightColor.push(lightColor[2]);
		this.omniLightScope.push(lightScope);
		this.omniLightAbsolutePos.push(absolutePos);

		//console.log("abs:"+absolutePos);
		//console.log("lightpos:"+this.omniLightLocation);
		//console.log("lightcolor:"+this.omniLightColor);
		//console.log("lightscope:"+this.omniLightScope);

	}

	// pushProgram(prog)
	// ---------------------------
	// inputs: prog - atomicGLShader
	pushProgram(prog) {
		//console.log("atomicGLContext::pushProgram");
		this.shaderPrograms.push(prog);
		let id = this.shaderPrograms.length - 1;
		//console.log("-- atomicGLContext::pushProgram("+prog.name+")-> index:"+id);
		return id;
	}

	// indexOfTexture
	// ---------------------------------------
	// input: 	id - string: id name of texture
	// output:	int - index of texture in this.textures
	indexOfTexture(id) {
		let res = -1;
		for (let i = 0; i < this.textures.length; i++) {
			let idTex = this.textures[i].id;
			if (id == idTex) { res = i; break }
		}
		return res;
	}

	// indexOfShader
	// ---------------------------------------
	// input: 	id - string: id name of shader
	// output:	int - index of shader in this.shaders
	indexOfShader(id) {
		let res = -1;
		for (let i = 0; i < this.shaderPrograms.length; i++) {
			let shadername = this.shaderPrograms[i].name;
			if (id == shadername) { res = i; break }
		}
		return res;
	}

	// indexOfShape
	// ---------------------------------------
	// input: 	id - string: id name of shape
	// output:	int - index of shape in this.shapes
	indexOfShape(id) {
		let res = -1;
		for (let i = 0; i < this.shapes.length; i++) {
			let shapename = this.shapes[i].name;
			if (id == shapename) { res = i; break }
		}
		return res;
	}

	updateTime(time){
		this.t = time;

	}

	getLightsLocation(){
		let t = this.t;
		let locations = []

		for (var i = 0; i < this.omniLightLocation.length; i++) {
			locations.push(eval(this.omniLightLocation[i]));
		}

		return locations;
	}

	getLightsColor(){
		let t = this.t;
		let colors = []

		for (var i = 0; i < this.omniLightColor.length; i++) {
			colors.push(eval(this.omniLightColor[i]));
		}

		return colors;
	}

	getLightsScope(){
		let t = this.t;
		let scopes = []

		for (var i = 0; i < this.omniLightScope.length; i++) {
			scopes.push(eval(this.omniLightScope[i]));
		}

		return scopes;
	}
}

export default atomicGL2Context;
