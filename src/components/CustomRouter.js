import React, {useState, useEffect} from 'react';
import CustomLoader from './CustomLoader';
import HomePage from './HomePage';
import WaitingPage from './WaitingPage';
import PlayingPage from './PlayingPage';
import EndPage from './EndPage';
import dbInit from '../firebase/databaseInit';

const HOME = "isWaiting";
const WAITING = "isMatched";
const PLAYING = "isPlaying";
const END = "End"

const db = dbInit();

const CustomRouter = ({uid}) => {
    const [statusObj, setStatusObj] = useState({});

    const {status, gid, rank} = statusObj;
    
    useEffect(() => {
        const ref = db.ref("user_info/"+uid);
        const listener = ref.child('status_object').on('value', (snap) => {
            // update status
            setStatusObj(snap.val());
        });
        return () => {
            ref.child('status_object').off('value', listener);
        };
    }, []);

    console.log(status)

    if (status === undefined) return <CustomLoader text={"정보를 불러오는 중..."}/>;

    else if (status === HOME) return <HomePage uid={uid} />

    else if (status === WAITING) return <WaitingPage uid={uid} gid={gid} rank={"bronze"} />

    else if (status === PLAYING) return <PlayingPage uid={uid} gid={gid} rank={"bronze"} />

    else if (status === END) return <EndPage uid={uid} gid={gid} rank={"bronze"} />
}

export default CustomRouter;