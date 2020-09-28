socket = io();
socket.emit('getToken');

function getMap(){
	socket.emit('getMap');
	socket.on('receiveMap', function(info) {
		console.log("receiveMap", info);
		canvasOldStack = info;
	});
}
function sendJSON(json){
	socket.emit('sendJSON', {"data" : json});
}
function rebackSocket(){
	socket.emit('reback', {"token" : myToken});
}
socket.on('newJSON', function(info) {
	canvasOldStack.push(info['data']);
});
socket.on('receiveToken', function(data) {
    myToken = data;
	console.log(data);
});
socket.on('reback', function(info) {
	//console.log(info);
	canvasOldStack.remove(info);
	//console.log("length",canvasOldStack.length);
});