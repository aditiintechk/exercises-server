const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Contact = require('./models/contacts.js')

const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.get('/', (req, res) => {
	res.send('<h1>hello world</h1>')
})

app.get('/api/persons', (req, res) => {
	Contact.find({}).then((contacts) => {
		res.json(contacts)
	})
})

app.get('/info', async (req, res) => {
	const contactCount = await Contact.estimatedDocumentCount()
	console.log('contact length', contactCount)
	const currentDate = new Date()

	res.send(
		`<p>Phonebook has info for ${contactCount} people</p><p>${currentDate}</p>`
	)
})

app.get('/api/persons/:id', (req, res) => {
	const id = req.params.id
	Contact.findById(id).then((contact) => res.json(contact))
})

app.delete('/api/persons/:id', (req, res, next) => {
	const id = req.params.id
	Contact.findByIdAndDelete(id)
		.then((contact) => {
			res.status(204).end()
		})
		.catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
	const { id, name, number } = req.body
	Contact.findById(id).then((contact) => {
		if (!contact) {
			return res.status(404).end()
		}

		contact.name = name
		contact.number = number

		return contact
			.save()
			.then((savedContact) => {
				res.json(savedContact)
			})
			.catch((error) => next(error))
	})
})

app.post('/api/persons', (req, res) => {
	const body = req.body
	if (!body) {
		return res.status(404).send('send appropriate information')
	}

	const newContact = new Contact({
		name: body.name,
		number: body.number,
	})
	newContact.save().then((savedContact) => res.json(savedContact))
})

const requestLogger = morgan((tokens, req, res) => {
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'),
		'-',
		tokens['response-time'](req, res),
		'ms',
	]
})

app.use(requestLogger)

const errorHandler = (error, req, res, next) => {
	console.error(error.message)
	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	}

	next(error)
}

app.listen(PORT, () => {
	console.log('server running on port ', PORT)
})
