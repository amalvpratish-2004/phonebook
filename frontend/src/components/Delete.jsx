import numberServices from '../services/numbers'

const Delete = ({name,id,setPersons}) => {
  const delNum = () => {
    if(!confirm(`Delete ${name}`)) return

    numberServices.deleteNumber(id)
    .then(() => {
      numberServices.getAll().then(response => setPersons(response))
    })
    .catch(error => console.log("fail"))
  }

  return(
    <button onClick={delNum}>Delete</button>
  )
}

export default Delete