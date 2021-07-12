import React from 'react'
import { Grid, Button, Segment } from 'semantic-ui-react'

const rankMap = {1:"bronze", 2:"silver", 3:"gold"}

const MatchEnd = ({db, uid, result, userInfo}) => {
    const onClick = () => {
        db.ref('user_info/' + uid + '/status').set("isWaiting")
        db.ref('matching_info/'+'bronze/' + uid).set(null)
        db.ref('user_info/' + uid + '/game_id').set(null)
    }

    let color, text
    
    if(result === 'W') {
        color = 'blue'
        text = 'You Win!!!'
    }else {
        color = 'red'
        text = 'You lose...'
    }

    return (
        <Grid textAlign='center'>
            <Grid.Row style={{marginTop:'30vh', marginBottom:'15vh', height:'30vh', width:'50vw'}}>
                <Segment 
                    size='massive' 
                    inverted color={color}
                    style={{width:'50vw'}} 
                    textAlign='center'  
                >
                    <h1 style={{marginTop:'6vh'}}>{text}</h1>
                </Segment>
            </Grid.Row>
            <Button onClick={onClick}>돌아가기</Button>
        </Grid>
    )    
}

export default MatchEnd