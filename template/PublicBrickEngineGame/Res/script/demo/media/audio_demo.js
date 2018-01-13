/*
    播放声音
    @type 类型 0表示背景音乐，1表示特效音乐
    @musicPath 音乐路径
    @loopCount 重复次数 -1为循环播放
*/
BK.Audio.playMusic(0,'GameRes://script/demo/tinyfly/music/race_background.mp3',1)

/*
    设置开关
*/ 
BK.Audio.switch = true; 

/*
    获取开关
*/
var s = BK.Audio.switch




/****旧接口****/
//播放
BK.Audio.switch = true;
BK.Audio.playMusic(0,'GameRes://script/demo/tinyfly/music/race_background.mp3',1)

//停止 (会停止所有声音)
BK.Audio.switch = false;

//恢复 
//旧接口不支持恢复，暂只能重新播放





/****新接口****/
/*
    播放声音
    @type 类型 0表示背景音乐，1表示特效音乐
    @musicPath 音乐路径
    @loopCount 重复次数 -1为循环播放
*/
var handle = new BK.Audio(0,'GameRes://script/demo/tinyfly/music/race_background.mp3',1)

//播放
handle.startMusic();

//暂停
handle.pauseMusic();

//继续播放
handle.resumeMusic();

//停止播放
handle.stopMusic();

//暂停所有声音
BK.Audio.switch = false;