import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

const ratingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
  return {key: n, text: n, value: n}
})

const gradeOptions = [1, 2, 3].map((n) => {
  return {key: n, text: n, value: n}
})

const SignUpForm = ({ onSignUp, onLoginLoad, children }) => (

  <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h2' color='blue' textAlign='center'>
        Sign Up with email
      </Header>
      <Form size='large'>
        <Segment textAlign='left' stacked>
          <Form.Input fluid label='이메일' placeholder='E-mail address' />
          <Form.Input fluid label='비밀번호' placeholder='Password' type='password'/>
          <Form.Group widths='equal'>
            <Form.Input label="이름" fluid placeholder='홍길동'/>
            <Form.Input label="닉네임" fluid placeholder='수학대장'/>
          </Form.Group>         
          <Form.Input label="학교" fluid placeholder='휘문고등학교'/>
          <Form.Group widths="equal">
            <Form.Select
              fluid
              label='학년'
              options={gradeOptions}
            />
            <Form.Select
              fluid
              label='모의고사 등급'
              options={ratingOptions}
            />
          </Form.Group>
          <Button color='blue' fluid size='large' onClick={onSignUp}>
            Sign Up
          </Button>
        </Segment>
      </Form>
      <Message>
        Have an account? <a style={{cursor: 'pointer'}} onClick={onLoginLoad}>Login</a>
      </Message>
      {children}
    </Grid.Column>
  </Grid>
)

export default SignUpForm