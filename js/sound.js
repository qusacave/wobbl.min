//------------------------------------------------------------------------------
//  音が鳴るように準備する
//------------------------------------------------------------------------------

//  音階を設定
var pitch = [
    110 * Math.pow( 1.06, 3 ),  //  ド
    110 * Math.pow( 1.06, 4 ),  //  ド#
    110 * Math.pow( 1.06, 5 ),  //  レ
    110 * Math.pow( 1.06, 6 ),  //  レ#
    110 * Math.pow( 1.06, 7 ),  //  ミ
    110 * Math.pow( 1.06, 8 ),  //  ファ
    110 * Math.pow( 1.06, 9 ),  //  ファ#
    110 * Math.pow( 1.06,10 ),  //  ソ
    110 * Math.pow( 1.06,11 ),  //  ソ#
    220,                        //  ラ
    220 * Math.pow( 1.06, 1 ),  //  ラ#
    220 * Math.pow( 1.06, 2 ),  //  シ
    220 * Math.pow( 1.06, 3 ), //  ド
    220 * Math.pow( 1.06, 4 ), //  ド#
    220 * Math.pow( 1.06, 5 ), //  レ
    220 * Math.pow( 1.06, 6 ), //  レ#
    220 * Math.pow( 1.06, 7 ), //  ミ
    220 * Math.pow( 1.06, 8 ), //  ファ
    220 * Math.pow( 1.06, 9 ), //  ファ#
    220 * Math.pow( 1.06,10 ), //  ソ
    220 * Math.pow( 1.06,11 ), //  ソ#
    440,                        //  ラ
    440 * Math.pow( 1.06, 1 ),  //  ラ#
    440 * Math.pow( 1.06, 2 ),   //  シ
    440 * Math.pow( 1.06, 3 ) 
];

//  ボタンに表示する文字を設定
var pString = [
    "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
    "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
    "C5"
];

var freq = 220; //起動時の周波数

//  detuneした音2本を重ねて厚みを増やす
//  Oscは3つとも同じFltに接続している
//  FltはAmpに接続している
//  AmpはOutに接続している
//  ありきたりな減算シンセのフローだ
var gAudioContext = new AudioContext();
var gOscillatorNode0 = gAudioContext.createOscillator();
var gOscillatorNode1 = gAudioContext.createOscillator();
var gOscillatorNode2 = gAudioContext.createOscillator();
var gFilterNode = gAudioContext.createBiquadFilter();
var gGainNode = gAudioContext.createGain();

gOscillatorNode0.connect( gFilterNode );
gOscillatorNode1.connect( gFilterNode );
gOscillatorNode2.connect( gFilterNode );
gFilterNode.connect( gGainNode);
gGainNode.connect( gAudioContext.destination );

gGainNode.gain.value = 0;

gFilterNode.type = 0;
gFilterNode.Q.value = 20;

gOscillatorNode0.type = "sawtooth";
gOscillatorNode1.type = "sawtooth";
gOscillatorNode2.type = "sawtooth";
gOscillatorNode0.frequency.value = freq;
gOscillatorNode1.frequency.value = freq;
gOscillatorNode2.frequency.value = freq;
gOscillatorNode0.detune.value = -10;
gOscillatorNode2.detune.value = 10;
gOscillatorNode0.start(0);
gOscillatorNode1.start(0);
gOscillatorNode2.start(0);

//------------------------------------------------------------------------------
//  照度を 0 から 500 の間におさめる
//------------------------------------------------------------------------------
limit = function( lx ){
    if( lx > 500 ) return 500;
    else return lx;
};

//------------------------------------------------------------------------------
//  照度センサーの値が変わると呼ばれる関数
//  cutoff frequency を操作する.
//  lx 明るさ (単位ルクス)
//------------------------------------------------------------------------------
changeCof = function( lx ) {
    var cof = 5*limit(lx);
    gFilterNode.frequency.value = 2*freq + cof;
    //console.log(2*freq + cof);
};

//------------------------------------------------------------------------------
//  画面がクリックされたら呼ばれる
//------------------------------------------------------------------------------
changePitch = function( key ){
    console.log(key);
    if(key<pitch.length){
        freq = pitch[ key ];
        gOscillatorNode0.frequency.value = freq;
        gOscillatorNode1.frequency.value = freq;
        gOscillatorNode2.frequency.value = freq;
    }
};

//------------------------------------------------------------------------------
//  ミュートする
//
//  mute が true だったら音量を0にして false だったら音量を 1 にする
//------------------------------------------------------------------------------
setMute = function( mute ){
    if(mute == true) gGainNode.gain.value = 0;
    else gGainNode.gain.value = 1;
};
