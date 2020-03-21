const express = require('express')

const app = express()
app.use(express.json())

const persons = [
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

const port = 3001
app.listen(port)
console.log(`Server running on port: ${port}`)