import React from 'react'
import { Grid, Button, Container, Segment, Icon } from 'semantic-ui-react'
import Rules from './Rules'
import UserPage from './UserPage'
import dbInit from '../firebase/databaseInit'

const db = dbInit()
const rankMap = {1:"bronze", 2:"silver", 3:"gold"}

const MyPage = ({onLogout, uid, userInfo}) => {
    const onClick = () => {
        db.ref("user_info/" + uid + "/status").set("isMatching");
        db.ref("matching_info" + '/bronze/' + uid).set("placeholder")
    }

    console.log(userInfo, uid)

    return (
        <div>
            <Grid textAlign='center' verticalAlign='middle'>
                <Grid.Row>
                <Container fluid textAlign='right' style={{marginTop: '1vh', marginBottom:'5vh'}}>
                    {`안녕하세요 ${userInfo.name} 님`}  
                    <Button style={{marginLeft: '1vw', marginRight:'2vw'}} onClick={onLogout}>Logout</Button>
                </Container>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column style={{ maxWidth: 600}}>
                        <UserPage onClick={onClick} text={'PLAY'} userInfo={userInfo}>
                            <Icon name='trophy'/> 
                            <h2
                                style={{
                                display: 'inline-block', 
                                marginTop: '1.5vh',
                                marginBottom: '1vh',

                                }}> {`현재 등급: ${rankMap[userInfo.rank]}`} 
                            </h2>
                        </UserPage> 
                        <Segment raised textAlign='left'>
                            <Rules/>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                
            </Grid>
        </div>       
        
    )
}

export default MyPage