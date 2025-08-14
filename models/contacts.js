const mongoose = require('mongoose')

const mongodb = process.env.MONGO_URI

mongoose.set('strictQuery', false)
mongoose
	.connect(mongodb)
	.then((result) => {
		console.log('connected to mongodb')
	})
	.catch((error) => console.log('error connecting to mongodb', error.message))

// create schema
const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
	},
	number: {
		type: String,
		validate: {
			validator: function (v) {
				return /^\d{2,3}-\d{7,9}$/.test(v)
			},
			message: (props) => `${props.value} is not a valid phone number`,
		},
		minLength: 8,
		required: true,
	},
})

contactSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model('Contact', contactSchema)
