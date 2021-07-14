import React, {useState} from 'react'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'

const ratingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
  return {key: n, text: n, value: n};
})

const gradeOptions = [1, 2, 3].map((n) => {
  return {key: n, text: n, value: n};
})

const SignUpForm = ({ onSignUp, onLoginLoad, children }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [rating, setRating] = useState("");

  return(
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='blue' textAlign='center'>
          Sign Up with email
        </Header>
        <Form size='large'>
          <Segment textAlign='left' stacked>
            <Form.Input 
              fluid label='이메일' 
              placeholder='E-mail address'
              value={id}
              onChange={ (event)=>setId(event.target.value) } 
            />
            <Form.Input 
              fluid label='비밀번호'
              placeholder='Password'
              type='password'
              value={password}
              onChange={ (event)=>setPassword(event.target.value) }
            />
            <Form.Group widths='equal'>
              <Form.Input 
                label="이름" 
                fluid 
                placeholder='홍길동'
                value={name}
                onChange={ (event)=>setName(event.target.value) }
              />
              <Form.Input 
                label="닉네임"
                fluid
                placeholder='수학대장'
                value={nickname}
                onChange={ (event)=>setNickname(event.target.value) }
              />
            </Form.Group>         
            <Form.Input 
              label="학교"
              fluid
              placeholder='휘문고등학교'
              value={school}
              onChange={ (event)=>setSchool(event.target.value) }
            />
            <Form.Group widths="equal">
              <Form.Select
                fluid
                label='학년'
                options={gradeOptions}
                innertext={grade}
                onChange={ (event)=> setGrade(event.target.childNodes[0].innerText) }
              />
              <Form.Select
                fluid
                label='모의고사 등급'
                options={ratingOptions}
                innertext={rating}
                onChange={ (event)=> setRating(event.target.childNodes[0].innerText) }
              />
            </Form.Group>
            <Button 
              color='blue' 
              fluid size='large'
              onClick={
                onSignUp.bind(
                  this, 
                  [id, password, name, nickname, school, grade, rating]
                )
              }
            >
              Sign Up
            </Button>
          </Segment>
        </Form>
        <Message>
          Have an account? 
          <a style={{cursor: 'pointer'}} onClick={onLoginLoad}>
            Login
          </a>
        </Message>
        {children}
      </Grid.Column>
    </Grid>
  );
}

export default SignUpForm