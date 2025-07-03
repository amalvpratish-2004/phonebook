const personRouter = require('express').Router()
const Person = require('../models/person')
const logger = require('../utils/logger')

//getting info
personRouter.get('/info',() => {
  const date = new Date()

  Person.find({}).then(persons => {
    logger.info('Number of users = ',persons.length,' at ',date)
  })
})

//Fetching all users
personRouter.get('/',(request,response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

//Fetching user by id
personRouter.get('/:id',(request,response) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    response.json(person)
  })
})

//Deleting a person
personRouter.delete('/:id',(request,response,next) => {
  const id = request.params.id

  Person.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

//adding a new person
personRouter.post('/',(request,response,next) => {
  const body = request.body

  if(!body) return response.status(400).json({ error: 'Body cannot be empty' })
  
  const person = new Person({
    name : body.name,
    number: body.number,
  })

  let error = person.validateSync()
  
  if(error)
  {
    logger.info('Validation error')
    next(error)
  }

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

//updating an existing person
personRouter.put('/:id',(request,response,next) => {
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

module.exports = personRouter