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
	
	constructor(clk) {
		// attributes
		// for camera movement see atomicGL2SceneGraph (from line 121)
		// -------------------------------------------------
		// scene clock
		this.clock = clk;
		// camera starting position (translation)
		this.xc = 0.0; // position laterale
		this.yc = 2.0; // hauteur des "yeux"
		this.zc = 65.0; // position longitudinale
		// camera starting orientation (rotation)
		this.theta = 0.0; // Yaw
		this.phi = 0.0; // Pitch
		// step (walk speed)
		this.step = 9.375 / 1000; //0.15
		// Clamp pitch angle (degrees)
		this.maxPitch = 40;
	}

	// Keyboard up/right/left/down controls
	forward() {
		let frameTime = this.clock.get();
		this.xc += (+this.step * frameTime) * Math.sin(this.theta * 3.14 / 180.0);
		this.zc += (-this.step* frameTime) * Math.cos(this.theta * 3.14 / 180.0);
	}
	backward() {
		let frameTime = this.clock.get();
		this.xc += (-this.step * frameTime) * Math.sin(this.theta * 3.14 / 180.0);
		this.zc += (+this.step * frameTime) * Math.cos(this.theta * 3.14 / 180.0);
	}
	strafeRight() {
		let frameTime = this.clock.get();
		this.xc += (+this.step * frameTime) * Math.cos(this.theta * 3.14 / 180.0);
		this.zc += (+this.step * frameTime) * Math.sin(this.theta * 3.14 / 180.0);
	}
	strafeLeft() {
		let frameTime = this.clock.get();
		this.xc += (-this.step * frameTime) * Math.cos(this.theta * 3.14 / 180.0);
		this.zc += (-this.step * frameTime) * Math.sin(this.theta * 3.14 / 180.0);
	}
	flyUp() {
		this.yc += (+this.step * this.clock.get());
	}
	flyDown() {
		this.yc += (-this.step * this.clock.get());
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
}

export default atomicGLWalkCamera;