const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
morgan.token('type', (req, res) => { return JSON.stringify(req.body)})
app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'))

let persons = [
    {
        name: 'Olli',
        number: '123-4567',
        id: 1
    },
    {
        name: 'Pekka',
        number: '122-3213',
        id: 2,
    },
    {

        name: 'Matti',
        number: '121-2231',
        id: 3,
    },
    {
        name: 'Teppo',
        number: '120-2123',
        id: 4,
    }
]

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.send(`<p> Puhelinluettelossa ${persons.length} henkilön tiedot</p>
            <p> ${new Date()} </p>`)
        })
})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(person => {
            res.json(person.map(Person.formatPerson))
        })
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person
        .findById(req.params.id)
        .then(person => {
            res.json(Person.formatPerson(person))
        })
        .catch(error => {
        console.log(error)
        res.status(404).end()
    })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(400).send({error: 'malformatted id'})
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const generatedId = Math.floor(Math.random() * Math.floor(100000))
    
    if (body.number === undefined || body.name === undefined) {
        return res.status(400).json({error: 'content missing'})
    }
    
    const person = new Person({
        name: body.name,
        number: body.number,
        id: generatedId
    })

    Person
        .find({name: req.body.name})
        .then(result => {
            console.log(result.length);
            if (result.length > 0) { 
                res.status(400).send({error: 'person already in database'}).end()
            } else {
                person
                    .save()
                    .then(savedPerson => {
                        res.json(Person.formatPerson(savedPerson))
                    })
            }
        })
    }) 

app.put('/api/persons/:id', (req, res) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => {
            res.json(Person.formatPerson(person))
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({error: 'malformed id'})
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})