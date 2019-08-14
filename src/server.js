const express = require("express") //import the express framework
const mongoose = require("mongoose") //import mongoose to allow write JavaScript to interact with the Database
const cors = require("cors")

const routes = require("./routes")

const httpServer = express() //creates a server with the express framework. This server only understand HTTP protocol

const fullServer = require("http").Server(httpServer)
//this http is a built in node module that we are importing and combining with the httpServer we built from express

const io = require("socket.io")(fullServer)
//this importation can return a function that receives a server that in this case is just the HTTP server
// but after this importation our server will be able to work with the websocket protocol too.
//The websocket protocol allows messages from the backend to the frontend in real time.
//The HTTP works with requests, so the frontend would have to request this info from the backend.

const connectedUsers = {
	//userId:socketId
	//which means:
	//0219e012093120:2901ujs012j90
}

io.on("connection", (socket) => {
	const { user } = socket.handshake.query
	//this will access the userId from the server

	connectedUsers[user] = socket.id
	//will create a key value pair into the connectedUsers object

	console.log(user, socket.id)
	socket.on("some communication title", (message) => {
		console.log(message)
	})
	socket.emit("backendSalut", {
		message: "hello from the server",
	})
})
//so every time someone connects using the websocket protocol we run this on function of the io api
//to create the websocket connection. The first argument 'connection' is a built in  to listen to any connection.
//The on method is to listen. Latter we listen to a message named 'some communication title' and printing its content.
//The emit method is to send a message to someone listen to it with the on method.

httpServer.use(express.json()) //Teaches express to read json.
//This is mandatory since we are receiving json format in the body of the request of our routes.

mongoose.connect("mongodb+srv://caio:rocketseat@cluster0-rhxod.mongodb.net/omnistack8?retryWrites=true&w=majority", {
	useNewUrlParser: true,
})
//this url you get in the mongodb atlas and this mongoose method is going to connect this server to the database inside
//of the atlas cluster you created and set up admin and whitelisted ip

httpServer.use((req, res, next) => {
	req.io = io
	req.connectedUsers = connectedUsers
	return next()
})
//any requesting is going to be passed first here and then go to the routes
//this will allow the like controller to access anything we put inside the req, like the io and the connectedUsers.
// The io is inserted to avoid another import in the like controller.
//the next parameter is called at the end to make the app keep running

httpServer.use(cors()) //cors allows the access of this server from anyone, including our react frontend
httpServer.use(routes) //To use the routes created in another file

console.log("the server is running") //the console.log will be displayed in the terminal while the server is running

fullServer.listen(3333) //sets the port to be listen to.

//To run the server type in terminal:
//node src/server
// Then to access the server go http://localhost:3333
