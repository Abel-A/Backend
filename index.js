require('dotenv').config()

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
app.options('*', cors());



app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(people => {
        response.json(people)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {


    Person.findById(request.params.id).then(people => {
        if (people) {
            response.json(people)
        }
        else {
            response.status(404).end()
        }
    }).catch(error => next(error))

})

app.get('/info', (request, response, next) => {
    Person.countDocuments({}, (err, count) => {
        response.send(`<p>Phone book has info for ${count} people</p> <p> ${Date()}</p>`)

    })
})

app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))

})

app.post('/api/persons', (request, response, next) => {


    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        console.log(JSON.stringify(savedPerson))
        response.json(savedPerson)
    }) .catch(error => next(error))

})



app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

app.listen(PORT, () => { console.log(`server running on ${PORT}`) })