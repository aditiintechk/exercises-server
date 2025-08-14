const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('please enter appropriat input data & password')
}

const password = process.argv[2]

const mongodb = `mongodb+srv://fullstack:${password}@cluster0.wbnnes8.mongodb.net/contactApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(mongodb)

// create schema
const contactSchema = new mongoose.Schema({
	name: String,
	number: String,
})

// create model
const Contact = mongoose.model('Contact', contactSchema)
const person = new Contact({
	name: process.argv[3],
	number: process.argv[4],
})

// save the data
/* person.save().then((result) => {
	console.log(`added ${result.name} number ${result.number} to phonebook`)
	// close the connection
	mongoose.connection.close()
}) */

// retrive all entries
Contact.find({}).then((result) => {
	result.forEach((contact) =>
		console.log(`${contact.name} ${contact.number}`)
	)
	mongoose.connection.close()
})
