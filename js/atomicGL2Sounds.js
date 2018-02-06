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

        this.sfx = new Howl({
            src: ['./sounds/sfx.webm'],
            sprite: {
                balles: [
                    0,
                    4623.673469387755
                ],
                discuter: [
                    6000,
                    5093.877551020409
                ],
                owl: [
                    13000,
                    10004.897959183672
                ],
                wolf: [
                    25000,
                    4046.8027210884366
                ]
            },
            preload: true,
            volume: 1.0
        });
        this.background = new Howl({
            "src": ["./sounds/background.webm"],
            "sprite": {
                "harmonica": [
                    0,
                    210147.1201814059
                ],
                "nightambiance": [
                    212000,
                    99056.32653061223
                ],
                "PianoSong": [
                    313000,
                    166017.59637188207
                ]
            },
            //html5: true,
            volume: 0.3,
            preload: true,
            loop: true
        });

        document.getElementById('SoundBtn').addEventListener('click', this.mute.bind(this), false);
        this.muted = false;
        this.bgplaying;

        this.ambiance = this.background.play('nightambiance');
        this.randomsfx('owl');
        this.randomsfx('wolf');
    }

    playTheme(bgmusic) {
        if (this.bgplaying) {
            this.themes.fade(this.themes.volume(this.bgplaying), 0.0, 1100, this.bgplaying);
            this.themes.once('fade', () => {
                this.themes.stop(this.bgplaying);
                this.bgplaying = this.themes.play(bgmusic);
            }, this.bgplaying);
        } else {
            this.bgplaying = this.themes.play(bgmusic);
        }
    }

    randomsfx(sfx) {
        setTimeout(() => {
            let x = Math.round(100 * (2.5 - (Math.random() * 5))) / 100;
            let z = Math.round(100 * (2.5 - (Math.random() * 5))) / 100;

            let id = this.sfx.play(sfx);

            this.sfx.pos(x, 5.0, z, id);
            // this.sfx.volume(1, id);

            this.randomsfx(sfx);
        }, 10000 + Math.round(Math.random() * 10000));
    }

    mute() {
        this.muted = !this.muted;
        Howler.mute(this.muted);
    }

}

export default atomicGL2Sounds;