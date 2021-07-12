import React, {useState, useEffect} from 'react';
import UserBoard from './UserBoard';
import QuestionBoard from './QuestionBoard';
import Timer from './Timer';
import dbInit from '../firebase/databaseInit'
import { Grid } from 'semantic-ui-react'
import LoaderV2 from './Loader';
import MatchEnd from './MatchEnd'

const db = dbInit()
const rankMap = {1:"bronze", 2:"silver", 3:"gold"}


const Match = ({uid, oid, gid, userInfo, opponentInfo}) => {
  
  const [isOver, setIsOver] = useState("unchecked")
  const [result, setResult] = useState()
  const [resultDone, setResultDone] = useState("unchecked")
  
  const writeResult = (result) => {
    if(resultDone==="unchecked" || resultDone) return
    db.ref('user_info/' + uid).get().then((snap) => {
      const user_info = snap.val()
      const {current, rank} = user_info
      if(current[result] == 1){
        db.ref('user_info/' + uid + '/current').set({win:0, lose:0})
        if(result === 'win'){
          db.ref('user_info/' + uid + '/rank').set(Math.min(rank + 1, 3))
        }
        else if(result === 'lose'){
          db.ref('user_info/' + uid + '/rank').set(Math.max(rank - 1, 1))
        }
      }else{
        db.ref('user_info/' + uid + '/current/' + result).set(1)
      }
    })
    db.ref('user_info/' + uid + '/total/' + result).get().then((snap) => {
      db.ref('user_info/' + uid + '/total/' + result).set(snap.val() + 1)
    }) 
  }

  useEffect(() => {
    const ref = db.ref('game_list/' + 'bronze/' +gid + '/isOver')
    const listner = ref.on('value', (snap)=>{
      setIsOver(!(!snap.val()))
    })
    return () => {
      ref.off('value', listner)
    }
  }, []) 
  
  
  useEffect(() => {
    const ref = db.ref('game_list/'+ +'bronze/'+gid+'/resultDone/'+uid)
    const listner = ref.on('value', (snap)=>{
      setResultDone(snap.val())
    })
    return () => {
      ref.off('value', listner)
    }
  }, [])

  
  useEffect(() => {
    console.log(isOver, resultDone)
    if(isOver==="unchecked" || !isOver) return
    db.ref('game_list/'+'bronze/' + gid + '/score').get().then((snap) => {
      const score = snap.val()
      const playerScore = score[uid].total
      const opponentScore = score[oid].total
      if(playerScore == opponentScore){
        console.log(uid, oid)
        if(score[uid].timeAt < score[oid].timeAt){
          setResult('W')      
          writeResult('win')
        }else {
          setResult('L')
          writeResult('lose')
        }
      }
      else if(playerScore > opponentScore){
        setResult('W')
        writeResult('win')
      }else {
        setResult('L')
        writeResult('lose')
      }
    }).then(() => {
      db.ref('game_list/'+'bronze/' + gid + '/resultDone/'+uid).set(true)
    })
  }, [isOver, resultDone])
  console.log(isOver)
  if(isOver==="unchecked") return <LoaderV2 text={'로딩 중...'} />
  if(isOver) {
    if(!result) return <LoaderV2 text={'결과 계산 중...'} /> 
    return <MatchEnd uid={uid} db={db} result={result} userInfo={userInfo}/>
  }
  return (
    <Grid centered>
      <Grid.Row style={{ marginTop: '3vh'}}>
        <Grid.Column width={4}>
          <UserBoard userInfo={userInfo} gid={gid} db={db} uid={uid}/>
        </Grid.Column>
        <Grid.Column width={6}>
          <Timer db={db} gid={gid} uid={uid}/>
          <QuestionBoard gid={gid} uid={uid} db={db}/>
        </Grid.Column>
        <Grid.Column width={4}>
          <UserBoard userInfo={opponentInfo} gid={gid} db={db} uid={oid}/>
        </Grid.Column>
        </Grid.Row>
    </Grid>
  )
}

export default Match;
