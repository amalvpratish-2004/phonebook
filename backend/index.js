require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())

morgan.token('content',(req,res) => {
  const bodyWithoutId = { ...req.body };
  delete bodyWithoutId.id;
  return JSON.stringify(bodyWithoutId)
})
app.use(morgan(':method :url :response-time :content'))

app.get('/api/persons',(request,response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id',(request,response) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    request.json(person)
  })
})

app.delete('/api/persons/:id',(request,response) => {
  const id = request.params.id

  Person.findByIdAndDelete(id).then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.post('/api/persons',(request,response) => {
  const body = request.body

  if(!body) return response.status(400).json({ error: 'Body cannot be empty' })
  
  const person = new Person({
    name : body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id',(request,response,next) => {
  const id = request.params.id
  const { name,number } = request.body

  Person.findById(id).then(person => {
    if(!person)
    {
      return response.status(404).end()
    }

    person.name = name
    person.number = number

    return person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request,response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}
app.use(unknownEndpoint)

const errorHandler = (error,request,response,next) => {
  if(error === 'CastError')
  {
    return response.status(400).send({
      error : 'malformatted id'
    })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("App is listening on port ",PORT)
})
