import React, { useState } from 'react'
import { Grid, Container, Divider, Segment, Icon } from 'semantic-ui-react'

const ButtonBoard = ({boardName, onClick, text, userInfo, icon}) => {   
    const [hover, setHover] = useState(false)

    const current = userInfo.current || {win: 0, lose: 0};
    const total = userInfo.total || {win: 0, lose: 0};
    const boardText = (function(boardName) {
        if (boardName === 'rank') {
            const rank = userInfo.rank || "ooo";
            return `현재 등급: ${rank}`;
        } else if (boardName === 'nick_name') {
            const nickName = userInfo.nick_name || "ooo";
            return nickName;
        }
    })(boardName);
    const iconComponent = icon ? <Icon style={{marginRight:'1vw'}} name={icon}/> : null; 

    const onHover = (on) => {
        if(on) setHover(true)
        else setHover(false)
    }
    
    return (    
        <Segment raised>
            <Segment color='blue' textAlign='center' size='large'>
                {iconComponent}
                <h2 style={{display: 'inline'}}>{boardText}</h2>
            </Segment>
            <Container style={{ marginTop: '7vh' }}>
                <Grid columns={2} textAlign='center'>
                    <Grid.Column style={{ maxWidth: 400}}>
                        <h4>현재</h4>
                        <Divider />
                        <Container>
                            <h3>{`${current.win}승 ${current.lose}패`}</h3>
                        </Container>
                    </Grid.Column>
                    <Grid.Column style={{ maxWidth: 400 }}>
                        <h4>전체</h4>
                        <Divider />
                        <Container>
                            <h3>{`${total.win}승 ${total.lose}패`}</h3>
                        </Container>
                    </Grid.Column>
                </Grid>
                <Segment 
                    onClick={onClick}
                    style={{ marginTop: '10vh' }} 
                    inverted color ='blue'
                    textAlign='center' 
                    size='large'
                    onMouseEnter={ ()=>onHover(true) } 
                    onMouseLeave={ ()=>onHover(false) }
                    secondary={hover}
                >
                    <h2>{text}</h2>
                </Segment>
            </Container>    
        </Segment>        
    );
};

export default ButtonBoard;