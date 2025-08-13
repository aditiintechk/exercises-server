const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
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
	res.json(phonebook)
})

app.get('/info', (req, res) => {
	const contactCount = phonebook.length
	const currentDate = new Date()

	res.send(
		`<p>Phonebook has info for ${contactCount} people</p><p>${currentDate}</p>`
	)
})

app.get('/api/persons/:id', (req, res) => {
	const id = req.params.id
	const currentPerson = phonebook.find((person) => person.id === id)

	if (!currentPerson) res.status(404).send('not found')
	else res.json(currentPerson)
})

app.delete('/api/persons/:id', (req, res) => {
	const id = req.params.id
	phonebook = phonebook.filter((person) => person.id !== id)

	res.status(204).send('record deleted')
})

app.post('/api/persons', (req, res) => {
	const body = req.body
	const newId = Math.floor(Math.random() * 10000)
	if (!body) {
		return res.status(404).send('send appropriate information')
	}
	const nameExists = phonebook.filter(
		(person) => person.name === req.body.name
	)
	if (nameExists.length > 0) {
		return res.status(404).send('name must be unique')
	}

	const newPerson = {
		id: newId,
		name: body.name,
		number: body.number,
	}

	phonebook.push(newPerson)
	res.status(200).json(newPerson)
})

app.listen(PORT, () => {
	console.log('server running on port ', PORT)
})
