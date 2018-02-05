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
            src: ["sfx.webm"],
            sprite: {
                balles: [
                    0,
                    4623.673469387755
                ],
                discuter: [
                    6000,
                    5093.877551020409
                ],
                nightambiance: [
                    13000,
                    99056.32653061223
                ],
                owl: [
                    114000,
                    9961.360544217683
                ],
                wolf: [
                    125000,
                    4046.8027210884256
                ]
            },
            volume: 0.5
        });
        this.themes = new Howl({
            src: ['./sounds/themes.webm', './sounds/themes.ogg'],
            sprite: {
                harmonica: [
                    0,
                    210153.6054421769
                ],
                JazzMusic: [
                    212000,
                    242104.26303854876
                ],
                PianoSong: [
                    456000,
                    166024.10430839006
                ],
                psychedelic: [
                    624000,
                    282181.88208616775
                ]
            },
            //html5: true,
            volume: 0.5,
            preload: true,
            loop: true
        });

        document.getElementById('SoundBtn').addEventListener('click', this.mute.bind(this), false);
        this.muted = false;
        this.bgplaying;

        this.ambiance = this.sfx.play('nightambiance');
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
        setTimeout( () => {
            let x = Math.round(100 * (2.5 - (Math.random() * 5))) / 100;
            let z = Math.round(100 * (2.5 - (Math.random() * 5))) / 100;
        
            let id = this.sound.play(sfx);

            this.sound.pos(x, 5.0, z, id);
            this.sound.volume(1, id);
            
            this.randomsfx(sfx);
        }, 5000 + Math.round(Math.random() * 10000));
    }

    mute() {
        this.muted = !this.muted;
        Howler.mute(this.muted);
    }

}

export default atomicGL2Sounds;