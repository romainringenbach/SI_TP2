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

	constructor(speed = 2.6, pos = [0.0, 0.7, 65.0]) {
		// attributes
		// for camera movement see atomicGL2SceneGraph (from line 121)
		// -------------------------------------------------
		// camera starting position (translation)
		this.xc = pos[0]; // position laterale
		this.yc = pos[1]; // hauteur des "yeux"
		this.zc = pos[2]; // position longitudinale
		// camera starting orientation (rotation)
		this.theta = 0.0; // Yaw
		this.phi = 0.0; // Pitch
		// step (walk speed)
		this.step = speed / 1000.0;
		// Clamp pitch angle (degrees)
		this.maxPitch = 40;
		// frame delta in ms
		this.frameTime = 0.0;
	}

	setframeTime(delta) {
		this.frameTime = delta;
	}

	// Keyboard up/right/left/down controls
	forward() {
		this.xc += (+this.step * this.frameTime) * Math.sin(this.theta * 3.14 / 180.0);
		this.zc += (-this.step* this.frameTime) * Math.cos(this.theta * 3.14 / 180.0);
	}
	backward() {
		this.xc += (-this.step * this.frameTime) * Math.sin(this.theta * 3.14 / 180.0);
		this.zc += (+this.step * this.frameTime) * Math.cos(this.theta * 3.14 / 180.0);
	}
	strafeRight() {
		this.xc += (+this.step * this.frameTime) * Math.cos(this.theta * 3.14 / 180.0);
		this.zc += (+this.step * this.frameTime) * Math.sin(this.theta * 3.14 / 180.0);
	}
	strafeLeft() {
		this.xc += (-this.step * this.frameTime) * Math.cos(this.theta * 3.14 / 180.0);
		this.zc += (-this.step * this.frameTime) * Math.sin(this.theta * 3.14 / 180.0);
	}
	flyUp() {
		this.yc += (+this.step * this.frameTime);
	}
	flyDown() {
		this.yc += (-this.step * this.frameTime);
	}
	// Mouse controls
	turnright(a) { // Yaw
		this.theta += a;
	}
	turnup(a) { // Pitch
		this.phi += a;
		//console.log(this.phi);
		if (this.phi < -this.maxPitch)
			this.phi = -this.maxPitch;
		if (this.phi > this.maxPitch)
			this.phi = this.maxPitch;
	}

	getCamPos() {
		let pos = [this.xc, this.yc, this.zc];
		return pos;
	}
}

export default atomicGLWalkCamera;
