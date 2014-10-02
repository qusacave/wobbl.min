
//  ミュートされていたら true
var nowMute = true;

//------------------------------------------------------------------------------
//  照度を色の256*256*256段階に変換
//------------------------------------------------------------------------------
lx2Rgb = function( lx ) {
    if(lx > 1200) {
        return 0;
    }
    else {
        rgbValue = 16777215 - (lx/1200) * 16777215;
        return rgbValue;
    }
};


//------------------------------------------------------------------------------
//  照度センサーの値が変わると呼ばれる関数
//
//  lx 明るさ (単位ルクス)
//------------------------------------------------------------------------------
changeScreen = function( lx ) {

    //  文字の色を変化させて、数字を変化させる
    var RGB = lx2Rgb(lx);
    var txRGB = 'rgb('+ parseInt(RGB/65536) +','+ parseInt((RGB/256)%256) +','+ parseInt(RGB%256) +')';
    //console.log(txRGB);
    document.getElementById("print_lx").style.color = txRGB;
    document.getElementById("print_lx").innerHTML = lx + '[lx]';

    //  背景を変化させる
    var iRGB = 16777215 - RGB
    bgRGB = 'rgb('+ parseInt(iRGB/65536) +','+ parseInt((iRGB/256)%256) +','+ parseInt(iRGB%256) +')';
    document.body.style.backgroundColor = bgRGB;
};


//------------------------------------------------------------------------------
//  ミュートボタンが押された
//------------------------------------------------------------------------------
onMuteButton = function() {

    // 　ミュートしてなかったらミュートする
    if( nowMute ) {
        setMute( false );
	    nowMute = false;
        document.getElementById("imgButton").src = "resource/unmute.png";
    }

    //  ミュート状態だったらミュートにする
    else {
	    setMute( true );
	    nowMute = true;
        document.getElementById("imgButton").src = "resource/mute.png";
    }
};


//------------------------------------------------------------------------------
//  キーを並べる
//------------------------------------------------------------------------------
/*
//  SVGで書こうとした跡地
keys = function( baseWidth ){
    console.log("keys")
    var svg = document.getElementById("keys");
    svg.setAttribute( "width", baseWidth );
    svg.setAttribute( "height", baseWidth*3 );
    var circle = document.createElementNS("http://www.w3.org/2000/svg" , "circle");
    circle.setAttribute( "cx", baseWidth*0.5 );
    circle.setAttribute( "cy", baseWidth*0.5 );
    circle.setAttribute( "r", baseWidth*0.45 );
    svg.appendChild(circle);
}
*/
//  画面幅に合わせてボタンの大きさを変えられるようにしたかった
//  完全にブラウザで表示したとき用
var onclickPos = [0, 0];
var baseWidth;
updateWindow = function(){
    var wd = window.innerWidth;
    var ht = window.innerHeight - 80;
    (wd<ht) ? (baseWidth=wd) : (baseWidth=ht);
    console.log(baseWidth);
    keys();
};

//  ボタンを4つずつ配置する
keys = function(){
    var nKeys = Math.ceil( pitch.length/4 );
    var keyWidth = baseWidth/4;

    var cnv = document.getElementById("keys");
    cnv.setAttribute( "width", baseWidth );
    cnv.setAttribute( "height", baseWidth*(nKeys/4) );
    var ctx=cnv.getContext("2d");
    ctx.textAlign = "center";

    for(i=0; i<nKeys; i++){
        for(j=0; j<4; j++){
            ctx.beginPath();
            var x = keyWidth*0.5 + keyWidth*j;
            var y = keyWidth*0.5 + keyWidth*i;
            ctx.arc(x, y, keyWidth*0.45, 0, Math.PI*2, true);

            if(onclickPos[0]==i && onclickPos[1]==j){
                grad = ctx.createRadialGradient(x, y, keyWidth*0.38, x, y, keyWidth*0.44);
                grad.addColorStop(0, "#f7f7f7");
                grad.addColorStop(0.5, "#e0e0e0");
                grad.addColorStop(0.75, "#a0a0a0");
                grad.addColorStop(1, "rgba(128, 128, 128, 0)");
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.fillStyle = "#c0c0c0";
            }
            else{
                grad = ctx.createRadialGradient(x, y, keyWidth*0.38, x, y, keyWidth*0.44);
                grad.addColorStop(0, "#c7c7c7");
                grad.addColorStop(0.5, "#b0b0b0");
                grad.addColorStop(0.75, "#707070");
                grad.addColorStop(1, "rgba(128, 128, 128, 0)");
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.fillStyle = "#909090";
            }
            ctx.fillText(pString[4*i+j], x, y+3);
        }
    }

//  ここからクリックしたときの処理
    cnv.onclick = ( function(e){
        var rect = e.target.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        //console.log(mouseX, mouseY);

        for(i=0; i<nKeys; i++){
            for(j=0; j<4; j++){
                if(j*keyWidth<=mouseX && mouseX<(j+1)*keyWidth){
                    if(i*keyWidth<=mouseY && mouseY<(i+1)*keyWidth){
                        changePitch( 4*i+j );
                        onclickPos = [i, j];
                        updateWindow();
                    }
                }
            }
        }
    } );
};

//  起動時と画面幅が変わったら再描画する
onload = updateWindow;
window.onresize = updateWindow;
