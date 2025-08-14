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

let phonebook = [
	{
		id: '1',
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: '2',
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: '3',
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: '4',
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
]

app.get('/', (req, res) => {
	res.send('<h1>hello world</h1>')
})

app.get('/api/persons', (req, res) => {
	Contact.find({}).then((contacts) => {
		res.json(contacts)
	})
})

// todo: get count to show info
app.get('/info', (req, res) => {
	const contactCount = phonebook.length
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

app.delete('/api/persons/:id', (req, res) => {
	const id = req.params.id
	phonebook = phonebook.filter((person) => person.id !== id)

	res.status(204).send('record deleted')
})

app.post('/api/persons', (req, res) => {
	const body = req.body
	if (!body) {
		return res.status(404).send('send appropriate information')
	}

	/* 	Contact.findOne({ name: body.name }).then((result) => {
		if (result) {
			return res.status(404).send('name must be unique')
		}
	}) */

	const newContact = new Contact({
		name: body.name,
		number: body.number,
	})
	newContact.save().then((savedContact) => res.json(savedContact))
})

app.listen(PORT, () => {
	console.log('server running on port ', PORT)
})
