import { useState } from "react"
import Display from './Display'

const Filter = ({persons}) => {
  const [searchName,setSearchName] = useState('')
  const [filteredUsers,setfilteredUsers] = useState([])

  const handleSearchNameChange = (event) => {
    const value = event.target.value
    setSearchName(value)

    if(value==='') return
    setfilteredUsers(persons.filter((person) => person.name.toLowerCase().startsWith(value.toLowerCase())))
  }

  return(
    <form>
      <div>
        filter shown with: <input value={searchName} onChange={handleSearchNameChange} />
      </div>
      {filteredUsers.map((person) => <Display key={person.name} person={person}/>)}
    </form>
  )
}

export default Filter;