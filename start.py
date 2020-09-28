from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_socketio import send, emit
import random
import string

app = Flask(__name__ ,
			template_folder='template',
			static_folder='static',
			static_url_path='')
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
	return render_template('index.html')

@socketio.on('sendJSON')
def sendJSON(info):
	data = info['data']
	paintStack.append(data)
	#print('received json: ' + str(data['data']))
	emit("newJSON", info, broadcast=True)

@socketio.on('getToken')
def getToken():
	emit("receiveToken", "".join(random.sample(charList, 10)).replace(" ",""))

@socketio.on('getMap')
def getMap():
	emit("receiveMap", paintStack)

@socketio.on('reback')
def reback(info):
	tempToken = -1
	for i in range(len(paintStack)-1, -1, -1):
		if(paintStack[i][1] == info['token']):
			tempToken = i
			break
	if(tempToken == -1):
		return
	#print(tempToken)
	paintStack.pop(tempToken)
	#print(len(paintStack))
	emit("reback", tempToken, broadcast=True)


if __name__ == '__main__':
	charList = []
	for i in range(0, 200):
		charList.append(chr(i))
	paintStack = []
	socketio.run(app, host = '0.0.0.0', port = 8888, debug=True)