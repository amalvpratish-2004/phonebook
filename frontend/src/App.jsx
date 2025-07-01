import { useEffect, useState } from 'react'
import numberServices from './services/numbers'
import Filter from './components/Filter'
import Display from './components/Display'
import Delete from './components/Delete'
import AddNew from './components/AddNew'
import Success from './components/Success'

const App = () => {
  const [persons, setPersons] = useState([])
  const hook = () => {
    numberServices.getAll().then(response => setPersons(response))
  }
  useEffect(hook,[])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState(0)
  const [notification, setNotification] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber,
    }

    const exists = persons.some((p) => p.name === newName)
    if(!exists)
    {
      const request = numberServices.addNumber(personObject)
      request.then(response => {
        setPersons(persons.concat(response))
        setNotification(`Added ${newName}`)
    })
      .catch(error => setNotification(error.response.data.error))

      setTimeout(() => {setNotification('')},5000)
    }
    else
    {
      if(confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`))
      {
        const obj = persons.find(person => person.name === newName)
        const request = numberServices.updateNumber(obj.id,personObject)
        request
        .then(updatedPerson => setPersons(persons.map(p => p.id === updatedPerson.id ? updatedPerson : p)))
        .catch(error => {
          setNotification(`Information of ${newName} already removed from the server`)
          setTimeout(() => {setNotification('')},5000)
        })

        setNotification(`Changed number of ${newName}`)
        setTimeout(() => {setNotification('')},5000)
      }
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Success notification={notification} />
      <Filter persons={persons} />

      <h3>add a new</h3>
      <AddNew newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} handleSubmit={handleSubmit} />

      <h3>Numbers</h3>
      {persons.map((person) => <div key={person.name} ><Display person={person}/> <Delete name={person.name} id={person.id} setPersons={setPersons} /></div>)}
    </div>
  )
}

export default App