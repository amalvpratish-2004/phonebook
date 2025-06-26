const Success = ({notification}) => {
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if(notification === '')
  {
    return
  }
  else
  {
    return(
      <p style={errorStyle}>{notification}</p>
    )
  }
}

export default Success