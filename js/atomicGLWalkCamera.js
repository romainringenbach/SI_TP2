// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 0.1
// current version date: 2015/10/07
//----------------------------------------------------------------------------------------
// atomicGLClock
//----------------------------------------------------------------------------------------
// TODO list
//----------------------------------------------------------------------------------------

//------------------------
class atomicGLWalkCamera {
	
	constructor() {
		// attributes
		// -------------------------------------------------
		// camera position
		this.xc = 0.0;
		this.yc = 2.0;
		this.zc = 0.0;
		// camera orientation
		this.theta = 0.0;
		this.phi = 0.0;
		// step
		this.step = 0.10;
		// rot
		this.rot = 0.5;
	}

	// methods
	// --------------------------------------------------
	// up/right/left/down
	//---------------------------
	up() {
		this.xc += +this.step * Math.sin(this.theta * 3.14 / 180.0);
		this.zc += -this.step * Math.cos(this.theta * 3.14 / 180.0);
	}
	down() {
		this.xc += -this.step * Math.sin(this.theta * 3.14 / 180.0);
		this.zc += +this.step * Math.cos(this.theta * 3.14 / 180.0);
	}
	right() {
		this.xc += +this.step * Math.cos(this.theta * 3.14 / 180.0);
		this.zc += +this.step * Math.sin(this.theta * 3.14 / 180.0);
	}
	left() {
		this.xc += -this.step * Math.cos(this.theta * 3.14 / 180.0);
		this.zc += -this.step * Math.sin(this.theta * 3.14 / 180.0);
	}
	flyUp() {
		this.yc += +this.step;
	}
	flyDown() {
		this.yc += -this.step;
	}
	turnright(a) {
		this.theta += +a;
	}
	turnleft(a) {
		this.theta += +a;
	}
	turnup(a) {
		this.phi = a;
	}
}

export default atomicGLWalkCamera;