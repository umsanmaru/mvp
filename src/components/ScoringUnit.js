import { Grid, Segment } from 'semantic-ui-react'

const ScoringUnit = ({state, qNum})  => {
    let color
    if(!state) {
        state=<h4 style={{color:"grey"}}>시도 안함</h4>
        color=null
    }else if(state.includes("O")){
        color="green"
    }else{ color="red" } 
    return(
        <Grid textAlign='center' style={{marginTop:'0.5vh'}}>
            <Grid.Column width={6}>
                <Segment>
                    <h3>{`${qNum+1}`}</h3>
                </Segment>
            </Grid.Column>
            <Grid.Column width={10}>
                <Segment color={color}>
                    {state}
                </Segment>
            </Grid.Column>
        </Grid>
    )
}

export default ScoringUnit