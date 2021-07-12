import React, {useState, useEffect} from 'react'
import {Segment} from 'semantic-ui-react'

const Timer = ({uid, db, gid}) => {
    const [startTime, setStartTime] = useState(null)
    const [minutes, setMinutes] = useState("0");
    const [seconds, setSeconds] = useState("0");

    useEffect(() => {
      const ref = db.ref('game_list/bronze/' + gid + '/startTime/' + uid)
      const listner = ref.on('value', (snap)=>{
        if(!startTime && snap.val()){
          setStartTime(snap.val())
        }
      })
      return () => {
        ref.off('value', listner)
      }
    }, [gid, uid])
    
    useEffect(() => {
      if(minutes<0 || (minutes===0 && seconds===0)) {
        console.log('here')
        setSeconds(0)
        setMinutes(0)
        db.ref('game_list/bronze/' + gid + '/isOver').set(true)
        return 
      }

      if(startTime){
        const currentTime = Date.now()
        const passedTime = Math.round((currentTime - startTime)/1000)
        const leftTime = 2400 - passedTime
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

export default Timer