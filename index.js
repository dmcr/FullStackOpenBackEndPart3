require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('postContent', (req, res) => {
    const body = req.body
    if (!body.name) return ''
    return `{
        "name": "${body.name}",
        "number": "${body.number}"
    }`
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postContent'))

app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(people => people.map(person => person.toJSON()))
        .then(peopleJson => res.json(peopleJson))
        .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person
        .findById(req.params.id)
        .then(person => {
            if (person) 
                res.json(person.toJSON())
            else 
                res.status(404).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const person = new Person ({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(savedPerson => savedPerson.toJSON())
        .then(savedPersonJSON => res.json(savedPersonJSON))
        .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
        number: body.number
    }

    Person
        .findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => updatedPerson.toJSON())
        .then(updatedPersonJson => res.json(updatedPersonJson))
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => res.status(204).end())
        .catch(err => next(err))
})

const errorHandler = (error, request, response, next) => {
    console.log(error)
    console.log(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({error: 'malformatted id'})
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port)
console.log(`Server running on port: ${port}`)