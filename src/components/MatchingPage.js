import {useState, useEffect} from 'react'
import UserPage from './UserPage'
import { Grid } from 'semantic-ui-react'
import dbInit from '../firebase/databaseInit'


const db = dbInit()
const rankMap = {1: "bronze" ,2:"sliver", 3:"gold"}

const MatchingPage = ({uid, gid, userInfo, opponentInfo}) => {

    const [ready, setReady] = useState(false)
    const [vsReady, setVsReady] = useState(false)
    const [second, setSecond] = useState(15)
    
    useEffect(() => {
        if(ready && vsReady){
            db.ref('user_info/' + uid + '/status').set("isPlaying")
            db.ref('game_list/bronze/' + gid + '/startTime/' + uid).set(Date.now())
        }
    }, [ready, vsReady, uid, gid])

    useEffect(() => {
        setTimeout(() => {
            onClick()
        }, 15000)
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setSecond(second-1)
        }, 1000)
    }, [second])

    useEffect(() => {
        const ref = db.ref('game_list/' + 'bronze/' + gid + '/ready')
        const listner = ref.on('value', (snapshot) => {
            const players = snapshot.val()
            if(players){
                Object.entries(players).forEach((player) => {
                    if( player[0] !== uid ){
                        if(!vsReady) setVsReady(true)
                    }
                })
            }
        })
        return () => {
            ref.off('value', listner)
        }
    }, [gid, uid])
    
    const onClick = () => { 
        db.ref('game_list/' + 'bronze/' + gid + '/ready/' + uid).set(true)
        setReady(true)
    }

    return (
            <Grid columns={3} 
                style={{ height: '100vh', maxWidth: 2000, marginTop:'10vh' }}
                textAlign='center'
                verticalAlign='middle'
            >
                <Grid.Column>
                    <UserPage 
                        text={ready ? '준비완료' : (gid ? '준비되면 클릭' : '')} 
                        onClick={onClick}
                        userInfo={userInfo}
                    >
                        <h1>{userInfo.nick_name}</h1>
                    </UserPage>
                </Grid.Column>
                <Grid.Column width={1}>
                    <h1>vs</h1>
                </Grid.Column>
                <Grid.Column>
                    <UserPage 
                        text={vsReady ? '준비완료' : 'Wating...'}
                        userInfo={opponentInfo}
                    >
                        <h1>{opponentInfo.nick_name}</h1>
                    </UserPage>
                </Grid.Column>
                <Grid.Row style={{marginTop:'0vh', marginBotton:'0vh'}}>
                    <h2>{second}초 후에 시작합니다.</h2>
                </Grid.Row>
            </Grid>    
    )
}

export default MatchingPage