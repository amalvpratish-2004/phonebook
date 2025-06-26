const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

morgan.token('content',(req,res) => {
  const bodyWithoutId = { ...req.body };
  delete bodyWithoutId.id;
  return JSON.stringify(bodyWithoutId)
})
app.use(morgan(':method :url :response-time :content'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request,response) => {
    response.json(persons)
})

app.get('/api/persons/:id',(request,response) => {
  const id = request.params.id
  const person = persons.find((p) => p.id === id)

  if(person)
  {
    response.json(person)
  }
  else
  {
    response.status(401).end()
  }
})

app.get('/info',(request,response) => {
    const size = persons.length
    const time = new Date()

    response.send(`Phonebook has info for ${size} people <br /> ${time}`)
})

app.delete('/api/persons/:id',(request,response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const id = persons.length > 0 ? Math.max(...persons.map(p => Number(p.id))) : 0

  return String(id+1)
}

app.post('/api/persons',(request,response) => {
  const person = request.body

  if(!person) return response.status(400).json({ error: 'Body cannot be empty' })
  if(persons.find((p) => p.name === person.name)) return response.status(400).json({ error: 'Name must be unique' })
  
  const id = generateId()
  person.id = id

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("App is listening on port ",PORT)
})
