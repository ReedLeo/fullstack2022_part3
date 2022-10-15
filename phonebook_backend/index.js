const express = require('express')
const app = express()
const PORT = 3001

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people<br/>${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('Get the person of ID =', id);
    if (id) {
        response.json(persons.find(p => p.id === id))
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('ID to delete is', id)
    if (id) {
        persons = persons.filter(p => p.id !== id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
    return Math.floor(Math.random()*100000000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log('POST body is', body)
    if (body) {
        const newOne = {
            id: generateId(),
            name: body.name,
            number: body.number
        }
        persons = persons.concat(newOne)
        response.status(200).end()
    } else {
        response.send('Body is missing').end()
    }
})

app.listen(PORT)