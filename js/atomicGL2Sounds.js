// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 0.1
// current version date: 2018/02/01
//----------------------------------------------------------------------------------------
// atomicGL2Sounds
//----------------------------------------------------------------------------------------

class atomicGL2Sounds {

    constructor() {
        // Setup listener for the sound button
        document.getElementById('SoundBtn').addEventListener('click', this.mute.bind(this), false);
        this.muted = false;
        this.ambiance;
        this.sfx;
        this.ambiancePlaying;
    }

    playTheme(bgmusic) {
        if (this.ambiancePlaying) {
            this.ambiance.fade(this.ambiance.volume(this.ambiancePlaying), 0.0, 1100, this.ambiancePlaying);
            this.ambiance.once('fade', () => {
                this.ambiance.stop(this.ambiancePlaying);
                this.ambiancePlaying = this.ambiance.play(bgmusic);
            }, this.ambiancePlaying);
        } else {
            this.ambiancePlaying = this.ambiance.play(bgmusic);
        }
    }

    //Load a json object located in ./sounds and make a Howler
    loadAmbianceHowl(jsonfile) {
        let json = this.loadJSON('./sounds/'+jsonfile);
        let howl = JSON.parse(json);
        this.ambiance = new Howl(howl);
    }

    loadSfxHowl(jsonfile) {
        let json = this.loadJSON('./sounds/'+jsonfile);
        let howl = JSON.parse(json);
        this.sfx = new Howl(howl);
    }

    // play an sfx at a random pos randomly spaced out in time (repeat parm)
    playSfxRandomized(sprite, repeat=10000) {
        console.log(sprite);
        setTimeout(() => {
            let x = Math.round(100 * (2.5 - (Math.random() * 5))) / 100;
            let z = Math.round(100 * (2.5 - (Math.random() * 5))) / 100;
            let id = this.sfx.play(sprite);
            this.sfx.pos(x, 3.0, z, id);
            // this.sfx.volume(1, id);
            this.playSfxRandomized(sprite);
        }, repeat + Math.round(Math.random() * repeat));
    }

    mute() {
        this.muted = !this.muted;
        Howler.mute(this.muted);
    }

    loadJSON(jsonPath) {
        let jsonObj = new XMLHttpRequest();
        jsonObj.overrideMimeType("application/json");
        jsonObj.open('GET', jsonPath, false);
        jsonObj.send(null);
        return jsonObj.responseText;
    }

}

export default atomicGL2Sounds;