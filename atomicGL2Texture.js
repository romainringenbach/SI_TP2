// atomicGL
//----------------------------------------------------------------------------------------
// author: RC				
// contact: cozot@irisa.fr
// version: 0.1
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGL2Texture
//----------------------------------------------------------------------------------------
// TODO list
//----------------------------------------------------------------------------------------

class atomicGL2Texture{

// constructor
//------------------------
// inputs
//------------------------
// ffile: 		texture filename - string
// ttype:		texture type : color | normal | displacement | specular | opacity - string
// aagl:		atomicGL context


	constructor(iid,ffile, ttype, aagl){
		// debug
		//console.log("atomicGLTexture::constructor("+ffile+")");
		// attributes
		// -------------------------------------------------
		// local context
		this.agl = aagl ;
		// texture id
		this.id = iid ;
		// file name
		this.file = ffile ;
		// texture type
		this.type = ttype ;
		// texture image
		this.textureImage = new Image();
		// ogl texture
    	this.texture = aagl.gl.createTexture();
    	this.texture.image =   this.textureImage ;
    	
    	// build
    	this.build(); 
	}
	// --------------------------------------------------
	// methods
	// --------------------------------------------------
	// handleIMG(o)
	//---------------------------
	// inputs
	//---------------------------
	// o: 	this - atomicGLtexture
	//---------------------------
	handleIMG(){
		var o = this ;
		// debug
		//console.log("atomicGLTexture::onload("+o.file+")");
		
        o.agl.gl.pixelStorei(o.agl.gl.UNPACK_FLIP_Y_WEBGL, true);
		// bindTexture
        o.agl.gl.bindTexture(o.agl.gl.TEXTURE_2D, o.texture);
        o.agl.gl.texImage2D(o.agl.gl.TEXTURE_2D, 0, o.agl.gl.RGBA, o.agl.gl.RGBA, o.agl.gl.UNSIGNED_BYTE, o.texture.image);
        // parameters
		o.agl.gl.texParameteri(o.agl.gl.TEXTURE_2D, o.agl.gl.TEXTURE_MAG_FILTER, o.agl.gl.LINEAR);
        o.agl.gl.texParameteri(o.agl.gl.TEXTURE_2D, o.agl.gl.TEXTURE_MIN_FILTER, o.agl.gl.LINEAR_MIPMAP_NEAREST);
        o.agl.gl.generateMipmap(o.agl.gl.TEXTURE_2D);
		// unbind
        o.agl.gl.bindTexture(agl.gl.TEXTURE_2D, null);	
		// loaded !
		o.loaded = true ;
	}
	// --------------------------------------------------
	// build
	// --------------------------------------------------
	// handle image load
	build(){
	this.textureImage.onload = this.handleIMG.bind(this);

	// init: set the file src
    this.textureImage.src = this.file;
	}

}