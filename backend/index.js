require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())

//requestLogger
morgan.token('content',(req) => {
  const bodyWithoutId = { ...req.body }
  delete bodyWithoutId.id
  return JSON.stringify(bodyWithoutId)
})
app.use(morgan(':method :url :response-time :content'))

//getting info
app.get('/api/info',() => {
  const date = new Date()

  Person.find({}).then(persons => {
    console.log('Number of users = ',persons.length,' at ',date)
  })
})

//Fetching all users
app.get('/api/persons',(request,response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

//Fetching user by id
app.get('/api/persons/:id',(request,response) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    response.json(person)
  })
})

//Deleting a person
app.delete('/api/persons/:id',(request,response,next) => {
  const id = request.params.id

  Person.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

//adding a new person
app.post('/api/persons',(request,response,next) => {
  const body = request.body

  if(!body) return response.status(400).json({ error: 'Body cannot be empty' })
  
  const person = new Person({
    name : body.name,
    number: body.number,
  })

  let error = person.validateSync()
  
  if(error)
  {
    console.log('Validation error')
    next(error)
  }

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

//updating an existing person
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

    return person.save()
      .then(savedPerson => {
      response.json(savedPerson)
      })
      .catch(error => next(error))
  })
  .catch(error => next(error))
})

const unknownEndpoint = (response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}
app.use(unknownEndpoint)

const errorHandler = (error,response,next) => {
  if(error.name === 'CastError')
  {
    return response.status(400).send({
      error : 'malformatted id'
    })
  }
  else if(error.name === 'ValidationError')
  {
    return response.status(400).send({
      error : error.message
    })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('App is listening on port ',PORT)
})
