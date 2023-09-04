const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./database/mongo')

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.static('dist'))

app.use(express.json())
morgan.token('body', function getBody(request, response) {
    return (JSON.stringify(request.body))
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())


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
    Person.find({}).then(persons => {
        response.json(persons)
    })
})
app.get('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    if (id) {
        const personFound = persons.find((currentValue) => id === currentValue.id)
        if (personFound) {
            response.json(personFound)
        }
        else {
            response.status(404).end()
        }
    }

})

app.get('/info', (request, response) => {
    const lenPersons = persons.length
    response.send(`<p>Phone book has info for ${lenPersons} people</p> <p> ${Date()}</p>`)

})

app.delete('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    if (id) {
        persons = persons.filter(person => person.id !== id)
        if (persons) {
            response.status(204).end()
        }
        else {
            response.status(404).end()
        }
    }

})

app.post('/api/persons', (request, response) => {
    const data = request.body
    if (!data.name || !data.number) {
        return (response.status(400).json({
            error: 'content missing'
        }))
    }

    else if (persons.find((element) => data.name === element.name)) {
        return (response.status(400).json({
            error: 'name must be unique'
        }))
    }

    else {
        const person = new Person({
            name: data.name,
            number: data.number
        })
        person.save().then(savedPerson => {
            response.json(savedPerson)
        })
    }
})



app.listen(PORT, () => { console.log(`server running on ${PORT}`) })