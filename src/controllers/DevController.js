//the controller receives the requests made by the client and send it the response
//to do that we will import the controllers in the routes.js and call them as the second argument
//of the routes.get or routes.post instead of the (req,res)=>return res.json
//the store function is going to do what the anonymous arrow function did inside the route previously.

const axios = require("axios")
//the axios is needed to interact with external APIs.
//Axios has a .get method that receives an url argument and gets the whole json that is displayed when we access this url.
//Axios always stores this json inside a data object before putting in the desired variable.

//The Axios get method does not receives the json right away, so we need to stop the javascript from keep running
//until we received the data. To do that we use the await keyword before the data we expect to received
//and the async keyword before the whole function.

const Dev = require("../models/DevModel")
//the data we are getting from github is more than we need and has its keys not with the same name we want
//so in order to format these data we import the DevModel
//and use its create method to store these info into the database.
//The Dev also contains others mangoose methods like the findOne to avoid the creation of duplicates.

module.exports = {
	async index(req, res) {
		const loggedDev = await Dev.findById(req.headers.user)

		const devList = await Dev.find({
			$and: [
				{ _id: { $ne: req.headers.user } },
				{ _id: { $nin: loggedDev.likes } },
				{ _id: { $nin: loggedDev.dislikes } },
			],
		})
		//the .find method of mangoose receives an object with some filters to return only the objects that pass them
		// the $and:[]  indicates that all the filters must be surpassed
		//$ne is not qual
		//$nin is not in the next object

		return res.json(devList)
	},

	async store(req, res) {
		const { username } = req.body
		//the request can also be in the body as a json. To access it you go to req.body

		const userExists = await Dev.findOne({ user: username })

		if (userExists) {
			return res.json(userExists)
		}

		const response = await axios.get(`https://api.github.com/users/${username}`)

		const { name, bio, avatar_url: avatar } = response.data

		const dev = await Dev.create({
			name,
			user: username,
			bio,
			avatar,
		})

		return res.json(dev)
	},
}
