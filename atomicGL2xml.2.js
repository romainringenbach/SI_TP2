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
 	constructor(agl,name){
		// attributes
		// -------------------------------------------------
		this.dom  = null ;
		
		// build
		// ----------------------
		// init
		this.build(agl,name);
	}
	
	// methods
	// --------------------------------------------------

	// loadXML
	loadXML(agl,name){
		var xmlhttp=new XMLHttpRequest();
		xmlhttp.open("GET",name,false);
		xmlhttp.send();
		var xmlDoc=xmlhttp.responseXML;
		return xmlDoc;
	} 
	
	// shaders
	shaders(agl){
		// examples
		//<XMATSHADER file="texDiffProg.xml" nbtex="1" nblight="1">texDiffProg</XMATSHADER>
		//<IMATSHADER vertex="vertex_texDiffNormalMap" fragment="frag_texDiffNormalMap" nbtex="2" nblight="1">texDiffNormalMapProg</IMATSHADER>
		var listXMSHAD = this.dom.getElementsByTagName("XMATSHADER");
		for (var i=0; i<listXMSHAD.length;i++){
			//
			var SHAD = listXMSHAD[i] ;
			var shader_name = SHAD.childNodes[0].data ;
			var file = SHAD.getAttribute("file");
			var nbtex = parseFloat(SHAD.getAttribute("nbtex"));
			var nblight = parseFloat(SHAD.getAttribute("nblight"));
			// create shader and add it to context
			agl.pushProgram(new atomicGL2MatShader(shader_name, agl,new atomicGL2ShaderLoaderScriptXML(file),nbtex,nblight));
			// debug
			console.log("atomicGLxml::shaders >> find shader("+i+"): "+shader_name+"-file: "+file);	
		}
		var listIMSHAD = this.dom.getElementsByTagName("IMATSHADER");
		for (var i=0; i<listIMSHAD.length;i++){
			//
			var SHAD = listIMSHAD[i] ;
			var shader_name = SHAD.childNodes[0].data ;
			var vertex = SHAD.getAttribute("vertex");
			var fragment = SHAD.getAttribute("fragment");
			var nbtex = parseFloat(SHAD.getAttribute("nbtex"));
			var nblight = parseFloat(SHAD.getAttribute("nblight"));
			// create shader and add it to context
			agl.pushProgram(new atomicGL2MatShader(shader_name, agl,new atomicGL2ShaderLoaderScriptInLine(vertex,fragment),nbtex,nblight));
			// debug
			console.log("atomicGLxml::shaders >> find shader("+i+"): "+shader_name+"-vertex: "+vertex+"-fragment: "+fragment);	
		}
	}
	
	// textures
	textures(agl){
	// <TEXTURE id="test" type="color"> texture/test.png </TEXTURE>
		var listTEX = this.dom.getElementsByTagName("TEXTURE");
		for (var i=0; i<listTEX.length;i++){
			//
			var TEX = listTEX[i] ;
			var file_name = TEX.childNodes[0].data ;
			var id = TEX.getAttribute("id");
			var type = TEX.getAttribute("type");

			// create texture and add it to context
			agl.textures.push(new atomicGL2Texture(id,file_name,type,agl));
			// debug
			//console.log("atomicGLxml::textures >> find texture("+i+"): "+listTEX[i].childNodes[0].data+"-id: "+id+" -type: "+type);
		}
	}
	
	// shapes
	shapes(agl){
	// <SHAPE id="shape0" type="obj">
	//   <GEOMETRY id="mesh1" uv="1.0,1.0">mesh1()</GEOMETRY>
	//   <TEXID>test</TEXID>
	//   <TEXTID>test_normal</TEXTID>
	// </SHAPE>
		var listSHAPE = this.dom.getElementsByTagName("SHAPE");
		for (var i=0; i < listSHAPE.length ; i++){
			// 
			var SHAPE 	= listSHAPE[i];
			var SHAPEId = SHAPE.getAttribute("id");
			var SHAPEType = SHAPE.getAttribute("type");
			// only one GEOMETRY
			var GEOMETRY=  SHAPE.getElementsByTagName("GEOMETRY")[0];
			var GEOmesh = GEOMETRY.childNodes[0].data ;
			var GEOId = GEOMETRY.getAttribute("id");
			var GEOuv = GEOMETRY.getAttribute("uv");
			var u = parseFloat(GEOuv.split(",")[0]);
			var v = parseFloat(GEOuv.split(",")[1]);
	
			// create shape 
			// switch nodeName
			var ss ;
			switch (SHAPEType){
			case "obj": 
				ss = new atomicGL2ObjMesh(SHAPEId, eval("new "+GEOmesh), u,v) ;
				break ;
			case "sphere" :
				//ss = new atomicGL2Sphere(SHAPEId,rradius, llatitudeBands,llongitudeBands,u,v);
				ss = new atomicGL2Sphere(SHAPEId,
					parseFloat(GEOmesh.split(",")[0]),
					parseFloat(GEOmesh.split(",")[1]),
					parseFloat(GEOmesh.split(",")[2]),
					u,v);
				ss.build();
				break;
			}	
			
			// debug
			//console.log("atomicGLxml::shapes >> find shape("+i+"): "+SHAPEId+"-GEOMETRY:" + GEOId+ "-mesh:"+GEOmesh+"-uv:"+u+","+v);
			
			// textures
			var textures = SHAPE.getElementsByTagName("TEXTID");
			for (var j=0; j < textures.length ; j++){
				var tid = textures[j].childNodes[0].data;
				// texture index in agl
				var agltid = agl.indexOfTexture(tid);
				if (agltid != -1){
					ss.pushTexture(agl.textures[agltid]);
				}
				else{
					alert("atomicGLxml::shapes ("+SHAPEId+") texture: "+tid+" not found !");
				}
				// debug
				//console.log("-- texture used ("+j+"):"+tid + "- index:" + agltid);
			}
			
			// init shape buffer and add it to context
			ss.initGLBuffers(agl);
			agl.shapes.push(ss);
		}
	}
	
	// traverse
	// ---------------------------
	// input
	// ---------------------------
	// e: DOM elements
	// s: parent node 
	// ---------------------------
	traverse(agl,e,s){
		// current node
		var nodeName = e.nodeName ;
		var node = null;
		
		// console.log(s+nodeName);
		// switch nodeName
		switch (nodeName){
			case "ROOT": 
				// skybox
				var skyTexId = e.getAttribute("skybox");
				var skyBox = null ;
				if ((skyTexId!="")||(skyTexId!="no")){
					skyBox = new atomicGL2SkyBox('skybox',parseFloat(e.getAttribute("skysize")));
					skyBox.pushTexture(agl.textures[agl.indexOfTexture(skyTexId)]);		
					skyBox.initGLBuffers(agl);
				}
				// camera
				var camId = e.getAttribute("camera");
				var camera = null ;
				switch (camId){
					case "walk": camera = new atomicGLWalkCamera() ;
				}
				// JS6
				node = new atomicGL2SGroot("root",e.getAttribute("id"));
				node.setRootElt(camera,skyBox,agl.indexOfShader(e.getAttribute("skyshader")));
				agl.scenegraph = node ;
				//  debug
				// console.log(s+e.getAttribute("id"));
			break;
			case "TRANSFORM": 
				// transform
				// console.log(s+e.getAttribute("id"));
				// id
				var id = e.getAttribute("id");
				// translate
				var transS = e.getAttribute("translate").split(",");
				var tx = parseFloat(transS[0]);
				var ty = parseFloat(transS[1]);
				var tz = parseFloat(transS[2]);
				// rotaxis
				var rotAxisS = e.getAttribute("rotaxis").split(",");
				var ax = parseFloat(rotAxisS[0]);
				var ay = parseFloat(rotAxisS[1]);
				var az = parseFloat(rotAxisS[2]);
				// angle
				var theta = parseFloat(e.getAttribute("angle"));
				
				// node
				// JS6
				node = new atomicGL2SGtransform("transform",id);
				node.setTransform([tx,ty,tz],[ax,ay,az],theta);	
				s.addChild(node);
				// debug
				//node.toDEBUG();
			break;
			case "OBJECT3D": 
				// object3D
				// id
				var id = e.getAttribute("id") ;
				// shader - ie progId
				var shaderId = e.getAttribute("shader");
				// shape
				var shapeId = e.childNodes[0].data ;
				
				// node
				// JS6
				node = new atomicGL2SGobject3d('object3D',id);
				node.setObject3D(agl.shapes[agl.indexOfShape(shapeId)],agl.indexOfShader(shaderId));
				s.addChild(node);				
				// debug
				//console.log("atomicGL2xml::traverse -> add OBJECT3D");
			break;
		}
		// children
		for (var i=0; i<e.children.length;i++){
			var child = e.children[i] ;
			this.traverse(agl,child,node);
		}
	}

	// scenegraph
	scenegraph(agl){
		var root = this.dom.getElementsByTagName("ROOT")[0];
		this.traverse(agl,root,agl.scenegraph);
	}
	
	// build
	build(agl, name){
	// --------------------------------------------------
	// load XML file
	this.dom = this.loadXML(agl,name)  ;
	// find shaders
	this.shaders(agl);
	// find textures
	this.textures(agl);
	// find shapes
	this.shapes(agl);
	// scenegraph
	this.scenegraph(agl);
	}
}