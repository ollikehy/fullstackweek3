const mongoose = require('mongoose')
const Schema = mongoose.Schema

const url = 'mongodb://kayttaja:salasana@ds123258.mlab.com:23258/fullstack-phonebook'

mongoose.connect(url)

mongoose.Promise = global.Promise

let personSchema = new Schema({
    name: String,
    number: String
})

personSchema.statics.formatPerson = function(person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person