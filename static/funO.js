function setUp(){
	//reader = document.getElementById("uploader");
	//reader.addEventListener("change", handleFiles, false);
	canvasMap = document.getElementById("map");
	canvasMapHid = document.getElementById("maphid");
	canvasMapSmall = document.getElementById("mapsSmall");
	ctxHid = canvasMapHid.getContext("2d");
	ctx = canvasMap.getContext("2d");
	ctxSmall = canvasMapSmall.getContext("2d");

	var rect = canvasMap.getBoundingClientRect();
	var originalRectangle = {};
	originalRectangle.width = rect.right - rect.left;
    originalRectangle.height = rect.bottom - rect.top;

	centerPoint = {'x' : originalRectangle.width/2,'y' : originalRectangle.height/2};//放大中心
	scale = 1;//放大倍率

	canvasStack = [[],""];
	canvasOldStack = {};
	getMap();
	lineRoughness = 1;
	lineColor = ["0","0","0"];
	changeColor();
}
function drawDrid(){
    ctxHid.beginPath();
    ctxHid.clearRect(0,0,canvasMapHid.width,canvasMapHid.height);

    for(var j = 0; j < canvasOldStack.length; j++){
    	if(!canvasOldStack[j]){
    		continue;
    	}
	    for(var i = 0; i < canvasOldStack[j][0].length; i++){
	    	ctxHid.beginPath();
	    	drawLine(canvasOldStack[j][0][i][0] ,canvasOldStack[j][0][i][1], canvasOldStack[j][0][i][2], canvasOldStack[j][0][i][3], canvasOldStack[j][0][i][4], canvasOldStack[j][0][i][5]);
	    	ctxHid.stroke();
	    }
    }

    for(var i = 0; i < canvasStack[0].length; i++){
		ctxHid.beginPath();
		drawLine(canvasStack[0][i][0] ,canvasStack[0][i][1], canvasStack[0][i][2], canvasStack[0][i][3], canvasStack[0][i][4], canvasStack[0][i][5]);
		ctxHid.stroke();
    }
    
	drawMagnifier(canvasMapHid);
}

function drawLine(startx, starty, endx, endy, roughness, color) {
	ctxHid.lineCap = 'round';
	//console.log(color);
	ctxHid.strokeStyle = "rgb("+color[0]+","+color[1]+","+color[2]+")";
	ctxHid.lineWidth = roughness;
    ctxHid.moveTo(startx, starty); 
    ctxHid.lineTo(endx, endy);
}
function realXY(x, y){
	var originalRectangle = {};
	var originalRectangleHid = {};
	var scaleGlassRectangle = {};
	var rect = canvasMap.getBoundingClientRect();
	var rectHid = canvasMapHid.getBoundingClientRect();

    originalRectangle.width = rect.right - rect.left;
    originalRectangle.height = rect.bottom - rect.top;
    originalRectangleHid.width = rectHid.right - rectHid.left;
    originalRectangleHid.height = rectHid.bottom - rectHid.top;

	var temp = {};
	temp.width = originalRectangle.width/originalRectangleHid.width;
	temp.height = originalRectangle.height/originalRectangleHid.height;

	var rx = (x - centerPoint.x + originalRectangleHid.width * temp.width * scale / 2) / scale / temp.width;
	var ry = (y - centerPoint.y + originalRectangleHid.height * temp.height * scale / 2) / scale / temp.height;
	
	//console.log([x,y,rx,ry]);
	return([rx,ry]);
}
function drawMagnifierSmall(canvasImg){			//複製兩個可縮放的canvas
	var originalRectangleHid = {};
	var originalRectangleSmall = {};
	var rectHid = canvasMapHid.getBoundingClientRect();
	var rectSmall = canvasMapSmall.getBoundingClientRect();

    originalRectangleHid.x = 0;
    originalRectangleHid.y = 0;
    originalRectangleHid.width = rectHid.right - rectHid.left;
    originalRectangleHid.height = rectHid.bottom - rectHid.top;

    originalRectangleSmall.x = 0;
    originalRectangleSmall.y = 0;
    originalRectangleSmall.width = rectSmall.right - rectSmall.left;
    originalRectangleSmall.height = rectSmall.bottom - rectSmall.top;

	ctxSmall.clearRect(0,0,originalRectangleSmall.width,originalRectangleSmall.height);
	ctxSmall.drawImage(canvasImg,
	    originalRectangleHid.x, originalRectangleHid.y,
	    originalRectangleHid.width, originalRectangleHid.height,

	    originalRectangleSmall.x, originalRectangleSmall.y,
	    originalRectangleSmall.width, originalRectangleSmall.height
	);
}
function drawMagnifier(canvasImg){			//複製兩個可縮放的canvas

	var originalRectangle = {};
	var originalRectangleHid = {};
	var scaleGlassRectangle = {};
	var rect = canvasMap.getBoundingClientRect();
	var rectHid = canvasMapHid.getBoundingClientRect();
	
	originalRectangle.x = 0;
    originalRectangle.y = 0;
    originalRectangle.width = rect.right - rect.left;
    originalRectangle.height = rect.bottom - rect.top;

    originalRectangleHid.x = 0;
    originalRectangleHid.y = 0;
    originalRectangleHid.width = rectHid.right - rectHid.left;
    originalRectangleHid.height = rectHid.bottom - rectHid.top;

    scaleGlassRectangle.x = centerPoint.x - originalRectangle.width * scale / 2;
    scaleGlassRectangle.y = centerPoint.y - originalRectangle.height * scale / 2;
    scaleGlassRectangle.width = originalRectangle.width * scale;
	scaleGlassRectangle.height = originalRectangle.height * scale;
	
	/*console.log("originalRectangle",originalRectangle,
				"\noriginalRectangleHid",originalRectangleHid,
				"\nscaleGlassRectangle",scaleGlassRectangle)
	*/


	ctx.clearRect(0,0,originalRectangle.width,originalRectangle.height);
	ctx.fillStyle = 'rgb(255,221,0)';
	ctx.fillRect(0,0,originalRectangle.width-10,originalRectangle.height-10);
	ctx.clearRect(scaleGlassRectangle.x,scaleGlassRectangle.y,
				scaleGlassRectangle.width,scaleGlassRectangle.height);
	ctx.drawImage(canvasImg,
	    originalRectangleHid.x, originalRectangleHid.y,
	    originalRectangleHid.width, originalRectangleHid.height,

	    scaleGlassRectangle.x, scaleGlassRectangle.y,
	    scaleGlassRectangle.width, scaleGlassRectangle.height
	);
}
function CtrlZEvent(){
    rebackSocket();
}











function newMap(){
	allObjJson = {};
	allObjJson["name"] = prompt('輸入地圖名稱','');
	allObjJson["size"] = [];
	allObjJson["size"][0] = parseInt(prompt('輸入地圖大小X',''));
	allObjJson["size"][1] = parseInt(prompt('輸入地圖大小Y',''));
	allObjJson["src"] = prompt('輸入地圖背景連結','');
	allObjJson["object"] = {};

	var sizeX = canvasMapHid.width / (allObjJson["size"][0]);
	var sizeY = canvasMapHid.height / (allObjJson["size"][1]);
	if(sizeX < sizeY){
    	size = sizeX;
    }else{
    	size = sizeY;
    }
    centerPoint = {"x":allObjJson["size"][0]*sizeX/2,"y":allObjJson["size"][1]*sizeY/2};
	scale = 1;
	drawDrid();
}
function newObj(){
	drawDrid();
}
function handleFiles() {
		var files = document.getElementById('uploader').files;
		if (!files.length) {
			alert('Please select a file!');
			return;
		}
		var file = files[0];
		var start = 0;
		var stop = file.size - 1;
		var reader = new FileReader();
		reader.onloadend = function(evt) {
			if (evt.target.readyState == FileReader.DONE) {
			    var content = evt.target.result;
			    var objJson = JSON.parse(content);
			    allObjJson = objJson;
			    for(i in allObjJson["object"]){
			    	img[i] = new Image();
			    	img[i].src = allObjJson["object"][i][3];
			    }
				var sizeX = canvasMapHid.width / (allObjJson["size"][0]);
				var sizeY = canvasMapHid.height / (allObjJson["size"][1]);
				if(sizeX < sizeY){
			    	size = sizeX;
			    }else{
			    	size = sizeY;
			    }
			    centerPoint = {"x":allObjJson["size"][0]*sizeX/2,"y":allObjJson["size"][1]*sizeY/2};
				scale = 1;
			    img["background"] = new Image();
			    img["background"].src = allObjJson["src"];
			    drawDrid();
			}
		};
		var blob = file.slice(start, stop + 1);
		reader.readAsBinaryString(blob,'utf-8');
}
function saveTextAsFile( _fileName, _text ) {
	var textFileAsBlob = new Blob([_text], {type:'text/plain'});
	var downloadLink = document.createElement("a");
	downloadLink.download = _fileName;
	downloadLink.innerHTML = "Download File";
	if (window.webkitURL != null) {
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	}
	else {
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}
	downloadLink.click();
}
function destroyClickedElement(event) {
	document.body.removeChild(event.target);
}
