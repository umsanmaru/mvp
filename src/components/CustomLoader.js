import React from 'react'
import { Grid, Loader, Dimmer, Button } from 'semantic-ui-react'

const CustomLoader = ({text, onClick, buttonText}) => {
    const simpleLoader = (
        <Dimmer active inverted>
            <Loader> <h3>{text ? text : "로딩 중..."}</h3>  </ Loader>
        </Dimmer>
    );

    if (!onClick) return simpleLoader;
    else return(
        <Grid textAlign='center'>
            <Grid.Row style={{marginTop:'15vh', height:'70vh'}}>
                {simpleLoader}
            </Grid.Row>
            <Button onClick={onClick}>{buttonText ? buttonText : "취소하기"}</Button>
        </Grid>
    );
};

export default CustomLoader;