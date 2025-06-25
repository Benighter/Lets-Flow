// Set NODE_ENV if not already set
if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'production'
}

const express = require('express')
const http = require('http')
var cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const path = require("path")
var xss = require("xss")

var server = http.createServer(app)
var io = require('socket.io')(server, {
	cors: {
		origin: [
			"http://localhost:3000",
			"http://localhost:8000",
			"https://lets-flow-connect-4lnvp13ps-benighters-projects.vercel.app",
			"https://lets-flow-connect-5szqlbprt-benighters-projects.vercel.app",
			"https://lets-flow-connect-od5wcu2dj-benighters-projects.vercel.app",
			"https://lets-flow-connect-2ym1necx3-benighters-projects.vercel.app",
			"https://lets-flow-connect.vercel.app"
		],
		credentials: true
	}
})

// Configure CORS for production
const corsOptions = {
	origin: [
		"http://localhost:3000",
		"http://localhost:8000",
		"https://lets-flow-connect-4lnvp13ps-benighters-projects.vercel.app",
		"https://lets-flow-connect-5szqlbprt-benighters-projects.vercel.app",
		"https://lets-flow-connect-od5wcu2dj-benighters-projects.vercel.app",
		"https://lets-flow-connect-2ym1necx3-benighters-projects.vercel.app",
		"https://lets-flow-connect.vercel.app"
	],
	credentials: true
}
app.use(cors(corsOptions))
app.use(bodyParser.json())

// Health check route
app.get('/', (req, res) => {
	res.json({
		status: 'OK',
		message: 'Let\'s Flow Connect Backend is running!',
		timestamp: new Date().toISOString()
	})
})

// API health check
app.get('/health', (req, res) => {
	res.json({ status: 'healthy', service: 'lets-flow-connect-backend' })
})

if(process.env.NODE_ENV==='production'){
	app.use(express.static(__dirname+"/build"))
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname+"/build/index.html"))
	})
}
app.set('port', (process.env.PORT || 4001))

sanitizeString = (str) => {
	return xss(str)
}

connections = {}
messages = {}
timeOnline = {}

// Store user information
let users = {}

io.on('connection', (socket) => {

	socket.on('join-call', (path, username) => {
		if(connections[path] === undefined){
			connections[path] = []
		}
		connections[path].push(socket.id)

		// Store user info
		users[socket.id] = {
			username: username || `User ${socket.id.substring(0, 6)}`,
			socketId: socket.id
		}

		timeOnline[socket.id] = new Date()

		// Send user info to all participants
		for(let a = 0; a < connections[path].length; ++a){
			io.to(connections[path][a]).emit("user-joined", socket.id, connections[path], users)
		}

		if(messages[path] !== undefined){
			for(let a = 0; a < messages[path].length; ++a){
				io.to(socket.id).emit("chat-message", messages[path][a]['data'],
					messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
			}
		}

		console.log(path, connections[path], users[socket.id])
	})

	socket.on('signal', (toId, message) => {
		io.to(toId).emit('signal', socket.id, message)
	})

	socket.on('chat-message', (data, sender) => {
		data = sanitizeString(data)
		sender = sanitizeString(sender)

		var key
		var ok = false
		for (const [k, v] of Object.entries(connections)) {
			for(let a = 0; a < v.length; ++a){
				if(v[a] === socket.id){
					key = k
					ok = true
				}
			}
		}

		if(ok === true){
			if(messages[key] === undefined){
				messages[key] = []
			}
			messages[key].push({"sender": sender, "data": data, "socket-id-sender": socket.id})
			console.log("message", key, ":", sender, data)

			for(let a = 0; a < connections[key].length; ++a){
				io.to(connections[key][a]).emit("chat-message", data, sender, socket.id)
			}
		}
	})

	socket.on('disconnect', () => {
		var diffTime = Math.abs(timeOnline[socket.id] - new Date())
		var key
		for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
			for(let a = 0; a < v.length; ++a){
				if(v[a] === socket.id){
					key = k

					for(let a = 0; a < connections[key].length; ++a){
						io.to(connections[key][a]).emit("user-left", socket.id)
					}

					var index = connections[key].indexOf(socket.id)
					connections[key].splice(index, 1)

					// Clean up user info
					delete users[socket.id]

					console.log(key, socket.id, Math.ceil(diffTime / 1000))

					if(connections[key].length === 0){
						delete connections[key]
					}
				}
			}
		}
	})
})

server.listen(app.get('port'), () => {
	console.log("listening on", app.get('port'))
})