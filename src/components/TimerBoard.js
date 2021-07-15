import React, {useState, useEffect} from 'react'
import {Segment} from 'semantic-ui-react'
import dbInit from '../firebase/databaseInit'

const db = dbInit();

const GAME_TIME = 12; // total duration of game; unit: second

function checkEnd(minutes, seconds) {
  // check if game is end
  console.log(minutes, seconds)
  if (minutes === undefined ||
      seconds === undefined) return false;
  else if (minutes == 0 && seconds == 0) return true;
  else if (minutes < 0) return true
  else return false;
};

const TimerBoard = ({uid, gid, rank}) => {
  const [startTime, setStartTime] = useState();
  const [minutes, setMinutes] = useState();
  const [seconds, setSeconds] = useState();
  
  const [displayMinutes, displaySeconds] = (function() {
    const displayMinutes = 
      (minutes === undefined ? "00" : minutes);
      console.log(minutes, minutes === undefined,  (minutes === undefined ? "00" : minutes))
    const displaySeconds =
      (seconds === undefined ? "00" : 
        (seconds < 10 ? `0${seconds}` : seconds));
    return [displayMinutes, displaySeconds];
  })();

  useEffect(() => {
    // request start time
    const ref = db.ref(`game_info/${rank}/${gid}/start_time`);
    const listner = ref.on('value', (snap)=>{
      if(snap.val()) setStartTime(snap.val());
    });
    return () => {
      ref.off('value', listner);
    };
  }, []);
  
  useEffect(() => {
    const end = checkEnd(minutes, seconds); // check if game end
    if(end) {
      // if game end, request score of two players and calc result
      // use IIFE to calc result
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

        // write result on databse and change user status to end
        db.ref(`game_info/${rank}/${gid}/result_object/${uid}/result`).set(result)
            .then(() => {
              db.ref(`user_info/${uid}/status_object/status`).set("End");
            });
      });
      return;
    }    
  }, [minutes, seconds]);

  useEffect(() => {
    const end = checkEnd(minutes, seconds); // check if game end
    if(!end && startTime){
      // if game still going on, change seconds and minutes every second
      const [leftM, leftS] = (function(game_time) {
        console.log(startTime)
        const passedTime = Math.round((Date.now() - startTime)/1000);
        const leftTime = game_time - passedTime;
        const leftM = Math.floor(leftTime/60);
        const leftS = leftTime - leftM * 60;
        return [leftM, leftS];
      })(GAME_TIME);

      const countdown = setInterval(() => {
        setSeconds(leftS)
        setMinutes(leftM)
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [startTime, minutes, seconds]);

  return (
    <Segment textAlign='center' inverted color='blue'>
      <h1>
        {displayMinutes}:{displaySeconds}
      </h1>
    </Segment>
  );
}

export default TimerBoard;