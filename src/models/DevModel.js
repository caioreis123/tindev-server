const { Schema, model } = require("mongoose")
//the Schema is a constructor object of mangoose that help us build our schemas. Each schema is an object
// with the data types oh each key.

const DevSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		user: {
			type: String,
			required: true,
		},
		bio: String, //this is not a full object because it's value is not a required one
		avatar: {
			type: String, //the avatar is a string because is a url to the img
			required: true,
		},
		likes: [
			//the square braces indicates an array of many id's
			{
				type: Schema.Types.ObjectId,
				ref: "Dev", //this ref is to point where to get the id from. In this case it is from this same table
				// (the ref is like a foreign key to create a relation between the field likes to the Dev model)
			},
		],
		dislikes: [
			{
				type: Schema.Types.ObjectId,
				ref: "Dev",
			},
		],
	},
	{
		timestamps: true,
		//this second argument inside the Schema constructor is to
		// register the time of creation and updates of these information in the database
	},
)

module.exports = model("Dev", DevSchema)
//the model of the mongoose is a high order function that wraps our schema and name it Dev to export it.
