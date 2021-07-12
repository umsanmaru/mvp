import React, { useState } from 'react'
import { Grid, Container, Divider, Segment } from 'semantic-ui-react'



const UserPage = ({children, onClick, text, userInfo}) => {
    
    const [hover, setHover] = useState(false)

    console.log(userInfo)

    const onHover = (on) => {
        if(on) setHover(true)
        else setHover(false)
    }

    var button = (
    <Segment 
        onClick={onClick}
        style={{ marginTop: '10vh' }} 
        inverted color = 'blue'
        textAlign='center' 
        size= 'large'
        onMouseEnter={() => onHover(true)} 
        onMouseLeave={() => onHover(false)}
    >
        <h2>{text}</h2>
    </Segment>
    )
    
    if(hover) button = React.cloneElement(button, {secondary: true})
    
    return (    
        <Segment raised>
            <Segment color='blue' textAlign='center' size='large'>
                {children}
            </Segment>
            <Container style={{ marginTop: '7vh' }}>
                <Grid columns={2} textAlign='center'>
                    <Grid.Column style={{ maxWidth: 400}}>
                        <h4>현재</h4>
                        <Divider />
                        <Container>
                            <h3>{`${userInfo.current.win}승 ${userInfo.current.lose}패`}</h3>
                        </Container>
                    </Grid.Column>
                    <Grid.Column style={{ maxWidth: 400 }}>
                        <h4>전체</h4>
                        <Divider />
                        <Container>
                            <h3>{`${userInfo.total.win}승 ${userInfo.total.lose}패`}</h3>
                        </Container>
                    </Grid.Column>
                </Grid>
                {button}
            </Container>    
        </Segment>        
    )
}

export default UserPage