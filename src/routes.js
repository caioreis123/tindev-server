const express = require("express") //import the express framework
const DevController = require("./controllers/DevController")
const LikeController = require("./controllers/LikeController")
const DislikeController = require("./controllers/DislikeController")

const routes = express.Router() //uses express to create routes

//each route is created with a the corresponding request and response

//the res.json is sending an object as a response to the client's request

//the request can be in the header, which means the url like: http:localhost:3333?name=Caio
//everything after the ? is the query that can be accessed by the req.query

routes.get("/", (req, res) => {
	return res.json({
		message: `Hello my friend ${req.query.name}`,
	})
})

//the post method is to create a new information.
//the store method at the end of the controllers is to call the main function there

//here we crate a new user
routes.post("/devs", DevController.store)

//here we list all the devs that we did not liked or disliked yet.
//The route can be the same since it is a different http method.
routes.get("/devs", DevController.index)

//here we create a new like relation. The id of the liked dev will be in the address bar, while the id of the one who
//who is liking will be in the header of the request
routes.post("/devs/:devId/likes", LikeController.store)

routes.post("/devs/:devId/dislikes", DislikeController.store)

module.exports = routes
