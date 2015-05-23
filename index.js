navigator.getUserMedia  = navigator.getUserMedia ||
									   navigator.webkitGetUserMedia ||
									   navigator.mozGetUserMedia ||
									   navigator.msGetUserMedia;
if (screen.orientation != 'undefined' && screen.orientation )screen.orientation.lock('landscape');
			
var reslt = document.getElementById('reslt');			
var video = document.getElementById('cam');
var cR = document.getElementById('cR');
var cG = document.getElementById('cG');
var cB = document.getElementById('cB');
var ctxR = cR.getContext('2d');
var ctxG = cG.getContext('2d');
var ctxB = cB.getContext('2d');
ctxR.imageSmoothingEnabled = false;
ctxB.imageSmoothingEnabled = false;
ctxG.imageSmoothingEnabled = false;
var S = null;

var camsource = 0;
var camsources = [];

function ChangeCam(){
	camsource = (camsource + 1) % camsources.length;
	if (navigator.getUserMedia) {
		navigator.getUserMedia({audio: false, video: {optional: [{sourceId: camsources[camsource].id}]}}, function(stream) {
			video.src = window.URL.createObjectURL(stream);
			S = stream;
			iV =  setInterval(rF,200);
		},function(e){console.log(e)});
	} 
}

MediaStreamTrack.getSources(gotSource);


function gotSource(sources){
	for (var i = 0; i !== sources.length; ++i) {
		var s = sources[i];
		if (s.kind == 'video') {camsources.push(s);}
	}
	ChangeCam();
}

var iV = 0 ;

function rF(){
	if(S){
		try{
			ctxR.drawImage(video,0,0,cR.width,cR.height);
			ctxR.putImageData(Filters.Color(Filters.getPixels('R'),0),0,0);
			qrcode.decode(cR.toDataURL(),'r');
			ctxG.drawImage(video,0,0,cG.width,cG.height);
			ctxG.putImageData(Filters.Color(Filters.getPixels('G'),1),0,0);
			qrcode.decode(cG.toDataURL(),'g');
			ctxB.drawImage(video,0,0,cB.width,cB.height);
			ctxB.putImageData(Filters.Color(Filters.getPixels('B'),2),0,0);
			qrcode.decode(cB.toDataURL(),'b');
		}
		catch(ex){
			console.log('err',ex.message,ex.stack)
		}
	}
}

var canvasd = document.getElementById('canvasd');

var cintv = -1;
function showCanvas(){
	canvasd.style.visibility = 'visible';
	cintv = setTimeout(function(){canvasd.style.visibility = 'hidden';},4000);
}

var rRes = null;
var gRes = null;
var bRes = null;
var lastRes = null;
var resintv = -1;
var resl = "";
function f(data,color){
	eval(color+'Res = "'+data+'";');
	console.log(color+'Res = "'+data+'";');
	if(rRes != null &&gRes != null &&bRes != null)
	{
		var res = rRes + gRes + bRes;
		if(lastRes != res)
		{
			resl = res;
			rRes = null;
			gRes = null;
			bRes = null;
			if(resintv != -1) clearInterval(resintv);
			resintv = setTimeout(function(){if(lastRes == resl){lastRes = null;reslt.innerHTML = "cQR bulunamadı.";reslt.style.visibility = 'hidden';}},4000);
			lastRes = res;
			reslt.innerHTML = res;
			reslt.style.visibility = 'visible';
		}
	}
}

qrcode.callback = f;

Filters = {};
Filters.getPixels = function(c) {
	var ca = eval('c'+c);
	return eval('ctx'+c).getImageData(0,0,ca.width,ca.height);
};

Filters.Color = function(pixels, c) {
  var d = pixels.data;
  for (var i=0; i<d.length; i+=4) {
	var v = d[i+c] > 127 ? 255:0;
    d[i] = d[i+1] = d[i+2] = v;
  }
  return pixels;
};

