import React, {useState, useEffect} from 'react'
import ScoringUnit from './ScoringUnit'
import { Grid, Segment } from 'semantic-ui-react'

const UserBoard = ({userInfo, gid, uid, db}) => {
    const [scoring, setScoring] = useState([0 ,0 ,0, 0, 0])
    const [sum, setSum] = useState(0)
    let scoringBoard = null
    
    useEffect(() => {
        const ref = db.ref('game_list/bronze/' + gid + '/scoring/' + uid)
        const listner = ref.on('value', (data) =>{
            if(!data.val()) return
            const current = Object.values(data.val())
            setScoring(Object.values(current))
        });
        return () => {
            ref.off('value', listner)
        }
    }, [gid, uid])

    useEffect(() => {
        if(!gid || !uid) return
        let sum = 0
        scoring.map((score)=>{
            while(score){
                if(score[0]==="O") {
                    sum+=4
                    break
                }else {
                    sum -= 1
                    score = score.slice(1)
                }
            }
        })
        if(sum<0) sum = 0
        setSum(sum)
        db.ref('game_list/bronze/' + gid + '/score/' + uid).set({total: sum, timeAt: Date.now()})
    }, [scoring])

    if(scoring){
        scoringBoard = scoring.map(
            (state, qNum)=> <ScoringUnit state={state} qNum={qNum}/>
        )
    }

    return (
        <div>
            <Segment color='grey'>
                <Grid textAlign='center'>
                    <Grid.Row>
                        <h2>{userInfo.name}</h2>
                    </Grid.Row>
                    <Grid.Row>
                        <h4>
                            {`${userInfo.school} / ${userInfo.grade}학년 / 모의고사 ${userInfo.rating}등급`}
                        </h4>
                    </Grid.Row>
                </Grid>
            </Segment>
            <Segment color='grey'>
                {scoringBoard}
                <Segment textAlign='center' style={{marginTop:'3vh'}}>
                    <h3>{`현재 점수: ${sum}`}</h3>
                </Segment>
            </Segment>
        </div>
    )
}

export default UserBoard