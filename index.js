const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

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
    res.send(`<p> Puhelinluettelossa ${persons.length} henkilön tiedot</p>
              <p> ${new Date()} </p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const generatedId = Math.floor(Math.random() * Math.floor(100000))
    
    if (body.number === undefined || body.name === undefined) {
        return res.status(400).json({error: 'content missing'})
    }
    
    persons.forEach((p) => {
        if (p.name === body.name) {
            return res.status(400).json({error: 'name must be unique'})
        }
    })

    const person = {
        name: body.name,
        number: body.number,
        id: generatedId
    }

    persons = persons.concat(person)
    res.json(person)
}) 

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})