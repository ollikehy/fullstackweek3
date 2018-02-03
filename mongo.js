const mongoose = require('mongoose')

const url = 'mongodb://kayttaja:salasana@ds159274.mlab.com:59274/fullstack-persons'

mongoose.connect(url)
mongoose.Promise = global.Promise

const Person = mongoose.model('Person' , {
    name: String,
    number: String  
})

if (process.argv[2]) {
    const person = new Person({
     name: process.argv[2],
     number: process.argv[3]
    })

    person
        .save()
        .then(result => {
            console.log(`lisätään henkilö ${process.argv[2]} numero ${process.argv[3]} luetteloon`);
            mongoose.connection.close()
        })
} else {
    Person
        .find({})
        .then(result => {
            console.log('puhelinluettelo:');
            result.forEach(person => {
                console.log(person.name + ' ' + person.number)
            })
            mongoose.connection.close()
        })
}