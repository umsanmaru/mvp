import React, {useState, useEffect} from 'react'
import ScoringUnit from './ScoringUnit'
import { Grid, Segment } from 'semantic-ui-react'
import dbInit from '../firebase/databaseInit';

const NUM_QUESTION = 5;

const db = dbInit();

function simpleListGenerator(item, n) {
	// generate list length n using item
	const outputList = [];
	for (let i=0; i<n; i++) outputList.push(item);
	return outputList;
}

const UserBoard = ({gid, rank, userInfo}) => {
const [scoring, setScoring] = useState(simpleListGenerator(0, NUM_QUESTION));
const [sum, setSum] = useState(0);
const [uid, setUid] = useState();

const nickName = userInfo.nick_name || "ooo";
const school = userInfo.school || "ooo";
const grade = userInfo.grade || 0;
const rating = userInfo.rating || 0;

const scoringBoard = scoring.map(
	(state, qNum)=> <ScoringUnit state={state} qNum={qNum}/>
);

useEffect(() => {
	// set uid from userInfo
	// this is because userBoard rendered for both user and opponent
	if (userInfo) {
		setUid(userInfo.id);
	}
}, [userInfo]);

useEffect(() => {
	// attach listner for scoring if uid is loaded
	if(!uid) return;
	const ref = db.ref(`game_info/${rank}/${gid}/scoring_object/${uid}`);
	const listner = ref.on('value', (data) =>{
		if (data.exists()){
			const current = Object.values(data.val());
			setScoring(current);
		}
	});
	return () => {
		ref.off('value', listner);
	};
}, [uid]);

useEffect(() => {
	// change sum whenever scoring change
	// use IIFE to calculate sum
	const sum = (function(scoring) {
		let sum = 0;
		scoring.map((score)=>{
			if (!score) return;
			const correctCount = score.split("O").length-1;
			const wrongCount = score.split("X").length-1;
			sum += Math.max(
				// correct: 4point  wrong: -1point
				4*correctCount - wrongCount, 0
			);
		})
		if(sum<0) sum = 0
		return sum;
	})(scoring);
	setSum(sum);
}, [scoring]);

useEffect(() => {
	// update final score of user whenever sum change
	if (!uid) return;
	db.ref(`game_info/${rank}/${gid}/score/${uid}`)
			.set({total: sum, timeAt: Date.now()});
}, [sum, uid]);

return (
	<div>
		<Segment color='grey'>
			<Grid textAlign='center'>
				<Grid.Row>
					<h2>{nickName}</h2>
				</Grid.Row>
				<Grid.Row>
					<h4>
						{`${school} / ${grade}학년 / 모의고사 ${rating}등급`}
					</h4>
				</Grid.Row>
			</Grid>
		</Segment>
		<Segment color='grey'>
			{scoringBoard}
			<Segment textAlign='center' style={{marginTop:'3vh'}}>
				<h3>{`현재 점수: ${sum}`}</h3>
			</Segment>
		</Segment>
	</div>
)
}

export default UserBoard;