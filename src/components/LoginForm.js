import React, {useState} from 'react'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'

const LoginForm = ({ onLogin, onSignUpLoad, children }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  return(
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='blue' textAlign='center'>
          Log-in to your account
        </Header>
        <Form size='large'>
          <Segment stacked>
            <Form.Input 
              fluid icon='user' 
              iconPosition='left' 
              placeholder='E-mail address' 
              value={id} 
              onChange={(event)=>setId(event.target.value)}
            />
            <Form.Input 
              fluid icon='lock' 
              iconPosition='left' 
              placeholder='Password' 
              type='password' 
              value={password} 
              onChange={(event)=>setPassword(event.target.value)}
            />
            <Button 
              color='blue' 
              fluid size='large' 
              onClick={() => onLogin(id, password)}
            >
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          New to us? 
          <a style={{cursor: 'pointer'}} onClick={onSignUpLoad}>
            Sign Up
          </a>
        </Message>
        {children}
      </Grid.Column>
    </Grid>
  )
}

export default LoginForm