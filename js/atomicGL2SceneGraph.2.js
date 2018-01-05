// atomicGL
//----------------------------------------------------------------------------------------
// author: RC				
// contact: cozot@irisa.fr
// version: 2.2
// current version date: 2016/01/27
//----------------------------------------------------------------------------------------
// atomicGL2SceneGrpah
//----------------------------------------------------------------------------------------

class atomicGL2SceneGraph {

	// constructor
	//------------------------
	// inputs: 	stype - string
	//			nname - string
	constructor(stype, nname) {
		// attributes
		// -------------------------------------------------
		// type: string - "root" | "transform" | "object3D"
		this.type = stype;
		this.name = nname ;

		// children
		this.children = [];
	}

	// methods
	// --------------------------------------------------

	// addChild
	// -------------------------
	// inputs: 	o - atomicGLSceneGrpah
	addChild(o) {
		switch (this.type) {
			case "root": this.children.push(o); break;
			case "transform": this.children.push(o); break;
			case "transformAnim": this.children.push(o); break;
			default: console.log("atomicGL:atomicGLSceneGraph(" + this.name + "/" + this.type + "):can not add child to " + this.type);
		}
	}

	// draw
	// -------------------------
	// inputs: 	agl - atomicGLContext
	//			ams - atomicGLMatrixStack
	draw(agl, ams) { }

	// toDEBUG
	// -------------------------
	toDEBUG() {
		console.log("atomicGLSceneGraph::");
		this.toDEBUG2("--");
	}

	// toDEBUG(param)
	// -------------------------
	// inputs: p - string
	toDEBUG2(p) {
		var s = p + this.name + "(" + this.type + ")";
		console.log(s);
		console.log(p + "----------------------------");
		switch (this.type) {
			case "root":
				break;
			case "transform":
				// type= transform - translation & rotation
				console.log(p + ">translate:[" + this.translate[0] + "," + this.translate[1] + "," + this.translate[2] + "]");
				console.log(p + ">rotAxis:[" + this.rotAxis[0] + "," + this.rotAxis[1] + "," + this.rotAxis[2] + "]");
				console.log(p + ">angle:" + this.rotation);
				console.log(p + "----------------------------");
				break;
			case "object":
				break;
		}
		for (var i = 0; i < this.children.length; i++) { this.children[i].toDEBUG2(p + "--"); }
	}
}

//----------------------------------------------------------------------------------------
// atomicGL2SGroot extends atomicGL2SceneGraph
//----------------------------------------------------------------------------------------

class atomicGL2SGroot extends atomicGL2SceneGraph {
	constructor(name) {
		super("root", name);
		// attributes
		// type = root - camera and skybox
		this.camera = null;
		this.skyBox = null;
		this.shaderId = -1;
		// debug
		//console.log("atomicGL2SGroot extends atomicGL2SceneGraph::constructor ->"+name);
	}

	// setRootElt
	// -------------------------
	// inputs: 	cam - atomicGLCamera
	//			sk - atomicGLSkyBox
	//			sid - shader id (used by skybox)
	setRootElt(cam, sb, sid) {
		this.camera = cam;
		this.skyBox = sb;
		this.shaderId = sid;
	}

	// draw
	// -------------------------
	// inputs: 	agl - atomicGLContext
	//			ams - atomicGLMatrixStack
	draw(agl, ams) {
		// debug
		// console.log("atomicGLSceneGraph::draw("+this.type+","+this.name+", shaderId:"+this.shaderId+")");
		// initDraw
		agl.initDraw();
		//Reset perspective if client canvas size has changed. Correct fov and shapes
		ams.resetPerspective(agl);
		// push matrix
		ams.mvIdentity();
		ams.mvPushMatrix();
		// skyBox ----------------------------------------------------------------
		if (this.skyBox != null) {
			ams.mvPushMatrix();
			// position & orientation
			ams.mvTranslate(0.0, 0.0, 0.0);
			ams.mvRotate(this.camera.phi, [1, 0, 0]); // Pitch
			ams.mvRotate(this.camera.theta, [0, 1, 0]); // Yaw
			// draw
			this.skyBox.draw(agl,ams,this.shaderId); 	

			// pop matrix
			ams.mvPopMatrix();
		}
		// camera -----------------------------------------------------------------
		if (this.camera != null) {
			ams.mvRotate(this.camera.phi, [1, 0, 0]);
			ams.mvRotate(this.camera.theta, [0, 1, 0]);
			ams.mvTranslate(-this.camera.xc, -this.camera.yc, -this.camera.zc);
		}
		// children
		for (var i = 0; i < this.children.length; i++) { this.children[i].draw(agl, ams); }
		// pop
		ams.mvPopMatrix();
	}
}

//----------------------------------------------------------------------------------------
// atomicGL2SGtransform extends atomicGL2SceneGraph
//----------------------------------------------------------------------------------------
class atomicGL2SGtransform extends atomicGL2SceneGraph {
	constructor(name) {
		super("transform", name);
		// attributes
		// type= transform - translation & rotation
		this.translate = [0.0, 0.0, 0.0];
		this.rotAxis = [0.0, 1.0, 0.0];
		this.rotation = 0.0;
		this.scale = [1.0, 1.0, 1.0];
		// debug
		//console.log("atomicGL2SGtransform extends atomicGL2SceneGraph::constructor ->"+this.type+" - "+this.name);
	}

	// setTransform
	// -------------------------
	// inputs: 	tr - vec3: translation vector
	//			ax - vec3: rotation axis vector
	//			ro - float: rotationangle
	setTransform(tr, ax, ro, sc) {
		this.translate = tr;
		this.rotAxis = ax;
		this.rotation = ro;
		this.scale = sc;
	}

	// draw
	// -------------------------
	// inputs: 	agl - atomicGLContext
	//			ams - atomicGLMatrixStack
	draw(agl, ams) {
		// debug
		// console.log("atomicGLSceneGraph::draw("+this.type+","+this.name+", shaderId:"+this.shaderId+")"); 
		// matrix
		ams.mvPushMatrix();
		// position & orientation
		ams.mvTranslate(this.translate[0], this.translate[1], this.translate[2]);
		ams.mvRotate(this.rotation, this.rotAxis);
		// scale
		ams.mvScale(this.scale[0],this.scale[1],this.scale[2]);
		// children
		for (var i = 0; i < this.children.length; i++) { this.children[i].draw(agl, ams); }
		// matrix pop
		ams.mvPopMatrix();
	}
}

//----------------------------------------------------------------------------------------
// atomicGL2SGtransformAnim extends atomicGL2SceneGraph
//----------------------------------------------------------------------------------------
class atomicGL2SGtransformAnim extends atomicGL2SceneGraph {
	constructor(name) {
		super("transformAnim", name);
		// attributes
		// type= transform - translation & rotation
		this.translate = ["", "", ""];
		this.rotAxis = ["", "", ""];
		this.rotation = "";
		this.scale = ["", "", ""];
		this.t = 0.0;
		// debug
		//console.log("atomicGL2SGtransform extends atomicGL2SceneGraph::constructor ->"+this.type+" - "+this.name);
	}

	// setTransform
	// -------------------------
	// inputs: 	tr - vec3: translation vector
	//			ax - vec3: rotation axis vector
	//			ro - float: rotationangle
	setTransform(tr, ax, ro, sc) {
		this.translate = tr;
		this.rotAxis = ax;
		this.rotation = ro;
		this.scale = sc;
	}
	
	updateTime(time) {
		this.t = time;
	}

	// draw
	// -------------------------
	// inputs: 	agl - atomicGLContext
	//			ams - atomicGLMatrixStack
	draw(agl, ams) {
		var t = this.t;
		// debug
		// console.log("atomicGLSceneGraph::draw("+this.type+","+this.name+", shaderId:"+this.shaderId+")"); 
		// matrix
		ams.mvPushMatrix();
		// position & orientation
		ams.mvTranslate(eval(this.translate[0]), eval(this.translate[1]), eval(this.translate[2]));
		ams.mvRotate(eval(this.rotation)%360, [eval(this.rotAxis[0]),eval(this.rotAxis[1]),eval(this.rotAxis[2])]);
		// scale
		ams.mvScale(eval(this.scale[0]),eval(this.scale[1]),eval(this.scale[2]));
		// children
		for (var i = 0; i < this.children.length; i++) { this.children[i].draw(agl, ams); }
		// matrix pop
		ams.mvPopMatrix();
	}
}

//----------------------------------------------------------------------------------------
// atomicGL2SGobject3d extends atomicGL2SceneGraph
//----------------------------------------------------------------------------------------
class atomicGL2SGobject3d extends atomicGL2SceneGraph {
	constructor(name) {
		super("object3D", name);
		// attributes
		// type = object3D - object3D & shaderId
		this.object3D = null;
		this.shaderId = -1; // also used for skybox
		// debug
		//console.log("atomicGL2SGobject3d extends atomicGL2SceneGraph::constructor ->"+this.type+" - "+this.name);		

	}
	// setObject3D
	// -------------------------
	// inputs: 	o - atomicGLObj
	//			sid - shader id
	setObject3D(o, sid) {
		// debug
		//console.log("atomicGL2SGobject3d extends atomicGL2SceneGraph::setObject3D ->"+this.type+" - "+this.name);		

		this.object3D = o;
		this.shaderId = sid;
	}

	// set a shader for this object
	//			sid - shader id
	setShader(sid) {
		this.shaderId = sid;
	}

	// draw
	// -------------------------
	// inputs: 	agl - atomicGLContext
	//			ams - atomicGLMatrixStack
	draw(agl, ams) {
		// debug
		// console.log("atomicGL2SGobject3d extends atomicGL2SceneGraph::draw ->"+this.type+" - "+this.name);
		this.object3D.draw(agl,ams,this.shaderId);		
	}		
}

export {atomicGL2SGroot, atomicGL2SGtransform, atomicGL2SGobject3d, atomicGL2SGtransformAnim};