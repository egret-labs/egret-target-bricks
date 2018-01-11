// namespace egret {
//     export class BKSoundChannel extends egret.EventDispatcher implements egret.SoundChannel {

//         public _bkAudio: BK.Audio;

//         constructor() {
//             super();
//         }

//         volume: number;

//         position: number;

//         $loops: number;

//         $startTime: number;

//         $type: string;

//         $url: string;

//         $play() {
//             let _type: number;
//             switch (this.$type) {
//                 case egret.Sound.MUSIC:
//                     _type = 0;
//                     break;

//                 case egret.Sound.EFFECT:
//                     _type = 1;
//                     break;
//             }
//             let loops = this.$loops === 0 ? -1 : this.$loops;
//             this._bkAudio = new BK.Audio(_type, "Game://" + this.$url, loops, 0);
//             this._bkAudio.startMusic();
//         }

//         stop(): void {
//             this._bkAudio.stopMusic();
//         }
//     }
// }