const Dev = require("../models/DevModel")

module.exports = {
	async store(req, res) {
		const loggedDev = await Dev.findById(req.headers.user)
		//we edit the header in the insomnia app to include the user id
		//we could get this info by the json request body too.

		//findById is a mongoose method that is going to look up in the database and return all the information of the
		//user with this id based on the Dev model schema you wrote

		const targetDev = await Dev.findById(req.params.devId)
		//req.params access values inside the route(the url address). In this case the id of the liked dev.
		//example of url post request in insomnia: http://localhost:3333/devs/5d4b0b59afbb1b203c8c16ac/likes

		if (!targetDev) {
			return res.status(400).json({ error: "Dev does not exists" })
		}

		//the id is stored as _id in the database
		if (targetDev.likes.includes(loggedDev._id)) {
			const loggedSocket = req.connectedUsers[req.headers.user]
			const targetSocket = req.connectedUsers[req.params.devId]

			if (loggedSocket) {
				req.io.to(loggedSocket).emit("match", targetDev)
			}
			//if the logged socket exists, which means, the loggedDev is connected an online we will send him the json data
			//of the targetDev. We'll the same thing for the targetSocket.

			if (targetSocket) {
				req.io.to(targetSocket).emit("match", loggedDev)
			}
		}

		loggedDev.likes.push(targetDev._id)

		await loggedDev.save()
		//this save method is necessary to update the atlas database

		return res.json(loggedDev)
	},
}
