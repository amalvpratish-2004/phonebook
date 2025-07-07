const personRouter = require('express').Router()
const Person = require('../models/person')
const logger = require('../utils/logger')

//getting info
personRouter.get('/info',async (response,next) => {
  const date = new Date()

  try{
    const persons = await Person.find({})
    logger.info('Number of users = ',persons.length,' at ',date)
    response.status(200).json(persons)
  }
  catch(exception){
    next(exception)
  }
})

//Fetching all users
personRouter.get('/',async (request,response,next) => {
    try{
      const persons = await Person.find({})
      response.status(200).json(persons)
    }
    catch(exception){
      next(exception)
    }
})

//Fetching user by id
personRouter.get('/:id',async (request,response,next) => {
  const id = request.params.id
  try{
    const person = await Person.findById(id)
    response.status(200).json(person)
  }
  catch(exception){
    next(exception)
  }
})

//Deleting a person
personRouter.delete('/:id',async (request,response,next) => {
  const id = request.params.id
  try{
    await Person.findByIdAndDelete(id)
    response.status(204).end()
  }
  catch(exception){
    next(exception)
  }
})

//adding a new person
personRouter.post('/',async (request,response,next) => {
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

  try{
    const savedPerson = await person.save()
    response.status(200).json(savedPerson)
  }
  catch(exception){
    next(exception)
  }
})

//updating an existing person
personRouter.put('/:id',async (request,response,next) => {
  const id = request.params.id
  const { name,number } = request.body

  try{
    const person = await Person.findById(id)
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
  }
  catch(exception){
    next(exception)
  }
})

module.exports = personRouter