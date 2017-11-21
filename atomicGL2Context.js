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
	//------------------------
	constructor(){
		// attributes
		// -------------------------------------------------
		// GL context
		this.gl ;
		// GL context size
		this.viewportWidth ;
		this.viewportHeight ;

		// lights
		// ambient
		this.ambientLightColor = [0.01,0.01,0.1];
		// omniDirLight
		this.omniLightColor = [] ;
		this.omniLightLocation = [] ;
		this.omniLightNumber = 0;
	 
		// GLtexture
		this.GLtexture = [] ;
	
		// -------------------------------------------------
		// scene assets
		// -------------------------------------------------
		// shaders
		this.shaderPrograms = [];
		// textures
		this.textures = [] ;
		// shapes
		this.shapes = [] ;
		// scene graph
		this.scenegraph = null ;
	}
	
	// methods
	// --------------------------------------------------
	// initGL(canvas)
	//---------------------------
	// inputs: 	canvas: html canvas
	// 			backgroundColor: [float, float, float]
	initGL(canvas,backgroundColor) {
		// debug
		//console.log("atomicGLContext::initGL");
		// recover canvas openGL
        try {
            this.gl = canvas.getContext("webgl");
            this.viewportWidth = canvas.width;
            this.viewportHeight = canvas.height;
        } catch (e) {}
        if (!this.gl) { // error in the initialisation of GL context
            alert("atomicGLContext::Could not initialise WebGL");
        }
		else { // GL context initialised -> first init (background color, DEPTH_TEST)
			this.gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], 1.0);
			this.gl.enable(this.gl.DEPTH_TEST);
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
		// debug
		//console.log("atomicGLContext::initDraw");
		this.gl.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}
	
	// pushLight(lightPos,lightColor)
	// ---------------------------
	// inputs: 	lightPos : float3 - light position
	// 			lightColor: float3 - light color
	pushLight(lightPos,lightColor){
		// debug
		//console.log("atomicGLContext::pushLight");		
		// increase Light number
		this.omniLightNumber = this.omniLightNumber + 1;
		// set data
		this.omniLightLocation.push(lightPos[0]) ;
		this.omniLightLocation.push(lightPos[1]) ;
		this.omniLightLocation.push(lightPos[2]) ;
		this.omniLightColor.push(lightColor[0]) ;
		this.omniLightColor.push(lightColor[1]) ;
		this.omniLightColor.push(lightColor[2]) ;
		}
	
	// pushProgram(prog)
	// ---------------------------
	// inputs: prog - atomicGLShader
	pushProgram(prog){ 
		// debug
		//console.log("atomicGLContext::pushProgram");
		this.shaderPrograms.push(prog); 
		var id =  this.shaderPrograms.length -1
		// debug
		//console.log("-- atomicGLContext::pushProgram("+prog.name+")-> index:"+id);
		return  id ;
	}
	
	// indexOfTexture
	// ---------------------------------------
	// input: 	id - string: id name of texture
	// output:	int - index of texture in this.textures
	indexOfTexture(id){
		var res = -1 ;
		for (var i=0; i<this.textures.length;i++){
			var idTex = this.textures[i].id ;
			if (id==idTex){res = i;break}
		}
		return res;
	}

	// indexOfShader
	// ---------------------------------------
	// input: 	id - string: id name of shader
	// output:	int - index of shader in this.shaders
	indexOfShader(id){
		var res = -1 ;
		for (var i=0; i<this.shaderPrograms.length;i++){
			var shadername = this.shaderPrograms[i].name ;
			if (id==shadername){res = i;break}
		}
		return res;
	}
	
	// indexOfShape
	// ---------------------------------------
	// input: 	id - string: id name of shape
	// output:	int - index of shape in this.shapes
	indexOfShape(id){
		var res = -1 ;
		for (var i=0; i<this.shapes.length;i++){
			var shapename = this.shapes[i].name ;
			if (id==shapename){res = i;break}
		}
		return res;
	}
}