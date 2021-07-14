import React, {useState, useEffect} from 'react'
import {Segment} from 'semantic-ui-react'
import dbInit from '../firebase/databaseInit'

const db = dbInit();

const TimerBoard = ({uid, gid, rank}) => {
    const [startTime, setStartTime] = useState();
    const [minutes, setMinutes] = useState("0");
    const [seconds, setSeconds] = useState("0");

    useEffect(() => {
      const ref = db.ref(`game_info/bronze/${gid}/startTime/${uid}`);
      const listner = ref.on('value', (snap)=>{
        if(snap.val()) setStartTime(snap.val());
      });
      return () => {
        ref.off('value', listner);
      };
    }, []);
    
    useEffect(() => {
      if(minutes<0 || (minutes===0 && seconds===0)) {
        setSeconds(0);
        setMinutes(0);
        console.log(gid)
        db.ref(`game_info/${rank}/${gid}/score`).get().then((snap) => {
          const result = (function(scoreObj) {
            let userScoreObj, opponentScoreObj;
            for (const playerId in scoreObj) {
              if (playerId === uid) userScoreObj = scoreObj[playerId];
              else opponentScoreObj = scoreObj[playerId];
            }
            const userScore = userScoreObj.total;
            const userTime = userScoreObj.timeAt;
            const opponentScore = opponentScoreObj.total;
            const opponentTime = opponentScoreObj.timeAt;

            if (userScore > opponentScore) return "win";
            else if (userScore < opponentScore) return "lose";
            else{
              if(userTime < opponentTime) return "win";
              else return "lose";
            }
          })(snap.val());

          db.ref(`game_info/${rank}/${gid}/result_object/${uid}/result`).set(result)
              .then(() => {
                db.ref(`user_info/${uid}/status_object/status`).set("End");
              });
        });
        return;
      }

      if(startTime){
        const currentTime = Date.now()
        const passedTime = Math.round((currentTime - startTime)/1000)
        const leftTime = 12 - passedTime
        let leftM = Math.floor(leftTime/60)
        let leftS = leftTime - leftM * 60
        const countdown = setInterval(() => {
          setSeconds(leftS)
          setMinutes(leftM)
        }, 1000);
        return () => clearInterval(countdown);
      }      
    }, [startTime, minutes, seconds])
  
    return (
        <Segment textAlign='center' inverted color='blue'>
          <h1>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </h1>
        </Segment>
    );
}

export default TimerBoard;