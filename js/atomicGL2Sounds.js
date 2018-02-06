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

    playAmbiance(bgmusic, volume) {
        this.ambiancePlaying = this.ambiance.play(bgmusic);
        this.ambiance.volume(volume, this.ambiancePlaying);
    }

    // On pourrait passer l'objet pannerAttr en parm aussi mais ca ferait
    //bcp de choses dans le xml.
    playAmbiancePositional(sprite, volume, pos) {
        let id = this.ambiance.play(sprite);
        this.ambiance.once('play', () => {
            this.ambiance.volume(volume, id);
            this.ambiance.pos(pos[0], pos[1], pos[2], id);
            this.ambiance.loop(true, id);
            this.ambiance.pannerAttr({
                panningModel: 'HRTF',
                refDistance: 2.0,
                rolloffFactor: 2.5,
                distanceModel: 'exponential'
            }, id);
        });
    }

    //Load a json object located in ./sounds and make a Howler
    loadAmbianceHowl(jsonfile) {
        let json = this.loadJSON('./sounds/' + jsonfile);
        let howl = JSON.parse(json);
        this.ambiance = new Howl(howl);
    }

    loadSfxHowl(jsonfile) {
        let json = this.loadJSON('./sounds/' + jsonfile);
        let howl = JSON.parse(json);
        this.sfx = new Howl(howl);
    }

    // play an sfx at a random pos randomly spaced out in time (repeat parm)
    playSfxRandomized(sprite, vol = 0.5, repeat = 10000) {
        setTimeout(() => {
            //let x = Math.round(100 * (2.5 - (Math.random() * 5))) / 100;
            //let z = Math.round(100 * (2.5 - (Math.random() * 5))) / 100;
            let id = this.sfx.play(sprite);
            //this.sfx.pos(x, 0.7, z, id);
            this.sfx.volume(vol, id);
            this.playSfxRandomized(sprite);
        }, repeat + Math.round(Math.random() * repeat));
    }

    // Play a spatialized sfx at a given position
    playPositionalSfx(sprite, volume, pos) {
        let id = this.sfx.play(sprite);
        this.sfx.once('play', () => {
            this.sfx.volume(volume, id);
            this.sfx.pos(pos[0], pos[1], pos[2], id);
            this.sfx.loop(true, id);
            this.sfx.pannerAttr({
                panningModel: 'HRTF',
                refDistance: 0.8,
                rolloffFactor: 2.0,
                distanceModel: 'exponential'
            }, id);
        });
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