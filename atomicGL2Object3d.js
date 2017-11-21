// atomicGL
//----------------------------------------------------------------------------------------
// author: RC				
// contact: cozot@irisa.fr
// version: 2.1
// current version date: 2016/01/29
//----------------------------------------------------------------------------------------
// atomicGLObject3d
//----------------------------------------------------------------------------------------

class atomicGLObject3d{
	// constructor
	//------------------------
	// inputs:	nname: 	name of the 3D Obj - string
	constructor(nname){
		// name
		this.name = nname ;
		
		// textures
		this.scaleUV = [] ;
		this.textures = [] ;
	
		// vertices array
		this.verticesArray 	= [] ;
	
		// normals array
		this.normalsArray  = [] ;
	
		// color array
    	this.colorsArray = [];
    	
		// texture coordinates array
    	this.textureCoordsArray = [] ;
	
		// indexes
    	this.vertexIndices = [] ;	
    
    	// OGL buffers
 		// buffers
		this.vertexPositionBuffer	;
    	this.vertexNormalBuffer		;
    	this.vertexColorBuffer		;
    	this.vertexTexCoordBuffer 	;
    	this.vertexIndexBuffer 		;
	
		this.vertexPositionBufferItemSize	;
    	this.vertexNormalBufferItemSize		;
    	this.vertexColorBufferItemSize		;
    	this.vertexTexCoordBufferItemSize 	;
    	this.vertexIndexBufferItemSize 		;
	
		this.vertexPositionBufferNumItems	;
    	this.vertexNormalBufferNumItems		;
    	this.vertexColorBufferNumItems		;
    	this.vertexTexCoordBufferNumItems 	;
    	this.vertexIndexBufferNumItems 		;
       		
	}

	// methods
	// --------------------------------------------------

	// pushTexture
	// --------------------------
	// inputs:	 atomicTex: texture - atomicGL2Texture
	pushTexture(atomicTex){this.textures.push(atomicTex);}	
	
		
	// initGLBuffers
	//---------------------------
	// inputs:	agl: openGL context
	initGLBuffers(agl){
		// debug
		//console.log("atomicGLObject3d("+this.name+")::initGLBuffers");
		var gl = agl.gl ;
		// vertexPositionBuffer
		this.vertexPositionBuffer	= gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesArray), gl.STATIC_DRAW);
        this.vertexPositionBufferItemSize = 3;
        this.vertexPositionBufferNumItems = this.verticesArray.length/3;

		// vertexNormalBuffer		
		this.vertexNormalBuffer		= gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalsArray), gl.STATIC_DRAW);
        this.vertexNormalBufferItemSize = 3;
        this.vertexNormalBufferNumItems = this.normalsArray.length/3;

		// vertexColorBuffer		
		this.vertexColorBuffer		= gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colorsArray), gl.STATIC_DRAW);
        this.vertexColorBufferItemSize = 3;
        this.vertexColorBufferNumItems = this.normalsArray.length/3;

		
		// vertexTexCoordBuffer		
		this.vertexTexCoordBuffer 	= gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordsArray), gl.STATIC_DRAW);
        this.vertexTexCoordBufferItemSize = 2;
        this.vertexTexCoordBufferNumItems = this.textureCoordsArray.length/2;
		
		// vertexIndexBuffer	
		this.vertexIndexBuffer 		= gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertexIndices), gl.STATIC_DRAW);
        this.vertexIndexBufferItemSize = 1;
        this.vertexIndexBufferNumItems = this.vertexIndices.length ;
	}
	
	
	// draw(aGL,aMS,idProg)
	//---------------------------
	// inputs: 	aGL: GL context 		- atomicGLContext
	// 			aMS: Matrix Stacks 	- atomicMatrixStack
	// 			idProg: Shader index - integer
	draw(aGL,aMS,idProg){
		// debug
		// console.log("atomicGLObject3d("+this.name+")::draw(progId: "+idProg+")");

		// activate shader
		aGL.gl.useProgram(aGL.shaderPrograms[idProg].program);
		// setUniforms: matrices and lights
		aGL.shaderPrograms[idProg].setUniforms(aGL,aMS);
		
		// link buffer to attributes
		//positions
		aGL.gl.bindBuffer(aGL.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        aGL.gl.vertexAttribPointer(aGL.shaderPrograms[idProg].vertexPositionAttribute, this.vertexPositionBufferItemSize, aGL.gl.FLOAT, false, 0, 0);
		//normals
        aGL.gl.bindBuffer(aGL.gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        aGL.gl.vertexAttribPointer(aGL.shaderPrograms[idProg].vertexNormalAttribute, this.vertexNormalBufferItemSize, aGL.gl.FLOAT, false, 0, 0);
		// colors
        aGL.gl.bindBuffer(aGL.gl.ARRAY_BUFFER, this.vertexColorBuffer);
        aGL.gl.vertexAttribPointer(aGL.shaderPrograms[idProg].vertexColorAttribute, this.vertexColorBufferItemSize, aGL.gl.FLOAT, false, 0, 0);
		// textures
		if(this.textures.length>0){
			// debug
			// console.log("atomicGLObject3d("+this.name+")::vertexAttribPointer: "+aGL.shaderPrograms[idProg].texCoordAttribute);
			aGL.gl.bindBuffer(aGL.gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
			aGL.gl.vertexAttribPointer(aGL.shaderPrograms[idProg].texCoordAttribute, this.vertexTexCoordBufferItemSize, aGL.gl.FLOAT, false, 0, 0);		
		}
		for (var i=0; i<this.textures.length; i++ ){
			// activate texture
			// debug
			// console.log("atomicGLObject3d("+this.name+")::activateTexture: "+agl.GLtexture[i]+"/"+agl.gl.TEXTURE0);
			agl.gl.activeTexture(agl.GLtexture[i]);
			// debug
			// console.log("atomicGLObject3d("+this.name+")::bindTexture: "+this.textures[i].texture);
			agl.gl.bindTexture(aGL.gl.TEXTURE_2D, this.textures[i].texture);
			// debug
			// console.log("atomicGLObject3d("+this.name+")::uniform: "+aGL.shaderPrograms[idProg].samplerUniform[i]+"->"+i);			
			agl.gl.uniform1i(aGL.shaderPrograms[idProg].samplerUniform[i], i);

		}
		// indexes
        aGL.gl.bindBuffer(aGL.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
		
		// draw Object3D
        aGL.gl.drawElements(aGL.gl.TRIANGLES, this.vertexIndexBufferNumItems, aGL.gl.UNSIGNED_SHORT, 0);

	}
	
}

//----------------------------------------------------------------------------------------
// atomicGL2ObjMesh extends atomicGLObject3d
//----------------------------------------------------------------------------------------

class atomicGL2ObjMesh extends atomicGLObject3d {
	// constructor
	// 		obj  :	obj object
	// 		uu,vv:	text coord scale
	constructor(nname, obj, uu, vv){
		// debug
		// console.log("atomicGL2ObjMesh extends atomicGLObject3d::constructor ->"+name );
		super(nname);
		// textures
		this.scaleUV = [uu,vv] ;
		this.textures = [] ;
	
		// vertices array
		this.verticesArray 	= obj.vertices;
		// normals array
		this.normalsArray  = obj.normals ;
		// colors Array - set default color
		for (var i=0; i<this.normalsArray.length;i++){this.verticesArray.push(0.8) ;}
		// texture coordinates array
    	this.textureCoordsArray = obj.uv ;
		// apply scaling
		var uvs = this.textureCoordsArray.length / 2 ;
		for (var i=0; i<uvs; i++){
			this.textureCoordsArray[2*i] 	= uu*this.textureCoordsArray[2*i];
			this.textureCoordsArray[2*i+1] 	= vv*this.textureCoordsArray[2*i+1];
		}
		// indexes
    	this.vertexIndices = obj.index;	
    }
}

//----------------------------------------------------------------------------------------
// atomicGL2Cube  extends atomicGLObject3d
//----------------------------------------------------------------------------------------

class atomicGL2Cube extends atomicGLObject3d {
	// constructor
	//------------------------
	constructor(nname,hheight, wwidth,ddepth,uu,vv){
		// inputs:	gl: 	openGL context
		// 			nname: 	name of the cube - string
		// 			hheight:float
		// 			wwidth:	float
		// 			ddepth:	float
		//			uu: textures coordinate scale
		//			vv: textures coordinate scale
		super();

		// attributes
		// -------------------------------------------------
		// size
		this.height	= hheight ;
		this.width 	= wwidth ;
		this.depth 	= ddepth ;
	
		// textures
		this.scaleUV = [uu,vv] ;

	
		// vertices array
		this.verticesArray 	= [
        	// Front face
        	-this.width/2.0, 	0.0,  			+this.depth/2.0,		// 0
			+this.width/2.0,	0.0,  			+this.depth/2.0,		// 1
			+this.width/2.0,	this.height, 	+this.depth/2.0,		// 2
			-this.width/2.0, 	this.height,  	+this.depth/2.0,		// 3
			// Back face
			-this.width/2.0, 	0.0,  			-this.depth/2.0,		// 4
			+this.width/2.0,	0.0,  			-this.depth/2.0,		// 5
			+this.width/2.0,	this.height, 	-this.depth/2.0,		// 6
			-this.width/2.0, 	this.height,  	-this.depth/2.0,		// 7
			// Top face
			-this.width/2.0,  	this.height, 	+this.depth/2.0,		// 8
			+this.width/2.0,  	this.height,  	+this.depth/2.0,		// 9
			+this.width/2.0,  	this.height,  	-this.depth/2.0,		// 10
			-this.width/2.0,  	this.height, 	-this.depth/2.0,		// 11
			// Bottom face
			-this.width/2.0,  	0.0, 			+this.depth/2.0,		// 12
			+this.width/2.0,  	0.0,  			+this.depth/2.0,		// 13
			+this.width/2.0,  	0.0,  			-this.depth/2.0,		// 14
			-this.width/2.0,  	0.0, 			-this.depth/2.0,		// 15
			// Left face
			+this.width/2.0, 	0.0, 			+this.depth/2.0,		// 16
			+this.width/2.0,  	0.0, 			-this.depth/2.0,		// 17
			+this.width/2.0,  	this.height,  	-this.depth/2.0,		// 18
			+this.width/2.0, 	this.height,  	+this.depth/2.0,		// 19
			// Right face
			-this.width/2.0, 	0.0, 			-this.depth/2.0,		// 20
			-this.width/2.0, 	0.0,  			+this.depth/2.0,		// 21
			-this.width/2.0,  	this.height,  	+this.depth/2.0,		// 22
			-this.width/2.0,  	this.height, 	-this.depth/2.0			// 23
    	];
		// normals array
		this.normalsArray  = [
			// Front face
		 	0.0,  0.0,  1.0, 0.0,  0.0,  1.0, 0.0,  0.0,  1.0, 0.0,  0.0,  1.0,
			// Back face
		 	0.0,  0.0, -1.0, 0.0,  0.0, -1.0, 0.0,  0.0, -1.0, 0.0,  0.0, -1.0,
			// Top face
		 	0.0,  1.0,  0.0, 0.0,  1.0,  0.0, 0.0,  1.0,  0.0, 0.0,  1.0,  0.0,
			// Bottom face
		 	0.0, -1.0,  0.0, 0.0, -1.0,  0.0, 0.0, -1.0,  0.0, 0.0, -1.0,  0.0,
			// Left face
		 	1.0,  0.0,  0.0, 1.0,  0.0,  0.0, 1.0,  0.0,  0.0, 1.0,  0.0,  0.0,
			// Right face
			-1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0
    	];
		// texture coordinates array
    	this.textureCoordsArray = [
			// Front face
		 	uu*0.0, vv*0.0,		uu*1.0, vv*0.0,		uu*1.0, vv*1.0,		uu*0.0, vv*1.0,
			// Back face
		 	uu*0.0, vv*0.0,		uu*1.0, vv*0.0,		uu*1.0, vv*1.0,		uu*0.0, vv*1.0,
			// Top face 
		 	uu*0.0, vv*0.0,		uu*1.0, vv*0.0,		uu*1.0, vv*1.0,		uu*0.0, vv*1.0,
			// Bottom face : floor
		 	uu*0.0, vv*0.0,		uu*1.0, vv*0.0,		uu*1.0, vv*1.0,		uu*0.0, vv*1.0,
			// Left face
		 	uu*0.0, vv*0.0,		uu*1.0, vv*0.0,		uu*1.0, vv*1.0,		uu*0.0, vv*1.0,		
			// Right face
		 	uu*0.0, vv*0.0,		uu*1.0, vv*0.0,		uu*1.0, vv*1.0,		uu*0.0, vv*1.0
		];
		// color array
    	this.colorsArray = [
			// Front face
		 	0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8,
			// Back face
		 	0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8,
			// Top face 
		  	0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8,
			// Bottom face : floor
		  	0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8,
	   		// Left face
		 	0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8,
			// Right face
		  	0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8
		];
		// indexes
    	this.cubeVertexIndices = [
			0, 1, 2,      0, 2, 3,    // Front face
			4, 5, 6,      4, 6, 7,    // Back face
			8, 9, 10,     8, 10, 11,  // Top face
			12, 13, 14,   12, 14, 15, // Bottom face
			16, 17, 18,   16, 18, 19, // Right face
			20, 21, 22,   20, 22, 23  // Left face
		];		

	}	
	// methods
	// --------------------------------------------------

	
	// setFaceColor(face, RGB)
	//---------------------------
	setFaceColor( face, RGB) {
		// inputs:	face: 	"Front" | "Back" | "Top" | "Bottom" |"Left"| "Right"| "All" (String)
		// 			RBG: 	[float, float, float]
		// debug
		//console.log("atomicGLCube("+this.name+")::setFaceColor");
		var r = RGB[0];
		var g = RGB[1];
		var b = RGB[2];
		
		// switch face
		switch(face){
			case "Front":
				this.colorsArray[0] =r;
				this.colorsArray[1] =g;
				this.colorsArray[2] =b;
			
				this.colorsArray[3] =r;
				this.colorsArray[4] =g;
				this.colorsArray[5] =b;
			
				this.colorsArray[6] =r;
				this.colorsArray[7] =g;
				this.colorsArray[8] =b;
			
				this.colorsArray[9]  =r;
				this.colorsArray[10] =g;
				this.colorsArray[11] =b;			
			break;

			case "Back":
				this.colorsArray[12+0] =r;
				this.colorsArray[12+1] =g;
				this.colorsArray[12+2] =b;
			
				this.colorsArray[12+3] =r;
				this.colorsArray[12+4] =g;
				this.colorsArray[12+5] =b;
			
				this.colorsArray[12+6] =r;
				this.colorsArray[12+7] =g;
				this.colorsArray[12+8] =b;
			
				this.colorsArray[12+9]  =r;
				this.colorsArray[12+10] =g;
				this.colorsArray[12+11] =b;
			break;			
			case "Top":
				this.colorsArray[24+0] =r;
				this.colorsArray[24+1] =g;
				this.colorsArray[24+2] =b;
			
				this.colorsArray[24+3] =r;
				this.colorsArray[24+4] =g;
				this.colorsArray[24+5] =b;
			
				this.colorsArray[24+6] =r;
				this.colorsArray[24+7] =g;
				this.colorsArray[24+8] =b;
			
				this.colorsArray[24+9]  =r;
				this.colorsArray[24+10] =g;
				this.colorsArray[24+11] =b;
			break;			
			case "Bottom":
				this.colorsArray[36+0] =r;
				this.colorsArray[36+1] =g;
				this.colorsArray[36+2] =b;
			
				this.colorsArray[36+3] =r;
				this.colorsArray[36+4] =g;
				this.colorsArray[36+5] =b;
			
				this.colorsArray[36+6] =r;
				this.colorsArray[36+7] =g;
				this.colorsArray[36+8] =b;
			
				this.colorsArray[36+9]  =r;
				this.colorsArray[36+10] =g;
				this.colorsArray[36+11] =b;
			break;			
			case "Left":
				this.colorsArray[48+0] =r;
				this.colorsArray[48+1] =g;
				this.colorsArray[48+2] =b;
			
				this.colorsArray[48+3] =r;
				this.colorsArray[48+4] =g;
				this.colorsArray[48+5] =b;
			
				this.colorsArray[48+6] =r;
				this.colorsArray[48+7] =g;
				this.colorsArray[48+8] =b;
			
				this.colorsArray[48+9]  =r;
				this.colorsArray[48+10] =g;
				this.colorsArray[48+11] =b;
			break;				
			case "Right":
				this.colorsArray[60+0] =r;
				this.colorsArray[60+1] =g;
				this.colorsArray[60+2] =b;
			
				this.colorsArray[60+3] =r;
				this.colorsArray[60+4] =g;
				this.colorsArray[60+5] =b;
			
				this.colorsArray[60+6] =r;
				this.colorsArray[60+7] =g;
				this.colorsArray[60+8] =b;
			
				this.colorsArray[60+9]  =r;
				this.colorsArray[60+10] =g;
				this.colorsArray[60+11] =b;
			break;	
			case "All":
				this.colorsArray = [
					// Front face
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
					// Back face
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
					// Top face 
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
					// Bottom face : floor
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
					// Left face
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
					// Right face
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
				];	
			break;		
		}
	}
		
}

//----------------------------------------------------------------------------------------
// atomicGL2SkyBox  extends atomicGLObject3d
//----------------------------------------------------------------------------------------
class atomicGL2SkyBox  extends atomicGLObject3d {
	constructor(nname,ssize){
		super(nname);
		
		// size
		this.size = ssize ;
		
		// textures
		this.textures = [] ;
		
		// vertices array
		this.verticesArray 	= [
			// Front face
			+this.size/2.0, 	-this.size/2.0,  	+this.size/2.0,		// 0
			-this.size/2.0,		-this.size/2.0,  	+this.size/2.0,		// 1
			-this.size/2.0,		this.size/2.0, 		+this.size/2.0,		// 2
			+this.size/2.0, 	this.size/2.0,  	+this.size/2.0,		// 3
			// Back face
			-this.size/2.0, 	-this.size/2.0,  	-this.size/2.0,		// 4
			+this.size/2.0,		-this.size/2.0,  	-this.size/2.0,		// 5
			+this.size/2.0,		this.size/2.0, 		-this.size/2.0,		// 6
			-this.size/2.0, 	this.size/2.0,  	-this.size/2.0,		// 7
			// Top face
			-this.size/2.0,  	this.size/2.0, 		-this.size/2.0,		// 8
			+this.size/2.0,  	this.size/2.0,  	-this.size/2.0,		// 9
			+this.size/2.0,  	this.size/2.0,  	+this.size/2.0,		// 10
			-this.size/2.0,  	this.size/2.0, 		+this.size/2.0,		// 11
			// Bottom face
			-this.size/2.0,  	-this.size/2.0, 	+this.size/2.0,		// 12
			+this.size/2.0,  	-this.size/2.0,  	+this.size/2.0,		// 13
			+this.size/2.0,  	-this.size/2.0,  	-this.size/2.0,		// 14
			-this.size/2.0,  	-this.size/2.0, 	-this.size/2.0,		// 15
			// Left face
			-this.size/2.0, 	-this.size/2.0, 	+this.size/2.0,		// 16
			-this.size/2.0,  	-this.size/2.0, 	-this.size/2.0,		// 17
			-this.size/2.0,  	this.size/2.0,  	-this.size/2.0,		// 18
			-this.size/2.0, 	this.size/2.0,  	+this.size/2.0,		// 19
			// Right face
			+this.size/2.0, 	-this.size/2.0, 	-this.size/2.0,		// 20
			+this.size/2.0, 	-this.size/2.0,  	+this.size/2.0,		// 21
			+this.size/2.0,  	this.size/2.0,  	+this.size/2.0,		// 22
			+this.size/2.0,  	this.size/2.0, 		-this.size/2.0		// 23
		];
		// normals array
		this.normalsArray  = [
			// Front face
			 0.0,  0.0,  -1.0, 0.0,  0.0,  -1.0, 0.0,  0.0,  -1.0, 0.0,  0.0,  -1.0,
			// Back face
			 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0,
			// Top face
			 0.0,  -1.0,  0.0, 0.0,  -1.0,  0.0, 0.0,  -1.0,  0.0, 0.0,  -1.0,  0.0,
			// Bottom face
			 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0,
			// Left face
			1.0,  0.0,  0.0, 1.0,  0.0,  0.0, 1.0,  0.0,  0.0, 1.0,  0.0,  0.0,
			// Right face
			 -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0   ];
		// texture coordinates array
		this.textureCoordsArray = [
			// Front face
			0.75, 0.333,		1.0, 0.333,			1.0, 0.666,			0.75, 0.666,
			// Back face
			 0.25, 0.333,		0.50, 0.333,		0.50, 0.666,		0.25, 0.666,
			// Top face 
			 0.25, 0.666,		0.50, 0.666,		0.50, 1.0,			0.25, 1.0,
			// Bottom face : floor
			 0.25, 0.0,			0.50, 0.0,			0.50, 0.333,		0.25, 0.333,
			// Left face
			 0.0, 0.333,		0.25, 0.333,		0.25, 0.666,		0.0, 0.666,		
			// Right face
			 0.50, 0.333,		0.75, 0.333,		0.75, 0.666,		0.50, 0.666
		];
		// color array
		this.colorsArray = [
			// Front face
			 0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8,
			// Back face
			 0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8,
			// Top face 
			  0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8,
			// Bottom face : floor
			  0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8,
		   // Left face
			 0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8,
			// Right face
			  0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8
		];
		// indexes
		this.vertexIndices = [
			0, 1, 2,      0, 2, 3,    // Front face
			4, 5, 6,      4, 6, 7,    // Back face
			8, 9, 10,     8, 10, 11,  // Top face
			12, 13, 14,   12, 14, 15, // Bottom face
			16, 17, 18,   16, 18, 19, // Right face
			20, 21, 22,   20, 22, 23  // Left face
		];	
	}	
	
	// setFaceColor(face, RGB)
	setFaceColor( face, RGB) {
		// face: 	"Front" | "Back" | "Top" | "Bottom" |"Left"| "Right"| "All" (String)
		// RBG: 	[float, float, float]
		//---------------------------
		// debug
		//console.log("atomicGLskyBox("+this.name+")::setFaceColor");
		var r = RGB[0];
		var g = RGB[1];
		var b = RGB[2];
		
		// switch face
		switch(face){
			case "Front":
				this.colorsArray[0] =r;
				this.colorsArray[1] =g;
				this.colorsArray[2] =b;
			
				this.colorsArray[3] =r;
				this.colorsArray[4] =g;
				this.colorsArray[5] =b;
			
				this.colorsArray[6] =r;
				this.colorsArray[7] =g;
				this.colorsArray[8] =b;
			
				this.colorsArray[9]  =r;
				this.colorsArray[10] =g;
				this.colorsArray[11] =b;			
			break;

			case "Back":
				this.colorsArray[12+0] =r;
				this.colorsArray[12+1] =g;
				this.colorsArray[12+2] =b;
			
				this.colorsArray[12+3] =r;
				this.colorsArray[12+4] =g;
				this.colorsArray[12+5] =b;
			
				this.colorsArray[12+6] =r;
				this.colorsArray[12+7] =g;
				this.colorsArray[12+8] =b;
			
				this.colorsArray[12+9]  =r;
				this.colorsArray[12+10] =g;
				this.colorsArray[12+11] =b;
			break;			
			case "Top":
				this.colorsArray[24+0] =r;
				this.colorsArray[24+1] =g;
				this.colorsArray[24+2] =b;
			
				this.colorsArray[24+3] =r;
				this.colorsArray[24+4] =g;
				this.colorsArray[24+5] =b;
			
				this.colorsArray[24+6] =r;
				this.colorsArray[24+7] =g;
				this.colorsArray[24+8] =b;
			
				this.colorsArray[24+9]  =r;
				this.colorsArray[24+10] =g;
				this.colorsArray[24+11] =b;
			break;			
			case "Bottom":
				this.colorsArray[36+0] =r;
				this.colorsArray[36+1] =g;
				this.colorsArray[36+2] =b;
			
				this.colorsArray[36+3] =r;
				this.colorsArray[36+4] =g;
				this.colorsArray[36+5] =b;
			
				this.colorsArray[36+6] =r;
				this.colorsArray[36+7] =g;
				this.colorsArray[36+8] =b;
			
				this.colorsArray[36+9]  =r;
				this.colorsArray[36+10] =g;
				this.colorsArray[36+11] =b;
			break;			
			case "Left":
				this.colorsArray[48+0] =r;
				this.colorsArray[48+1] =g;
				this.colorsArray[48+2] =b;
			
				this.colorsArray[48+3] =r;
				this.colorsArray[48+4] =g;
				this.colorsArray[48+5] =b;
			
				this.colorsArray[48+6] =r;
				this.colorsArray[48+7] =g;
				this.colorsArray[48+8] =b;
			
				this.colorsArray[48+9]  =r;
				this.colorsArray[48+10] =g;
				this.colorsArray[48+11] =b;
			break;				
			case "Right":
				this.colorsArray[60+0] =r;
				this.colorsArray[60+1] =g;
				this.colorsArray[60+2] =b;
			
				this.colorsArray[60+3] =r;
				this.colorsArray[60+4] =g;
				this.colorsArray[60+5] =b;
			
				this.colorsArray[60+6] =r;
				this.colorsArray[60+7] =g;
				this.colorsArray[60+8] =b;
			
				this.colorsArray[60+9]  =r;
				this.colorsArray[60+10] =g;
				this.colorsArray[60+11] =b;
			break;	
			case "All":
				this.colorsArray = [
					// Front face
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
					// Back face
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
					// Top face 
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
					// Bottom face : floor
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
					// Left face
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
					// Right face
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
				];	
			break;		
		}
	};
}

//----------------------------------------------------------------------------------------
// atomicGL2Sphere  extends atomicGLObject3d
//----------------------------------------------------------------------------------------

class atomicGL2Sphere extends atomicGLObject3d{

	// constructor
	//------------------------
	constructor(nname,rradius, llatitudeBands,llongitudeBands,uu,vv){
		// inputs
		//------------------------
		// nname: 		name of the Sphere - string
		// sphere size
		// rthis.radius:			float
		// lthis.latitudeBands: init
		// lthis.longitudeBands: int
		// debug
		// console.log("atomicGL2Sphere extends atomicGLObject3d::constructor ->"+name );
		super(nname)
		
		// size
		this.radius	= rradius ;
		this.latitudeBands 	= llatitudeBands ;
		this.longitudeBands	= llongitudeBands ;	

		// textures
		this.scaleUV = [uu,vv] ;

	    // build the vertices
	    this.build();
	}
	
	// methods
	// --------------------------------------------------

	// setFaceColor(face, RGB)
	//---------------------------
	setFaceColor( face, RGB) {
		// inputs
		//---------------------------
		// face: 	"All" (String)
		// RBG: 	[float, float, float]
		//---------------------------
		// debug
		//console.log("atomicGLSphere("+this.name+")::setFaceColor");
		var r = RGB[0];
		var g = RGB[1];
		var b = RGB[2];
		
		// switch face
		switch(face){
			case "All":
				this.colorsArray = [] ;
				for (var latNumber=0; latNumber <= this.latitudeBands; latNumber++) {
            		for (var longNumber = 0; longNumber <= this.longitudeBands; longNumber++) {
                		// color
                		this.colorsArray.push(r);
                		this.colorsArray.push(g);
                		this.colorsArray.push(b);            
            		}
        		}
			break;		
		}
	}

	// build
	//-----------------------------	
	build(){

		// vertices, normals, colors, texCoord
		for (var latNumber=0; latNumber <= this.latitudeBands; latNumber++) {
				var theta = latNumber * Math.PI / this.latitudeBands;
				var sinTheta = Math.sin(theta);
				var cosTheta = Math.cos(theta);

				for (var longNumber = 0; longNumber <= this.longitudeBands; longNumber++) {
					var phi = longNumber * 2 * Math.PI / this.longitudeBands;
					var sinPhi = Math.sin(phi);
					var cosPhi = Math.cos(phi);

					var x = cosPhi * sinTheta;
					var y = cosTheta;
					var z = sinPhi * sinTheta;
					// normals
					this.normalsArray.push(x);
					this.normalsArray.push(y);
					this.normalsArray.push(z);
					// position
					this.verticesArray.push(this.radius * x);
					this.verticesArray.push(this.radius * y);
					this.verticesArray.push(this.radius * z);
					// color
					this.colorsArray.push(0.8);
					this.colorsArray.push(0.8);
					this.colorsArray.push(0.8);
					// uv
					this.textureCoordsArray.push(this.scaleUV[0]*longNumber/this.longitudeBands);
					this.textureCoordsArray.push(this.scaleUV[1]*latNumber/this.latitudeBands);              
				}
			}

		// index 
		for (var latNumber = 0; latNumber < this.latitudeBands; latNumber++) {
				for (var longNumber = 0; longNumber < this.longitudeBands; longNumber++) {
					var first = (latNumber * (this.longitudeBands + 1)) + longNumber;
					var second = first + this.longitudeBands + 1;
					this.vertexIndices.push(first);
					this.vertexIndices.push(second);
					this.vertexIndices.push(first + 1);

					this.vertexIndices.push(second);
					this.vertexIndices.push(second + 1);
					this.vertexIndices.push(first + 1);
				}
			}
	
//		this.vertexPositionBufferItemSize 	= 3	;
//		this.vertexNormalBufferItemSize		= 3	;
//		this.vertexTexCoordBufferItemSize	= 2 ;
//		this.vertexColorBufferItemSize		= 3 ;
//		this.vertexIndexBufferItemSize 		= 1 ;
	
//		this.vertexPositionBufferNumItems	= this.verticesArray.length / 3 ;
//	   	this.vertexNormalBufferNumItems		= this.normalsArray.length / 3 ;
//		this.vertexTexCoordBufferNumItems 	= this.textureCoordsArray.length/2 ;
//		this.vertexColorBufferNumItems 		= this.colorsArray.length /3 ;
//	    this.vertexIndexBufferNumItems 		= this.vertexIndices.length; ;
	}
}

//----------------------------------------------------------------------------------------
// atomicGL2Cylinder  extends atomicGLObject3d
//----------------------------------------------------------------------------------------

class atomicGL2Cylinder extends atomicGLObject3d {
	// constructor
	//------------------------
	constructor(nname,rradius, hheight, hheightBands,llongitudeBands,uu,vv){
		// inputs:	nname: 		name of the Cylinder - string
		// 			cylinder size
		//			radius:			float
		// 			height:			float
		// 			lthis.heightBands: init
		// 			this.longitudeBands: int		super(nname);
	
		// size
		this.radius	= rradius ;
		this.height = hheight ;
		this.heightBands 	= hheightBands ;
		this.longitudeBands	= llongitudeBands ;
	
		// textures
		this.scaleUV = [uu,vv] ;
	
		// build
		this.build();
	}

	// methods
	// --------------------------------------------------
	
	// setFaceColor(face, RGB)
	//---------------------------
	// inputs:  face: 	"All" (String)
	//			 RBG: 	[float, float, float]
	setFaceColor( face, RGB) {
		// debug
		//console.log("atomicGL2Cylinder("+this.name+")::setFaceColor");
		var r = RGB[0];
		var g = RGB[1];
		var b = RGB[2];
		
		// switch face
		switch(face){
			case "All":
				var nbc = this.colorsArray.length / 3 ;
				this.colorsArray = [] ;
				for (var i=0; i <nbc; i++) {
                	this.colorsArray.push(r);
                	this.colorsArray.push(g);
                	this.colorsArray.push(b);            
            	}
			break;		
		}
	}
	
	// build
	//-----------------------------------------------------
	build(){
		// vertices, normals, colors, texCoord
		for (var i=0; i <= this.heightBands; i++) {
			var y = i*this.height/this.heightBands ;
	
        	for (var j = 0; j <= this.longitudeBands; j++) {
            
            	var theta = j * 2.0* Math.PI / this.longitudeBands;
            	var x = Math.cos(theta);
            	var y = i*this.height/this.heightBands;
				var z = Math.sin(theta);
            
				// normals
            	this.normalsArray.push(x);
            	this.normalsArray.push(0.0);
            	this.normalsArray.push(z);
				// position
            	this.verticesArray.push(this.radius * x);
            	this.verticesArray.push(y);
            	this.verticesArray.push(this.radius * z);
            	// color
            	this.colorsArray.push(0.8);
            	this.colorsArray.push(0.8);
            	this.colorsArray.push(0.8);
            	// uv
            	this.textureCoordsArray.push(this.scaleUV[1]*i/this.heightBands);              
            	this.textureCoordsArray.push(this.scaleUV[0]*j/this.longitudeBands);
    		}
    	}
    
    	// cylinder cap
    	// ------------
	    // bottom
   	 	// ------
   	 	// center
		// texture coord
		this.textureCoordsArray.push(0.5); this.textureCoordsArray.push(0.5);
		// color
    	this.colorsArray.push(0.8);this.colorsArray.push(0.8);this.colorsArray.push(0.8);
    	// normals
		this.normalsArray.push(0.0);this.normalsArray.push(-1.0);this.normalsArray.push(0.0);
		// position
    	this.verticesArray.push(0.0);this.verticesArray.push(0.0);this.verticesArray.push(0.0);
		var bottomcenterIndex = this.verticesArray.length/3 ;

    	// cap edge
    	for (var j = 0; j <= this.longitudeBands; j++) { 
            var theta = j * 2.0* Math.PI / this.longitudeBands;
            var x = Math.cos(theta);
            var y = 0.0
			var z = Math.sin(theta);
            
			// normals
            this.normalsArray.push(0.0); this.normalsArray.push(-1.0); this.normalsArray.push(0.0);
			// position
            this.verticesArray.push(this.radius * x);
            this.verticesArray.push(0.0);
            this.verticesArray.push(this.radius * z);
            // color
            this.colorsArray.push(0.8); this.colorsArray.push(0.8); this.colorsArray.push(0.8);
            // uv
            this.textureCoordsArray.push(0.5+x*.5);              
            this.textureCoordsArray.push(0.5+z*0.5);    
    	}   
    	// top cap
    	// -------
    	// center
		// texture coord
		this.textureCoordsArray.push(0.5); this.textureCoordsArray.push(0.5);
    	// normals
		this.normalsArray.push(0.0);this.normalsArray.push(1.0);this.normalsArray.push(0.0);
		// position
    	this.verticesArray.push(0.0);this.verticesArray.push(this.height);this.verticesArray.push(0.0);
    	var topcenterIndex = this.verticesArray.length/3 ;
    	// color
    	this.colorsArray.push(0.8);
    	this.colorsArray.push(0.8);
    	this.colorsArray.push(0.8);
    	// cap edge
    	for (var j = 0; j <= this.longitudeBands; j++) { 
            var theta = j * 2.0* Math.PI / this.longitudeBands;
            var x = Math.cos(theta);
            var y = this.height ;
			var z = Math.sin(theta);
            
			// normals
            this.normalsArray.push(0.0); this.normalsArray.push(1.0); this.normalsArray.push(0.0);
			// position
            this.verticesArray.push(this.radius * x);
            this.verticesArray.push(this.height);
            this.verticesArray.push(this.radius * z);
            // color
            this.colorsArray.push(0.8); this.colorsArray.push(0.8); this.colorsArray.push(0.8);
            // uv
            this.textureCoordsArray.push(0.5+x*0.5);              
            this.textureCoordsArray.push(0.5+z*0.5);  
    	}   

		// indexes
		// --------
		// body index 
		for (var i=0; i < this.heightBands; i++) {
        	for (var j = 0; j < this.longitudeBands; j++) {
                	var t0 = i*(this.longitudeBands+1) 	+ j ;
                	var t1 = i*(this.longitudeBands+1) 	+ j+1 ;
                	var t2 = (i+1)*(this.longitudeBands+1) + j ;
                	var t3 = (i+1)*(this.longitudeBands+1) + j+1 ;
                	// first triangle
                	this.vertexIndices.push(t0);
                	this.vertexIndices.push(t1);
                	this.vertexIndices.push(t2);                
                
       	         	// second triangle
        	        this.vertexIndices.push(t2);
           	    	this.vertexIndices.push(t1);
            	    this.vertexIndices.push(t3);  
        	}
    	}
		// bottom cap index
		for (var j = 0; j < this.longitudeBands; j++) {
        	this.vertexIndices.push(bottomcenterIndex);
        	this.vertexIndices.push(bottomcenterIndex +j);
        	this.vertexIndices.push(bottomcenterIndex +j +1);  
    	}
		// top cap index
		for (var j = 0; j < this.longitudeBands; j++) {
        	this.vertexIndices.push(topcenterIndex);
        	this.vertexIndices.push(topcenterIndex +j);
        	this.vertexIndices.push(topcenterIndex +j +1);  
    	}	
	
		// buffer item size and num items
		this.vertexPositionBufferItemSize 	= 3	;
  		this.vertexNormalBufferItemSize		= 3	;
   		this.vertexTexCoordBufferItemSize	= 2 ;
   		this.vertexColorBufferItemSize		= 3 ;
   		this.vertexIndexBufferItemSize 		= 1 ;
	
		this.vertexPositionBufferNumItems	= this.verticesArray.length / 3 ;
    	this.vertexNormalBufferNumItems		= this.normalsArray.length / 3 ;
		this.vertexTexCoordBufferNumItems 	= this.textureCoordsArray.length/2 ;
		this.vertexColorBufferNumItems 		= this.colorsArray.length /3 ;
    	this.vertexIndexBufferNumItems 		= this.vertexIndices.length; ;
	}

}

//----------------------------------------------------------------------------------------
// atomicGL2xyPlane  extends atomicGLObject3d
//----------------------------------------------------------------------------------------

class atomicGL2xyPlane extends atomicGLObject3d {
	// constructor
	constructor(nname,hheight, wwidth,xxrow,yyrow,uu,vv){
		//------------------------
		// nname: 		name of the xyPlane - string
		// plane size
		// hheight:		float
		// wwidth:		float
		// xxrow:		int - number of rowdivision
		// yyrow:		int - number of rowdivision
		super(nname);

		// size
		this.height	= hheight ;
		this.width 	= wwidth ;
		this.xrow 	= xxrow ;
		this.yrow	= yyrow ;

	// textures
	this.scaleUV = [uu,vv] ;
	}
	
	// methods
	// --------------------------------------------------
	// setFaceColor(face, RGB)
	//---------------------------
	setFaceColor( face, RGB) {
		// debug
		//console.log("atomicGL2xyPlane("+this.name+")::setFaceColor");
		var r = RGB[0];
		var g = RGB[1];
		var b = RGB[2];
		
		// switch face
		switch(face){
			case "All":
				this.colorsArray = [] ;
				for(var j=0;j<= this.yrow;j++){
					for(var i=0;i<=this.xrow;i++){
						this.colorsArray.push(r);
						this.colorsArray.push(g);
						this.colorsArray.push(b);
					}
				}
			break;		
		}
	}
	
	// build
	//-----------------------------------------------------
	build(){
		// vertices, normals, colors
		for(var j=0;j<= this.yrow;j++){
			for(var i=0;i<=this.xrow;i++){
				// vertices
				var x = - 0.5*this.width + i*this.width/this.xrow;
				var y = j*this.height/this.yrow
				var z = 0.0;
				// normals
				var nx = 0.0 ;
				var ny = 0.0 ;
				var nz = 1.0 ;
				// color
				var r = 0.8 ;
				var g = 0.8 ;
				var b = 0.8 ;
				// texture coordinates
				var tu = this.scaleUV[0]*i/this.xrow ; 
				var tv = this.scaleUV[1]*j/this.yrow ;
				// push vertices, normals, colors and textures coordinates
				this.verticesArray.push(x) ;
				this.verticesArray.push(y) ;
				this.verticesArray.push(z) ;
				this.normalsArray.push(nx);
				this.normalsArray.push(ny);
				this.normalsArray.push(nz);
				this.textureCoordsArray.push(tu);
				this.textureCoordsArray.push(tv);
				this.colorsArray.push(r);
				this.colorsArray.push(g);
				this.colorsArray.push(b);	
			}
		}
		for(var jj=0;jj<this.yrow;jj++){
			for(var ii=0;ii<this.xrow;ii++){
				// triangles indexes
				// first
				this.vertexIndices.push(jj*(this.xrow+1)+ii);
				this.vertexIndices.push(jj*(this.xrow+1)+ii+1);
				this.vertexIndices.push((jj+1)*(this.xrow+1)+ii);
				// second
				this.vertexIndices.push((jj+1)*(this.xrow+1)+ii);
				this.vertexIndices.push(jj*(this.xrow+1)+ii+1);
				this.vertexIndices.push((jj+1)*(this.xrow+1)+ii+1);	
				// debug 	
			}
		}
	
		this.vertexPositionBufferItemSize 	= 3	;
		this.vertexNormalBufferItemSize		= 3	;
		this.vertexTexCoordBufferItemSize	= 2 ;
		this.vertexColorBufferItemSize		= 3 ;
		this.vertexIndexBufferItemSize 		= 1 ;
		
		this.vertexPositionBufferNumItems	= (this.xrow+1)*(this.yrow+1) ;
		this.vertexNormalBufferNumItems		= (this.xrow+1)*(this.yrow+1) ;
		this.vertexTexCoordBufferNumItems 	= (this.xrow+1)*(this.yrow+1) ;
		this.vertexColorBufferNumItems 		= (this.xrow+1)*(this.yrow+1) ;
		this.vertexIndexBufferNumItems 		= (this.xrow)*(this.yrow)*2*3 ;
	}
}

//----------------------------------------------------------------------------------------
// atomicGL2xzPlane  extends atomicGLObject3d
//----------------------------------------------------------------------------------------

class atomicGL2xzPlane extends atomicGLObject3d {
	// constructor
	constructor(nname,hheight, wwidth,xxrow,zzrow,uu,vv){
		// name
		super(nname) ;
		// size
		this.height	= hheight ;
		this.width 	= wwidth ;
		this.xrow 	= xxrow ;
		this.zrow	= zzrow ;
		
		// textures
		this.scaleUV = [uu,vv] ;
	}
	
	// methods
	// --------------------------------------------------
	// setFaceColor(face, RGB)
	//---------------------------
	setFaceColor( face, RGB) {
		// debug
		//console.log("atomicGL2xyPlane("+this.name+")::setFaceColor");
		var r = RGB[0];
		var g = RGB[1];
		var b = RGB[2];
		
		// switch face
		switch(face){
			case "All":
				this.colorsArray = [] ;
				for(var j=0;j<= this.yrow;j++){
					for(var i=0;i<=this.xrow;i++){
						this.colorsArray.push(r);
						this.colorsArray.push(g);
						this.colorsArray.push(b);
					}
				}
			break;		
		}
	}
	
	// build
	//-----------------------------------------------------
	build(){
		// vertices, normals, colors
		for(var j=0;j<= this.zrow;j++){
			for(var i=0;i<=this.xrow;i++){
				// vertices
				var x = - 0.5*this.width + i*this.width/this.xrow;
				var y = 0.0 ;
				var z = - 0.5*this.height + j*this.height/this.zrow;
				// normals
				var nx = 0.0 ;
				var ny = 1.0 ;
				var nz = 0.0 ;
				// color
				var r = 0.8 ;
				var g = 0.8 ;
				var b = 0.8 ;
				// texture coordinates
				var tu = this.scaleUV[0]*i/this.xrow ; 
				var tv = this.scaleUV[1]*j/this.zrow ;
				// push vertices, normals, colors and textures coordinates
				this.verticesArray.push(x) ;
				this.verticesArray.push(y) ;
				this.verticesArray.push(z) ;
				this.normalsArray.push(nx);
				this.normalsArray.push(ny);
				this.normalsArray.push(nz);
				this.textureCoordsArray.push(tu);
				this.textureCoordsArray.push(tv);
				this.colorsArray.push(r);
				this.colorsArray.push(g);
				this.colorsArray.push(b);	
			}
		}
		for(var jj=0;jj<this.zrow;jj++){
			for(var ii=0;ii<this.xrow;ii++){
				// triangles indexes
				// first
				this.vertexIndices.push(jj*(this.xrow+1)+ii);
				this.vertexIndices.push(jj*(this.xrow+1)+ii+1);
				this.vertexIndices.push((jj+1)*(this.xrow+1)+ii);
				// second
				this.vertexIndices.push((jj+1)*(this.xrow+1)+ii);
				this.vertexIndices.push(jj*(this.xrow+1)+ii+1);
				this.vertexIndices.push((jj+1)*(this.xrow+1)+ii+1);		
			}
		}

		
		this.vertexPositionBufferItemSize 	= 3	;
		this.vertexNormalBufferItemSize		= 3	;
		this.vertexTexCoordBufferItemSize	= 2 ;
		this.vertexColorBufferItemSize		= 3 ;
		this.vertexIndexBufferItemSize 		= 1 ;
		
		this.vertexPositionBufferNumItems	= (this.xrow+1)*(this.zrow+1) ;
		this.vertexNormalBufferNumItems		= (this.xrow+1)*(this.zrow+1) ;
		this.vertexTexCoordBufferNumItems 	= (this.xrow+1)*(this.zrow+1) ;
		this.vertexColorBufferNumItems 		= (this.xrow+1)*(this.zrow+1) ;
		this.vertexIndexBufferNumItems 		= (this.xrow)*(this.zrow)*2*3 ;
	}
}

//----------------------------------------------------------------------------------------
// atomicGL2xzPlane  extends atomicGLObject3d
//----------------------------------------------------------------------------------------


