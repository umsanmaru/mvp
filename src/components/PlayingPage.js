import React, {useState, useEffect} from 'react';
import UserBoard from './UserBoard';
import QuestionBoard from './QuestionBoard';
import TimerBoard from './TimerBoard';
import dbInit from '../firebase/databaseInit'
import { Grid } from 'semantic-ui-react'

const db = dbInit()

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const PlayingPage = ({uid, gid, rank}) => {
  const [gameInfo, setGameInfo] = useState({})    
  const [userInfo, setUserInfo] = useState({});
  const [opponentInfo, setOpponentInfo] = useState({});

  useEffect(() => {
    db.ref(`game_info/${rank}/${gid}`).get().then((snap)=>{
        setGameInfo(snap.val());
    });
  }, []);

  useEffect(() => {
      if (!isEmpty(gameInfo)){
          console.log(gameInfo)
          const playerObj = gameInfo.player_object;
          for (let playerId in playerObj) {
              if (playerId === uid) setUserInfo(playerObj[playerId]);
              else setOpponentInfo(playerObj[playerId]);
          }
      }
  }, [gameInfo]);

  return (
    <Grid centered>
      <Grid.Row style={{ marginTop: '3vh'}}>
        <Grid.Column width={4}>
          <UserBoard  gid={gid} uid={uid} userInfo={userInfo} rank={rank}/>
        </Grid.Column>
        <Grid.Column width={6}>
          <TimerBoard gid={gid} uid={uid} rank={rank}/>
          <QuestionBoard gid={gid} uid={uid} rank={rank}/>
        </Grid.Column>
        <Grid.Column width={4}>
          <UserBoard  gid={gid} uid={uid} userInfo={opponentInfo} rank={rank}/>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default PlayingPage;
