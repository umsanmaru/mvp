import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

const LoginForm = ({ onLogin, onSignUpLoad, children }) => (

  <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h2' color='blue' textAlign='center'>
        Log-in to your account
      </Header>
      <Form size='large'>
        <Segment stacked>
          <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' />
          <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' type='password'/>

          <Button color='blue' fluid size='large' onClick={onLogin}>
            Login
          </Button>
        </Segment>
      </Form>
      <Message>
        New to us? <a style={{cursor: 'pointer'}} onClick={onSignUpLoad}>Sign Up</a>
      </Message>
      {children}
    </Grid.Column>
  </Grid>
)

export default LoginForm