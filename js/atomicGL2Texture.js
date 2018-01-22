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

class atomicGL2Texture {
	// constructor
	//------------------------
	// inputs
	//------------------------
	// ffile: 		texture filename - string
	// ttype:		texture type : color | normal | displacement | specular | opacity - string
	// aagl:		atomicGL context

	constructor(iid, ffile, ttype, aagl) {
		// debug
		console.log("atomicGLTexture::constructor("+ffile+")");
		// attributes
		// -------------------------------------------------
		// local context
		this.agl = aagl;
		this.agl.nbTexture++;
		// texture id
		this.id = iid;
		// file name
		this.file = ffile;
		// texture type
		this.type = ttype;
		// texture image
		this.textureImage = new Image();
		// ogl texture
		this.texture = aagl.gl.createTexture();
		aagl.gl.bindTexture(aagl.gl.TEXTURE_2D, this.texture);
		aagl.gl.texImage2D(aagl.gl.TEXTURE_2D, 0, aagl.gl.RGBA, 1, 1, 0, aagl.gl.RGBA, aagl.gl.UNSIGNED_BYTE,
              new Uint8Array([255, 0, 0, 255]));
		this.texture.image = this.textureImage;

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
	handleIMG() {
		let o = this;
		// debug
		console.log("atomicGLTexture::onload("+o.file+")");

		o.agl.gl.pixelStorei(o.agl.gl.UNPACK_FLIP_Y_WEBGL, true);
		// bindTexture
		o.agl.gl.bindTexture(o.agl.gl.TEXTURE_2D, o.texture);
		o.agl.gl.texImage2D(o.agl.gl.TEXTURE_2D, 0, o.agl.gl.RGBA, o.agl.gl.RGBA, o.agl.gl.UNSIGNED_BYTE, o.texture.image);
		// parameters
		o.agl.gl.texParameteri(o.agl.gl.TEXTURE_2D, o.agl.gl.TEXTURE_MAG_FILTER, o.agl.gl.LINEAR);
		o.agl.gl.texParameteri(o.agl.gl.TEXTURE_2D, o.agl.gl.TEXTURE_MIN_FILTER, o.agl.gl.LINEAR_MIPMAP_NEAREST);
		o.agl.gl.generateMipmap(o.agl.gl.TEXTURE_2D);
		// unbind
		o.agl.gl.bindTexture(o.agl.gl.TEXTURE_2D, null);
		// loaded !
		o.loaded = true;
		o.agl.nbTextureLoaded++;
	}
	// --------------------------------------------------
	// build
	// --------------------------------------------------
	// handle image load
	build() {
		console.log("atomicGLTexture::build("+this.file+")");
		let file = this.file;
		this.textureImage.onload = this.handleIMG.bind(this);
		this.textureImage.onerror = function(e){
			if (e) {
				console.log("atomicGLTexture::error:onload("+file+")::"+e.message);
			} else {
				console.log("error in loading a texture, no error catched, but onerror event triggered");
			}
		}
		// init: set the file src
		this.textureImage.src = this.file;
	}
}

export default atomicGL2Texture;
