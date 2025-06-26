import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons'

const addNumber = (newObject) => {
    const request = axios.post(baseUrl,newObject)
    return(
        request.then(response => response.data)
    )
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return(
        request.then(response => response.data)
    )
}

const deleteNumber = (id) => {
    const delUrl = baseUrl+`/${id}`
    const request = axios.delete(delUrl)

    return(
        request.then(response => response.data)
    )
}

const updateNumber = (id,newObject) => {
    const updateUrl = baseUrl+`/${id}`
    const request = axios.put(updateUrl,newObject)

    return(
        request.then(response => response.data)
    )
}

export default { addNumber,getAll,deleteNumber,updateNumber }