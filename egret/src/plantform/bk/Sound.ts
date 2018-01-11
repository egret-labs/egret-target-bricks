// namespace egret {
//     export class BKSound extends egret.EventDispatcher implements egret.Sound {

//         type: string;

//         length: number;

//         private url: string;

//         constructor() {
//             super();
//             this.type = egret.Sound.EFFECT;
//         }
//         /**
//          * Background music
//          * @default "music"
//          * @version Egret 2.4
//          * @platform Web,Native
//          * @language en_US
//          */
//         /**
//          * 背景音乐
//          * @default "music"
//          * @version Egret 2.4
//          * @platform Web,Native
//          * @language zh_CN
//          */
//         public static MUSIC: string = "music";

//         /**
//          * EFFECT
//          * @default "effect"
//          * @version Egret 2.4
//          * @platform Web,Native
//          * @language en_US
//          */
//         /**
//          * 音效
//          * @default "effect"
//          * @version Egret 2.4
//          * @platform Web,Native
//          * @language zh_CN
//          */
//         public static EFFECT: string = "effect";

//         load(url: string): void {
//             this.url = url;
//         }

//         play(startTime: number = 0, loops: number = 0): egret.SoundChannel {
//             let channel = new BKSoundChannel();
//             channel.$loops = loops;
//             channel.$startTime = startTime;
//             channel.$type = this.type;
//             channel.$url = this.url;
//             channel.$play();
//             return channel;
//         }
        
//         close(): void {

//         }
//     }
//     egret.Sound = BKSound as any;
// }