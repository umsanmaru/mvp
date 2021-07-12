import React, {useState, useEffect} from 'react'
import { Message } from 'semantic-ui-react'

const ErrorMessage = ({errorMessage}) => {
  const [message, setMessage] = useState(errorMessage)
  useEffect(() => {
      if(!message)
        setMessage(errorMessage)
  }, [errorMessage])
  return(
    <Message color='red'>
        <Message.Header id='message'>{message}</Message.Header>
    </Message>
  )
}

export default ErrorMessage