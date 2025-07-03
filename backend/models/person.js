require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to mongodb')
    })
    .catch(error => {
        console.log('Error connecting to mongodb',error.message)
    })

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