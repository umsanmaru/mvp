import {useState, useEffect} from 'react'
import ButtonBoard from './ButtonBoard'
import { Grid } from 'semantic-ui-react'
import dbInit from '../firebase/databaseInit'

const db = dbInit();

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

const WaitingPage = ({uid, gid, rank}) => {

    const [gameInfo, setGameInfo] = useState({})    
    const [userInfo, setUserInfo] = useState({});
    const [opponentInfo, setOpponentInfo] = useState({});

    const [ready, setReady] = useState(false)
    const [opponentReady, setOpponentReady] = useState(false)
    const [second, setSecond] = useState(15)

    const onReady = () => { 
        db.ref(`game_info/bronze/${gid}/ready/${uid}`).set(true);
        setReady(true);
    };
    
    useEffect(() => {
        db.ref(`game_info/${rank}/${gid}`).get().then((snap)=>{
            setGameInfo(snap.val());
        });
    }, []);

    useEffect(() => {
        if (!isEmpty(gameInfo)){
            const playerObj = gameInfo.player_object;
            for (let playerId in playerObj) {
                if (playerId === uid) setUserInfo(playerObj[playerId]);
                else setOpponentInfo(playerObj[playerId]);
            }
        }
    }, [gameInfo]);

    useEffect(() => {
        if (!isEmpty(opponentInfo)) {
            const opponentRef = db.ref(
                `game_info/${rank}/${gid}/ready/${opponentInfo.id}`
            );
            const listner = opponentRef.on('value', (snap) => {
                if (snap.val()) setOpponentReady(true);
            });
            return () => {
                opponentRef.off('value', listner);
            };
        }
    }, [opponentInfo]);

    useEffect(() => {
        if(ready && opponentReady){
            db.ref('user_info/' + uid + '/status_object/status').set("isPlaying");
            db.ref('game_info/bronze/' + gid + '/startTime/' + uid).set(Date.now());
        }
    }, [ready, opponentReady]);

    useEffect(() => {
        setTimeout(() => {
            onReady()
        }, 15000)
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setSecond(second-1)
        }, 1000)
    }, [second]);
    
    return (
        <Grid columns={3} 
            textAlign='center'
            verticalAlign='middle'
        >
            <Grid.Column style={{maxWidth: 2000, marginTop:'15vh'}}>
                <ButtonBoard
                    boardName={'nick_name'}
                    onClick={onReady}
                    userInfo={userInfo}
                    text={ready ? '준비완료' : '준비되면 클릭'}                     
                />
            </Grid.Column>
            <Grid.Column width={1} style={{marginTop:'15vh'}}>
                <h1>vs</h1>
            </Grid.Column>
            <Grid.Column style={{maxWidth: 2000, marginTop:'15vh'}}>
                <ButtonBoard 
                    boardName={'nick_name'}
                    userInfo={opponentInfo}
                    text={opponentReady ? '준비완료' : 'Wating...'}
                />
            </Grid.Column>
            <Grid.Row style={{marginTop:'5vh'}}>
                <h2>{second}초 후에 시작합니다.</h2>
            </Grid.Row>
        </Grid>    
    );
}

export default WaitingPage;