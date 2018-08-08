namespace egret {
  export class BKSound extends egret.EventDispatcher implements egret.Sound {

      type: string;

      length: number;

      private url: string;

      private _bKSoundChannel: BKSoundChannel;

      constructor() {
          super();
          this.type = egret.Sound.EFFECT;
      }
      /**
       * Background music
       * @default "music"
       * @version Egret 2.4
       * @platform Web,Native
       * @language en_US
       */
      /**
       * 背景音乐
       * @default "music"
       * @version Egret 2.4
       * @platform Web,Native
       * @language zh_CN
       */
      public static MUSIC: string = "music";

      /**
       * EFFECT
       * @default "effect"
       * @version Egret 2.4
       * @platform Web,Native
       * @language en_US
       */
      /**
       * 音效
       * @default "effect"
       * @version Egret 2.4
       * @platform Web,Native
       * @language zh_CN
       */
      public static EFFECT: string = "effect";

      load(url: string): void {
          if (url.indexOf('http://') >= 0 || url.indexOf('https://') >= 0) {
              //动态加载
              //根据url存储缓存的声音到沙盒中
              let sha1 = _sha1FromUrl(url);
              let soundUrl = "GameSandBox://webcache/sound" + sha1
              let buff = BK.FileUtil.readFile(soundUrl);
              if (buff && buff.length > 0) {
                  this._loadFromBuffer.call(this, soundUrl);
              } else {
                  var httpGet = new BK.HttpUtil(url);
                  httpGet.setHttpMethod("get")
                  httpGet.requestAsync(function (res, code) {
                      if (code == 200) {
                          (BK.FileUtil as any).writeBufferToFile(soundUrl, res);
                          this._loadFromBuffer.call(this, soundUrl);
                      } else {
                          console.log("BK http加载外部资源失败, url = " + url + ", code = " + code);
                          $callAsync(Event.dispatchEvent, IOErrorEvent, this, IOErrorEvent.IO_ERROR);
                      }
                  }.bind(this));
              }

          } else {
              this.url = url;
              if (BK.FileUtil.isFileExist(this.url)) {
                  $callAsync(Event.dispatchEvent, Event, this, Event.COMPLETE);
              }
              else {
                  $callAsync(Event.dispatchEvent, IOErrorEvent, this, IOErrorEvent.IO_ERROR);
              }
          }
      }


      private _loadFromBuffer(soundUrl: string) {
          this.url = soundUrl;
          $callAsync(Event.dispatchEvent, Event, this, Event.COMPLETE);
      }

      play(startTime: number = 0, loops: number = 0): egret.SoundChannel {
          if (!this._bKSoundChannel) {
              let channel = new BKSoundChannel();
              channel.$loops = loops;
              channel.$startTime = startTime;
              channel.$type = this.type;
              channel.$url = this.url;
              this._bKSoundChannel = channel;
          }
          this._bKSoundChannel.$play();
          return this._bKSoundChannel;
      }

      close(): void {
          if (this._bKSoundChannel) {
              this._bKSoundChannel.stop();
          }
      }
  }
  egret.Sound = BKSound as any;
}