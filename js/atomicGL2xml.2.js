import {atomicGL2SGroot, atomicGL2SGtransform, atomicGL2SGobject3d, atomicGL2SGtransformAnim} from './atomicGL2SceneGraph.2.js';
import {atomicGL2ObjMesh, atomicGL2SkyBox, atomicGL2Sphere} from './atomicGL2Object3d.js';
import {atomicGL2ShaderLoaderScriptInLine, atomicGL2ShaderLoaderScriptXML, atomicGL2MatShader} from './atomicGL2Shader.2.js';
import atomicGL2Texture from './atomicGL2Texture.js';
import atomicGLWalkCamera from './atomicGLWalkCamera.js';
import atomicGL2Sounds from './atomicGL2Sounds.js';
// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.1
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGLxml
//----------------------------------------------------------------------------------------
// TODO list
//----------------------------------------------------------------------------------------

class atomicGL2xml {
	// constructor
	//------------------------
	constructor(agl, name) {
		// attributes
		// -------------------------------------------------
		this.dom = null;
		this.objectList = [];
		this.root = null;
		this.animatedTransformations = [];

		this.shadersBis = [];

		// build
		// ----------------------
		// init
		this.build(agl, name);
	}

	// methods
	// --------------------------------------------------

	// loadXML
	loadXML(agl, name) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", name, false);
		xmlhttp.send();
		var xmlDoc = xmlhttp.responseXML;
		return xmlDoc;
	}
	/*
	activeShader(index,agl){
		console.log(this.shadersBis[index])
		var shader_name = this.shadersBis[index].name;
		var file = this.shadersBis[index].file;
		var nbtex = this.shadersBis[index].nbtex;
		var nblight = this.shadersBis[index].nblight;
		agl.pushProgram(new atomicGL2MatShader(shader_name, agl,new atomicGL2ShaderLoaderScriptXML(file),nbtex,nblight));
		this.shadersBis[index].active = true;
	}*/

	// shaders
	shaders(agl) {
		// examples
		//<XMATSHADER file="texDiffProg.xml" nbtex="1" nblight="1">texDiffProg</XMATSHADER>
		//<IMATSHADER vertex="vertex_texDiffNormalMap" fragment="frag_texDiffNormalMap" nbtex="2" nblight="1">texDiffNormalMapProg</IMATSHADER>
		var listXMSHAD = this.dom.getElementsByTagName("XMATSHADER");
		for (var i = 0; i < listXMSHAD.length; i++) {
			//
			var SHAD = listXMSHAD[i];
			var shader_name = SHAD.childNodes[0].data;
			var file = SHAD.getAttribute("file");
			var nbtex = parseFloat(SHAD.getAttribute("nbtex"));
			var nblight = parseFloat(SHAD.getAttribute("nblight"));
			// create shader and add it to context
			agl.pushProgram(new atomicGL2MatShader(shader_name, agl, new atomicGL2ShaderLoaderScriptXML(file), nbtex, nblight));
			this.shadersBis.push({
				name: shader_name,
				file: file,
				nbtex: nbtex,
				nblight: nblight,
				active: false
			});
			// debug
			console.log("atomicGLxml::shaders >> find shader(" + i + "): " + shader_name + "-file: " + file);
		}
		// IMATSHADER : What is it used for ?
		/* var listIMSHAD = this.dom.getElementsByTagName("IMATSHADER");
		for (var i = 0; i < listIMSHAD.length; i++) {
			//
			var SHAD = listIMSHAD[i];
			var shader_name = SHAD.childNodes[0].data;
			var vertex = SHAD.getAttribute("vertex");
			var fragment = SHAD.getAttribute("fragment");
			var nbtex = parseFloat(SHAD.getAttribute("nbtex"));
			var nblight = parseFloat(SHAD.getAttribute("nblight"));
			// create shader and add it to context
			agl.pushProgram(new atomicGL2MatShader(shader_name, agl, new atomicGL2ShaderLoaderScriptInLine(vertex, fragment), nbtex, nblight));
			// debug
			console.log("atomicGLxml::shaders >> find shader(" + i + "): " + shader_name + "-vertex: " + vertex + "-fragment: " + fragment);
		} */
	}

	// textures
	textures(agl) {
		// <TEXTURE id="test" type="color"> texture/test.png </TEXTURE>
		var listTEX = this.dom.getElementsByTagName("TEXTURE");
		for (var i = 0; i < listTEX.length; i++) {
			//
			var TEX = listTEX[i];
			var file_name = TEX.childNodes[0].data;
			var id = TEX.getAttribute("id");
			var type = TEX.getAttribute("type");

			// create texture and add it to context
			agl.textures.push(new atomicGL2Texture(id, file_name, type, agl));
			// debug
			//console.log("atomicGLxml::textures >> find texture("+i+"): "+listTEX[i].childNodes[0].data+"-id: "+id+" -type: "+type);
		}
	}

	// shapes
	shapes(agl) {
		// <SHAPE id="shape0" type="obj">
		//   <GEOMETRY id="mesh1" uv="1.0,1.0">mesh1()</GEOMETRY>
		//   <TEXID>test</TEXID>
		//   <TEXTID>test_normal</TEXTID>
		// </SHAPE>
		var listSHAPE = this.dom.getElementsByTagName("SHAPE");
		for (var i = 0; i < listSHAPE.length; i++) {
			//
			var SHAPE = listSHAPE[i];
			var SHAPEId = SHAPE.getAttribute("id");
			var SHAPEType = SHAPE.getAttribute("type");
			// only one GEOMETRY
			var GEOMETRY = SHAPE.getElementsByTagName("GEOMETRY")[0];
			var GEOmesh = GEOMETRY.childNodes[0].data;
			var GEOId = GEOMETRY.getAttribute("id");
			var GEOuv = GEOMETRY.getAttribute("uv");
			var u = parseFloat(GEOuv.split(",")[0]);
			var v = parseFloat(GEOuv.split(",")[1]);

			// create shape
			// switch nodeName
			var ss;
			switch (SHAPEType) {
				case "obj":
					ss = new atomicGL2ObjMesh(SHAPEId, eval("new " + GEOmesh), u, v);
					break;
				case "sphere":
					//ss = new atomicGL2Sphere(SHAPEId,rradius, llatitudeBands,llongitudeBands,u,v);
					ss = new atomicGL2Sphere(SHAPEId,
						parseFloat(GEOmesh.split(",")[0]),
						parseFloat(GEOmesh.split(",")[1]),
						parseFloat(GEOmesh.split(",")[2]),
						u, v);
					ss.build();
					break;
			}

			// debug
			//console.log("atomicGLxml::shapes >> find shape("+i+"): "+SHAPEId+"-GEOMETRY:" + GEOId+ "-mesh:"+GEOmesh+"-uv:"+u+","+v);

			// textures
			var textures = SHAPE.getElementsByTagName("TEXTID");
			for (var j = 0; j < textures.length; j++) {
				var tid = textures[j].childNodes[0].data;
				// texture index in agl
				var agltid = agl.indexOfTexture(tid);
				if (agltid != -1) {
					ss.pushTexture(agl.textures[agltid]);
				}
				else {
					alert("atomicGLxml::shapes (" + SHAPEId + ") texture: " + tid + " not found !");
				}
				// debug
				//console.log("-- texture used ("+j+"):"+tid + "- index:" + agltid);
			}

			// init shape buffer and add it to context
			ss.initGLBuffers(agl);
			agl.shapes.push(ss);
		}
	}

	// LIGHTS
	// <LIGHTS>
	// 	<LIGHT id="sun" position="1000.0,500.0,500.0" color="1.0,0.8,0.8">light1</LIGHT>
	//  <LIGHT id="ambient1" type="ambient" color="1.0,0.8,0.8">ambient1</LIGHT>
	// </LIGHTS>
	lights(agl) {
		var listLIGHT = this.dom.getElementsByTagName("LIGHT");

		for (var i = 0; i < listLIGHT.length; i++) {
			var LIGHT = listLIGHT[i];
			var id = LIGHT.getAttribute("id");
			var type = LIGHT.getAttribute("type");

			// parse color
			var LIGHTcolor = LIGHT.getAttribute("color");
			var color = [];
			color[0] = Number(LIGHTcolor.split(",")[0]);
			color[1] = Number(LIGHTcolor.split(",")[1]);
			color[2] = Number(LIGHTcolor.split(",")[2]);

			if (isNaN(color[0]) || isNaN(color[1]) || isNaN(color[2])) {
				color[0] = LIGHTcolor.split(",")[0];
				color[1] = LIGHTcolor.split(",")[1];
				color[2] = LIGHTcolor.split(",")[2];
			}

			switch (type) {
				case "point":
					// parse position
					var LIGHTpos = LIGHT.getAttribute("position");
					var LIGHTscope = LIGHT.getAttribute("scope");
					var LIGHTabs = LIGHT.getAttribute("absolutePos");
					var pos = [];
					pos[0] = Number(LIGHTpos.split(",")[0]);
					pos[1] = Number(LIGHTpos.split(",")[1]);
					pos[2] = Number(LIGHTpos.split(",")[2]);

					if (isNaN(pos[0]) || isNaN(pos[1]) || isNaN(pos[2])) {
						pos[0] = LIGHTpos.split(",")[0];
						pos[1] = LIGHTpos.split(",")[1];
						pos[2] = LIGHTpos.split(",")[2];
					}
					var scope;
					var absPos;
					if(LIGHTscope && LIGHTscope != ""){
						scope = Number(LIGHTscope);
						if (isNaN(scope)) {
							console.log("scope animée");
							scope = LIGHTscope;
						}
					} else {
						scope = -1.0;
					}
					if(LIGHTabs && LIGHTabs != ""){
						absPos = parseFloat(LIGHTabs);
					} else {
						absPos = 0.0;
					}
					console.log("scope:"+scope);
					// create light and add it to context
					agl.pushLight(pos, color,scope,absPos);
					break;
				case "ambient":
					//add ambient light color
					agl.ambientLightColor = color;
					break;
			}
		}
	}

	//<SOUNDS ambiance="background.json" sfx="sfx.json">
	//	<SOUND></SOUND>
	//</SOUNDS>
	loadSounds(agl) {
		agl.howlers = new atomicGL2Sounds();
		let SOUNDSFiles = this.dom.getElementsByTagName("SOUNDS")[0];
		let ambiance = SOUNDSFiles.getAttribute("ambiance");
		let sfx = SOUNDSFiles.getAttribute("sfx");
		agl.howlers.loadAmbianceHowl(ambiance);
		agl.howlers.loadSfxHowl(sfx);
		let SOUNDSList = this.dom.getElementsByTagName("SOUND");
		for (let i = 0; i < SOUNDSList.length; i++) {
			let SOUND = SOUNDSList[i];
			let type = SOUND.getAttribute("type");
			switch(type) {
				case "ambiance": {
					let sprite = SOUND.getAttribute("sprite");
					agl.howlers.playTheme(sprite);
				}
				break;
				case "sfx": {
					let sprite = SOUND.getAttribute("sprite");
					let repeat = parseFloat(SOUND.getAttribute("repeat"));
					agl.howlers.playSfxRandomized(sprite, repeat);
				}
				break;
			}
		}
	}

	// traverse
	// ---------------------------
	// input
	// ---------------------------
	// e: DOM elements
	// s: parent node
	// ---------------------------
	traverse(agl, e, s) {
		// current node
		var nodeName = e.nodeName;
		var node = null;

		// console.log(s+nodeName);
		// switch nodeName
		switch (nodeName) {
			case "ROOT":
				// skybox
				var skyTexId = e.getAttribute("skybox");
				var skyBox = null;
				if ((skyTexId != "") || (skyTexId != "no")) {
					skyBox = new atomicGL2SkyBox('skybox', parseFloat(e.getAttribute("skysize")));
					skyBox.pushTexture(agl.textures[agl.indexOfTexture(skyTexId)]);
					skyBox.initGLBuffers(agl);
				}
				// camera
				var camId = e.getAttribute("camera");
				var camera = null;
				// Get camera params
				let campos = e.getAttribute("campos");
				let campos_t = [];
				campos_t[0] = parseFloat(campos.split(",")[0]);
				campos_t[1] = parseFloat(campos.split(",")[1]);
				campos_t[2] = parseFloat(campos.split(",")[2]);
				let camspeed = parseFloat(e.getAttribute("camspeed"));
				switch (camId) {
					case "walk": camera = new atomicGLWalkCamera(camspeed, campos_t);
				}
				// JS6
				node = new atomicGL2SGroot(e.getAttribute("id"));
				node.setRootElt(camera, skyBox, agl.indexOfShader(e.getAttribute("skyshader")));
				agl.scenegraph = node;
				this.root = node;
				//  debug
				// console.log(s+e.getAttribute("id"));
				break;
			case "TRANSFORM":
				// transform
				// console.log(s+e.getAttribute("id"));
				// id
				var id = e.getAttribute("id");
				var isAnimated = false;
				// translate
				var transS = e.getAttribute("translate").split(",");
				var tx = Number(transS[0]);
				var ty = Number(transS[1]);
				var tz = Number(transS[2]);
				if(isNaN(tx) || isNaN(ty) || isNaN(tz)) {
					tx = transS[0];
					ty = transS[1];
					tz = transS[2];
					isAnimated = true;
				}
				// rotaxis
				var rotAxisS = e.getAttribute("rotaxis").split(",");
				var ax = Number(rotAxisS[0]);
				var ay = Number(rotAxisS[1]);
				var az = Number(rotAxisS[2]);
				if(isNaN(ax) || isNaN(ay) || isNaN(az)) {
					ax = rotAxisS[0];
					ay = rotAxisS[1];
					az = rotAxisS[2];
					isAnimated = true;
				}
				// angle
				var theta = Number(e.getAttribute("angle"));
				if(isNaN(theta)) {
					theta = e.getAttribute("angle");
					isAnimated = true;
				}

				// scale
				var scaleS = e.getAttribute("scale").split(",");

				var sx = Number(scaleS[0]);
				var sy = Number(scaleS[1]);
				var sz = Number(scaleS[2]);
				if(isNaN(sx) || isNaN(sy) || isNaN(sz)) {
					sx = scaleS[0];
					sy = scaleS[1];
					sz = scaleS[2];
					isAnimated = true;
				}

				// node
				// JS6
				if(isAnimated) {
					node = new atomicGL2SGtransformAnim(id);
					this.animatedTransformations.push(node);
				}
				else {
					node = new atomicGL2SGtransform(id);
				}
				node.setTransform([tx, ty, tz], [ax, ay, az], theta, [sx, sy, sz]);
				s.addChild(node);
				// debug
				//node.toDEBUG();
				break;
			case "OBJECT3D":
				// object3D
				// id
				var id = e.getAttribute("id");
				// shader - ie progId
				var shaderId = e.getAttribute("shader");
				// shape
				var shapeId = e.childNodes[0].data;

				// node
				// JS6
				node = new atomicGL2SGobject3d(id);

				node.setObject3D(agl.shapes[agl.indexOfShape(shapeId)], agl.indexOfShader(shaderId),shaderId);

				s.addChild(node);
				this.objectList.push(node);
				// debug
				//console.log("atomicGL2xml::traverse -> add OBJECT3D");
				break;
		}
		// children
		for (var i = 0; i < e.children.length; i++) {
			var child = e.children[i];
			this.traverse(agl, child, node);
		}
	}

	// scenegraph
	scenegraph(agl) {
		var root = this.dom.getElementsByTagName("ROOT")[0];
		this.traverse(agl, root, agl.scenegraph);
	}

	// build
	build(agl, name) {
		// --------------------------------------------------
		// load XML file
		this.dom = this.loadXML(agl, name);
		// find shaders
		this.shaders(agl);
		// find textures
		this.textures(agl);
		// find shapes
		this.shapes(agl);
		// find lights
		this.lights(agl);
		// find sounds
		this.loadSounds(agl);
		// scenegraph
		this.scenegraph(agl);
	}
}

export default atomicGL2xml;
