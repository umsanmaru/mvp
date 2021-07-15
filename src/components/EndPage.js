import React, {useState, useEffect} from 'react';
import { Grid, Button, Segment } from 'semantic-ui-react';
import CustomLoader from './CustomLoader';
import dbInit from '../firebase/databaseInit';

const db = dbInit();

const MAXGAME = 3; //number of game for one season
const MAXRANK = 3; // number of rank; bronze-silver-gold 

const resultMap = {
	win: {
		color: 'blue',
		text: 'You Win!!!'
	},
	lose: {
		color: 'red',
		text: 'You lose...'
	}
};

const rankUpdate = (result /** win or lose */ , uid, rank) => {
	// update rank of user by result
		const newRank = result === 'win' ? 
		Math.min(rank + 1, MAXRANK) : Math.max(rank - 1, 1);
	db.ref(`user_info/${uid}/rank`).set(newRank);
	db.ref(`user_info/${uid}/status_object/rank`).set(newRank);
};

const currentUpdate = (uid, rank, result /** win or lose */) => {
	// update current season record of user by result
	db.ref(`user_info/${uid}/current`).get().then((snap) => {
		const {win, lose} = snap.val();
		if (win + lose === MAXGAME - 1) {
			db.ref(`user_info/${uid}/current`).set({win:0, lose:0});
			rankUpdate(result, uid, rank);       
		} else {
			const newCurrent = (result === 'win' ? {win:win+1} : {lose:lose+1});
			db.ref(`user_info/${uid}/current`).update(newCurrent);
		}
	});  
};

const totalUpdate = (uid, result /** win or lose */) => {
	// update total record of user by result
	db.ref(`user_info/${uid}/total`).get().then((snap) => {
		const {win, lose} = snap.val();
		const newTotal = (result === 'win' ? {win:win+1} : {lose:lose+1});
		db.ref(`user_info/${uid}/total`).update(newTotal);
	});
};

const EndPage = ({uid, gid, rank}) => {
	const [resultObj, setResultObj] = useState();

	const onReturn = () => {
		// return to HomePage
		db.ref(`user_info/${uid}/status_object/status`).set("Home");
		db.ref(`matching_info/${rank}/${uid}`).set(null);
		db.ref(`user_info/${uid}/status_object/gid`).set(null);
	};

	useEffect(() => {
		// attach listner on result
		db.ref(`game_info/${rank}/${gid}/result_object/${uid}`).get()
				.then((snap) => {
					setResultObj(snap.val())
				});
	}, []);

	useEffect(() => {
		// update user record using result
		if (resultObj) {
			const {result, resultDone} = resultObj;
			if (resultDone) return; // return if result already reflected
			currentUpdate(uid, rank, result); // update current season record and rank
			totalUpdate(uid, result); // update total record
			db.ref(`game_info/${rank}/${gid}/result_object/${uid}/resultDone`)
					.set(true); // to indicate that result has reflected
		}    
	}, [resultObj])

	if (!resultObj) return <CustomLoader text={"결과 계산 중..."}/>
	else {
		const {color, text} = resultMap[resultObj.result];
		return (
			<Grid textAlign='center'>
				<Grid.Row style={{marginTop:'30vh', marginBottom:'15vh', height:'30vh', width:'50vw'}}>
					<Segment 
						size='massive' 
						inverted color={color}
						style={{width:'50vw'}} 
						textAlign='center'  
					>
						<h1 style={{marginTop:'6vh'}}>{text}</h1>
					</Segment>
				</Grid.Row>
				<Button onClick={onReturn}>돌아가기</Button>
			</Grid>
		);
	}
}

export default EndPage;