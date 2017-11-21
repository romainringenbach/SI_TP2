// atomicGL2
//----------------------------------------------------------------------------------------
// author: RC				
// contact: cozot@irisa.fr
// version: 2.2
// current version date: 2016/01/28
//----------------------------------------------------------------------------------------
// atomicGL2Shader
// atomicGL2MatShader exetnds  atomicGL2Shader
// atomicGL2ShaderLoader
// atomicGL2ShaderLoaderScriptInLine extends atomicGL2ShaderLoader
// atomicGL2ShaderLoaderScriptXML extends atomicGL2ShaderLoader
//----------------------------------------------------------------------------------------
class atomicGL2ShaderLoader{
	constructor(){
		this.vertexShaderSRC = "";
		this.fragmentShaderSRC = "" ;
	}
	getVertex(){return this.vertexShaderSRC;}
	getFragment(){return this.fragmentShaderSRC;}
}

class atomicGL2ShaderLoaderScriptInLine extends atomicGL2ShaderLoader {
	constructor(vertexShaderID,fragmentShaderID){
		super();
		this.vertexShaderSRC = this.getShaderSRC(vertexShaderID) ; 
		this.fragmentShaderSRC = this.getShaderSRC(fragmentShaderID) ; 
	}
	// getShaderSRC
	// -------------------------
	// get shader source 
	getShaderSRC(id) {
		var shader;
		var str = "";
        // shader source
		var shaderScript = document.getElementById(id);
        if (!shaderScript) {
			alert("Could not find shader source:"+id);
			return null;
		}
		else {
			var str = "";
			var k = shaderScript.firstChild;
			while (k) {
				if (k.nodeType == 3) {str += k.textContent;}
				k = k.nextSibling;
			}
		}
		// debug
		// ----------------------
		//console.log("atomicGL2::"+"atomicGL2ShaderLoaderScriptInLine::"+"getShaderSRC"+"shader source->"+ str);
		return str;
	}
}

class atomicGL2ShaderLoaderScriptXML extends atomicGL2ShaderLoader {
		constructor(xmlfile){
		super();
		this.vertexShaderSRC = this.getShaderSRC(xmlfile,"vertex") ; 
		this.fragmentShaderSRC = this.getShaderSRC(xmlfile,"fragment") ; 
	}
	// getShaderSRC
	// -------------------------
	// get shader source 
	getShaderSRC(xmlfile,type) {
		// loadXMLfile
		var xmlhttp=new XMLHttpRequest();
		xmlhttp.open("GET",xmlfile,false);
		xmlhttp.send();
		var xmlDoc=xmlhttp.responseXML;
		var str = "" ;

		switch (type){
			case "vertex" : 
				var xvertex = xmlDoc.getElementsByTagName("VERTEX");
				str = xvertex[0].childNodes[0].data ;
			break ;
			case "fragment" :
				var xfragment = xmlDoc.getElementsByTagName("FRAGMENT");
				str = xfragment[0].childNodes[0].data ;
			break ;			
		}
		// debug
		// ----------------------
		//console.log("atomicGL2::"+"atomicGL2ShaderLoaderScriptXML::"+"getShaderSRC"+"shader source->"+ str);
		return str;
	}
}

class atomicGL2Shader{
	constructor(nname){this.name=nname;}
}

class  atomicGL2MatShader extends atomicGL2Shader{
	// constructor
	//------------------------
	// inputs:	nname: 		shader name - string
	//			 agl:				atomicGL context
	// 			shaderloader: 		shader loader
	//			nbTex: 				integer
	//									0: shader doesn't use texture
	//									1..: 	use texture aVertexTexCoord 	required in the shader
	//									uSampler0 | uSampler[nbTex-1]	required in the shader
	// 			nnbLight:			int - number of Lights in the shader
	//									uPointLightPosition0|1|2 required per light in the shader
	//									uPointLightColor0|1|2 required per light in the shader

	constructor(nname, agl,shaderloader,nnbTex,nnbLights){
		// attributes
		// -------------------------------------------------
		super(nname);
		// nbTex
		this.nbTex = nnbTex ;
		// nbLights
		this.nbLight = nnbLights ;
		// program shader
		this.program ;
		
		// attributes
		// --------------------------
			this.vertexPositionAttribute ;
			this.vertexNormalAttribute ;
			this.vertexColorAttribute ;
			this.texCoordAttribute ;
		// uniforms
		// --------------------------
			// uniform Matrices
			this.pMatrixUniform ;
			this.mvMatrixUniform ;
			this.nMatrixUniform ;
			// light
			this.ambientColorUniform ;
			this.pointLightLocationUniform = [] ;
			this.pointLightColorUniform = [] ;
			// texture -sampler
			this.samplerUniform = [] ;

	this.build(agl,shaderloader);		
	}
		
	// methods
	// --------------------------------------------------
	// createProgram
	//---------------------------
	// inputs:	agl: GL context
	// 			vstr: vertex shader  - string	
	// 			fstr: fragment shader - string
    createProgram(agl,vstr,fstr) {
		// debug
		//console.log("atomicGLShader::createProgram ("+fragmentShaderID+","+vertexShaderID+")");
		// creation des shaders
		// vertex
        var vertexShader = agl.gl.createShader(agl.gl.VERTEX_SHADER);
		// set source
        agl.gl.shaderSource(vertexShader, vstr);
		// shader compilation
        agl.gl.compileShader(vertexShader);
		// debug
		console.log("atomicGLShader2::createProgram -> compile result: "+agl.gl.getShaderParameter(vertexShader, agl.gl.COMPILE_STATUS));
		// check erreur de compilation
        if (!agl.gl.getShaderParameter(vertexShader, agl.gl.COMPILE_STATUS)) {
            alert(agl.gl.getShaderInfoLog(vertexShader));
            return null;
        }
		// fragment		
		var fragmentShader = agl.gl.createShader(agl.gl.FRAGMENT_SHADER);
		// set source
        agl.gl.shaderSource(fragmentShader, fstr);
		// shader compilation
        agl.gl.compileShader(fragmentShader);
		// debug
		console.log("atomicGLShader2::createProgram -> compile result: "+agl.gl.getShaderParameter(fragmentShader, agl.gl.COMPILE_STATUS));
		// check erreur de compilation
        if (!agl.gl.getShaderParameter(fragmentShader, agl.gl.COMPILE_STATUS)) {
            alert(agl.gl.getShaderInfoLog(fragmentShader));
            return null;
        }
		
		// creation program et link
        var program = agl.gl.createProgram();
        agl.gl.attachShader(program, vertexShader);
        agl.gl.attachShader(program, fragmentShader);
        agl.gl.linkProgram(program);

		// debug
		//console.log("atomicGLShader::createProgram-> link result: "+agl.gl.getProgramParameter(program, agl.gl.LINK_STATUS));
        if (!agl.gl.getProgramParameter(program, agl.gl.LINK_STATUS)) {
            alert("atomicGLShader::Could not initialise shaders");
        }

		// attributes
		//------------------------
		// aVertexPosition
		// aVertexNormal
		// aVertexColor
		// aVertexTexCoord
		
        this.vertexPositionAttribute = agl.gl.getAttribLocation(program, "aVertexPosition");
        agl.gl.enableVertexAttribArray(this.vertexPositionAttribute);

        this.vertexNormalAttribute = agl.gl.getAttribLocation(program, "aVertexNormal");
        agl.gl.enableVertexAttribArray(this.vertexNormalAttribute);

        this.vertexColorAttribute = agl.gl.getAttribLocation(program, "aVertexColor");
        agl.gl.enableVertexAttribArray(this.vertexColorAttribute);
		
		if(this.nbTex>0){
			this.texCoordAttribute = agl.gl.getAttribLocation(program, "aVertexTexCoord");
			agl.gl.enableVertexAttribArray(this.texCoordAttribute);
		}
		
		// uniforms
		//------------------------
		// uPMatrix: 	Projection matrix
		// uMVMatrix: 	ModelView matrix
		// uNMatrix:	Normal matrix
		//------------------------
		// debug
		//console.log("atomicGLShader::createProgram - uniforms ");
		// matrix
        this.pMatrixUniform = agl.gl.getUniformLocation(program, "uPMatrix");
        this.mvMatrixUniform = agl.gl.getUniformLocation(program, "uMVMatrix");
        this.nMatrixUniform = agl.gl.getUniformLocation(program, "uNMatrix");
		
		// lights
		// uAmbientColor
		// uPointLightingPosition0|1|2 required per light in the shader
		// uPointLightingColor0|1|2 required per light in the shader        
		
		this.ambientColorUniform = agl.gl.getUniformLocation(program, "uAmbientColor");
		
        for (var i = 0; i < this.nbLight; i++) { 
			// lights  	position 
			//			color
			//console.log("atomicGLShader::createProgram - getUniformLocation ->"+"uPointLightPosition"+i);
			//console.log("atomicGLShader::createProgram - getUniformLocation ->"+"uPointLightColor"+i);
			this.pointLightLocationUniform[i] = agl.gl.getUniformLocation(program, "uPointLightPosition"+i);
			this.pointLightColorUniform[i] = agl.gl.getUniformLocation(program, "uPointLightColor"+i);
		}
		
		// textures
		for (var i = 0; i < this.nbTex; i++) { 
			//console.log("atomicGLShader::createProgram - getUniformLocation ->"+"uSampler"+i);
			this.samplerUniform[i] = agl.gl.getUniformLocation(program, "uSampler"+i);
		}
		
        return program;
    }	
    
    // setUniforms
    //----------------------------------------
    // inputs: 	aGL: atomicGLContext
	// 			aMS: atomicGLMatrixStack
    setUniforms(aGL,aMS){
		// debug
		//console.log("atomicGLShader::setUniforms ");
    	// set this shader as active shader
    	aGL.gl.useProgram(this.program);
    	// matrix
    	//		Projection
    	// 		Model->view
    	//		Normal built from Model->view
    	aGL.gl.uniformMatrix4fv(this.pMatrixUniform, false, aMS.pMatrix);
        aGL.gl.uniformMatrix4fv(this.mvMatrixUniform, false, aMS.mvMatrix);

        var normalMatrix = mat3.create();
        mat4.toInverseMat3(aMS.mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        aGL.gl.uniformMatrix3fv(this.nMatrixUniform, false, normalMatrix);
        
        // Lights
        //		ambient
        aGL.gl.uniform3f(this.ambientColorUniform,aGL.ambientLightColor[0],aGL.ambientLightColor[1],aGL.ambientLightColor[2]);
		//		Omni
		for (var i=0; i < this.nbLight ; i++){
			// debug
			//console.log("-- atomicGLShader::setUniforms - Light number ("+i+")");
			//console.log("-- LightLocation @"+this.pointLightLocationUniform[i]+"::" +aGL.omniLightLocation[i*3+0] +","+ aGL.omniLightLocation[i*3+1]+","+ aGL.omniLightLocation[i*3+2] );
			//console.log("-- LightColor @"+this.pointLightColorUniform[i]+"::" +aGL.omniLightColor[i*3+0] +","+ aGL.omniLightColor[i*3+1]+","+ aGL.omniLightColor[i*3+2] );
			
			aGL.gl.uniform3f(this.pointLightLocationUniform[i], aGL.omniLightLocation[i*3+0], aGL.omniLightLocation[i*3+1], aGL.omniLightLocation[i*3+2]);
			aGL.gl.uniform3f(this.pointLightColorUniform[i],aGL.omniLightColor[i*3+0],aGL.omniLightColor[i*3+1],aGL.omniLightColor[i*3+2]);
		}
		
		// textures
    }
	
	// build
	//-----------------------------
	build(agl,shaderloader){ this.program = this.createProgram(agl,shaderloader.getVertex(), shaderloader.getFragment()) ;}
}