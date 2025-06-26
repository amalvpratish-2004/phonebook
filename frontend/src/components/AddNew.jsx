const AddNew = ({newName,newNumber,handleNameChange,handleNumberChange,handleSubmit}) => {
  return(
    <form>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit" onClick={handleSubmit} >add</button>
        </div>
      </form>
  )
}

export default AddNew