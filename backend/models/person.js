const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
    },
    number: {
        type: String,
        minLength: 9,
        validate: {
            validator: function(num) {
                return (/\d{2,3}-\d+/).test(num)
            },
        },
    },
})

personSchema.set('toJSON', {
    transform: (document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v           
    }
})

module.exports = mongoose.model('Person',personSchema)