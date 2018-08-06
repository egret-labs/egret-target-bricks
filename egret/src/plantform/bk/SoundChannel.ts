namespace egret {
    export class BKSoundChannel extends egret.EventDispatcher implements egret.SoundChannel {

        public _bkAudio: BK.Audio;

        constructor() {
            super();
        }

        volume: number;

        position: number;

        $loops: number;

        $startTime: number;

        $type: string;

        $url: string;

        $play() {
            if (!this._bkAudio) {
                let _type: number;
                switch (this.$type) {
                    case egret.Sound.MUSIC:
                        _type = 0;
                        break;

                    case egret.Sound.EFFECT:
                        _type = 1;
                        break;
                }
                let loops = this.$loops === 0 ? -1 : this.$loops;
                let musicPath;
                if ((this.$url.indexOf("GameRes://") >= 0) || (this.$url.indexOf("GameSandBox://") >= 0)) {
                    musicPath = this.$url;
                } else {
                    musicPath = "GameRes://" + this.$url;
                }
                this._bkAudio = new BK.Audio(_type, musicPath, loops, 0);
            }
            this._bkAudio.startMusic(() => {
                this.onPlayEnd();
            });
        }

        stop(): void {
            if (!this._bkAudio) {
                return;
            }
            this._bkAudio.stopMusic();
        }

        pause(): void {
            if (!this._bkAudio) {
                return;
            }
            this._bkAudio.pauseMusic();
        }

        resume(): void {
            if (!this._bkAudio) {
                return;
            }
            this._bkAudio.resumeMusic();
        }

        onPlayEnd() {
            this.dispatchEventWith(egret.Event.SOUND_COMPLETE);
        }
    }
}