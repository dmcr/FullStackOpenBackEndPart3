const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

morgan.token('postContent', (req, res) => {
    const body = req.body
    if (!body.name) return ''
    return `{
        "name": "${body.name}",
        "number": "${body.number}",
        "id": "${body.id}"
    }`
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postContent'))

let persons = [
    {
        name: "name1",
        number: "1111111111111",
        id: 1
    },
    {
        name: "name2",
        number: "22222222",
        id: 2
    },
    {
        name: "name3",
        number: "33333333333",
        id: 3
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (!person) return res.status(404).end()
    res.json(person)
})

app.get('/info', (req, res) => {
    res.send(`
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>
        </div>
    `)
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(404).json({error: 'Content Missing'})
    }
    else if (persons.find(person => person.name === body.name))
    {
        return res.status(404).json({error: 'Name must be unique'})
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(person)
    res.json(person)
})

const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(person => person.id)) + 1 : 0
    return maxId
}

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const port = 3001
app.listen(port)
console.log(`Server running on port: ${port}`)