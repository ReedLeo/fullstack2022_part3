const express = require('express')
const morgan = require('morgan')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.static('build'))

// app.use(morgan('tiny'))
app.use(
    morgan(function (tokens, req, res) {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            req.body ? (JSON.stringify(req.body)) : ''
        ].join(' ')
    })
)

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method);
    console.log('Path: ', req.path);
    console.log('Body: ', req.body);
    console.log('---');
    next()
}

// app.use(requestLogger)

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

const generateErrMsg = (body) => {
    if (body) {
        if (body.name && body.number) {
            if (persons.find(p => p.name === body.name)) {
                return {error: 'name must be unique'}
            } else {
                return null
            }
        } else {
            return {error: 'The name or number is missing'}
        }
    } else {
        return {error:'Body is missing'}
    }
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log('POST body is', body)
    const errMsg = generateErrMsg(body)
    if (errMsg) {
        response.status(400).json(errMsg)
    } else {
        const newOne = {
            id: generateId(),
            name: body.name,
            number: body.number
        }
        persons = persons.concat(newOne)
        response.status(200).end()
    }
})



const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

app.listen(PORT)