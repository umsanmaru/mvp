import React, {useState, useEffect} from 'react';
import CustomLoader from './CustomLoader';
import HomePage from './HomePage';
import WaitingPage from './WaitingPage';
import PlayingPage from './PlayingPage';
import EndPage from './EndPage';
import dbInit from '../firebase/databaseInit';

const db = dbInit();

const CustomRouter = ({uid}) => {
	const [statusObj, setStatusObj] = useState({});
	
	const {status, gid, rank} = statusObj;
	
	useEffect(() => {
		// attach listner on status object
		const ref = db.ref("user_info/"+uid);
		const listener = ref.child('status_object').on('value', (snap) => {
			setStatusObj(snap.val());
		});
		return () => {
			ref.child('status_object').off('value', listener);
		};
	}, []);

	if (status === undefined) return <CustomLoader text={"정보를 불러오는 중..."}/>;

	else if (status === "Home") return <HomePage uid={uid} />

	else if (status === "Waiting") return <WaitingPage uid={uid} gid={gid} rank={rank} />

	else if (status === "Playing") return <PlayingPage uid={uid} gid={gid} rank={rank} />

	else if (status === "End") return <EndPage uid={uid} gid={gid} rank={rank} />
}

export default CustomRouter;