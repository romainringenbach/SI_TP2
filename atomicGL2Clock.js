// atomicGL
//----------------------------------------------------------------------------------------
// author: RC				
// contact: cozot@irisa.fr
// version: 2.1
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGLClock
//----------------------------------------------------------------------------------------

class atomicGL2Clock{
// constructor
//------------------------
	constructor(){
		// attributes
		// -------------------------------------------------
		// time of last tick
    	this.lastTime = 0.0 ;
		// elapsed time
		this.elapsed = 0.0 ;	
	}
	// methods
	// --------------------------------------------------
	// tick: increment clock time
	tick() {
		// debug
		// console.log("atomicGLClock::tick");	
        var timeNow = new Date().getTime();
        if (this.lastTime != 0) {this.elapsed = timeNow - this.lastTime;}
        this.lastTime = timeNow;
    }
	// get()
	// output: elapsed time - float
	get(){
		// debug
		// console.log("atomicGLClock::get");	
		return this.elapsed;
	}
}