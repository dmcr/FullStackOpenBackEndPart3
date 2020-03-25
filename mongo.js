const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('Must pass password as argument')
    //debugger;
    process.exit(1)
}
const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@phonebook-lxoat.mongodb.net/person-app?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(res => {
        res.forEach(person => console.log(`${person.name} ${person.number}`))
        mongoose.connection.close()
    })
}
else {
    const newName = process.argv[3]
    const newNumber = process.argv[4]
    const person = new Person({
    name: String(newName),
    number: String(newNumber)
    })

    person.save().then(res => {
        console.log(`Added ${res.name} number ${res.number} to phonebook`)
        mongoose.connection.close()
    })
}



