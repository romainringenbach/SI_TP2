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
            src: ["sfx.webm", "sfx.ogg"],
            sprite: {
                "apresmidi": [
                    0,
                    4029.387755102041
                ],
                "balles": [
                    6000,
                    4630.204081632652
                ],
                "cheveux": [
                    12000,
                    8626.938775510205
                ],
                "chips": [
                    22000,
                    7451.428571428572
                ],
                "discuter": [
                    31000,
                    5100.408163265307
                ],
                "duel": [
                    38000,
                    4708.548752834467
                ],
                "fringues": [
                    44000,
                    2488.16326530612
                ],
                "gene": [
                    48000,
                    10899.56916099773
                ],
                "gentil": [
                    60000,
                    3768.1632653061215
                ],
                "megachiasse": [
                    65000,
                    9280.000000000002
                ],
                "muscle": [
                    76000,
                    2775.4875283446695
                ],
                "partouzeurs": [
                    80000,
                    3585.3061224489834
                ],
                "premier": [
                    85000,
                    14739.569160997731
                ],
                "tendre": [
                    101000,
                    3193.4693877551013
                ],
                "tolerance": [
                    106000,
                    18161.60997732426
                ],
                "tranquille": [
                    126000,
                    1626.1224489795864
                ]
            },
            volume: 0.5
        });
        this.themes = new Howl({
            src: ["themes.webm", "themes.ogg"],
            sprite: {
                "harmonica": [
                    0,
                    210153.6054421769
                ],
                "JazzMusic": [
                    212000,
                    242104.26303854876
                ],
                "PianoSong": [
                    456000,
                    166024.10430839006
                ],
                "psychedelic": [
                    624000,
                    282181.88208616775
                ]
            },
            volume: 0.5,
            preload: true
        });

        this._theme;
        this._sfx;

        this.playTheme();
    }

    playTheme(sprite) {
        this._theme = this.themes.play(sprite);
    }

}

export default atomicGL2Sounds;