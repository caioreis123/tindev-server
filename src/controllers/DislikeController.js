const Dev = require("../models/DevModel")

module.exports = {
	async store(req, res) {
		console.log(`the one disliking is: ${req.headers.user}`)
		const loggedDev = await Dev.findById(req.headers.user)
		//we edit the header in the insomnia app to include the user id
		//we could get this info by the json request body too.

		//findById is a mongoose method that is going to look up in the database and return all the information of the
		//user with this id based on the Dev model schema you wrote

		console.log(`the disliked is: ${req.params.devId}`)
		const targetDev = await Dev.findById(req.params.devId)
		//req.params access values inside the route(the url address). In this case the id of the disliked dev.
		//example of url post request in insomnia: http://localhost:3333/devs/5d4b0b59afbb1b203c8c16ac/dislikes

		if (!targetDev) {
			return res.status(400).json({ error: "Dev does not exists" })
		}

		//the id is stored as _id in the database
		loggedDev.dislikes.push(targetDev._id)

		await loggedDev.save()
		//this save method is necessary to update the atlas database

		return res.json(loggedDev)
	},
}
