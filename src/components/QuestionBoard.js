import React, {useState, useEffect} from 'react'
import storageInit from '../firebase/storageInit'
import CustomLoader from './CustomLoader'
import { Grid, Segment, Form, Button } from 'semantic-ui-react'
import dbInit from '../firebase/databaseInit';

// number of questions used in one match
const NUM_QUESTION = 5;

const db = dbInit();
const storage = storageInit();

// list of cash img source
const imgCash = simpleListGenerator(null, NUM_QUESTION);

// generate length n list with item
function simpleListGenerator(item, n) {
	const outputList = [];
	for (let i=0; i<n; i++) outputList.push(item);
	return outputList;
}

const QuestionBoard = ({gid, uid, rank}) => {
	const [qNum, setQNum] = useState();
	// list of questions that will used in game
	const [qList, setQList] = useState(simpleListGenerator(0, NUM_QUESTION));
	// list of choices for question user is viewing
	const [choiceSet, setChoiceSet] = useState(simpleListGenerator(0, 5));
	const [imgSrc, setImgSrc] = useState();
	// answer for question uesr is viewing
	const [answer, setAnswer] = useState();
	const [checked, setChecked] = useState();

	const onSelectAnswer = (e, { value }) => {
		setChecked(value)
	}
	
	const onQuestionChange = (dbQNum)=>{
		if(qNum !== dbQNum){
			setQNum(dbQNum)
			setImgSrc(null)
		}
	}

	// button used for changing question
	const qSelectButton = qList.map((dbNum, index)=>{
		return (
			<div 
				onClick={() => onQuestionChange(dbNum)} 
				className={`ui ${dbNum===qNum ? "active" : ""} button`}
			>{`Q${index+1}`}</div>
		)
	});
	const renderedChoiceSet = choiceSet.map((choice, n) => {
		return <Form.Radio
			label={choice}
			value={n}
			checked={checked === n}
			onChange={onSelectAnswer}
		/>
	});

	const onSubmit = ()=>{
		const res = (checked === answer-1) ? "O" : "X"; // scoring
		db.ref(`game_info/${rank}/${gid}/scoring_object/${uid}/${qNum}`).get()
				.then((data) =>{
					console.log(qNum, data.val())
					const prev = data.val() ? data.val() : "";
					if(!prev.includes("O")){
						// add result if not already correct
						// Case1   prev: "X" res: "X" => "XX"
						// Case2   prev: "XO" res "O" => "XO" 
						// Case3   prev: "XO" res "X" => "XO"
						db.ref(`game_info/${rank}/${gid}/scoring_object/${uid}/${qNum}`)
								.set(prev+res)
					} 
				})
		if(res === "O"){
			// if correct, add question number to interaction list
			db.ref('user_interaction/' + uid).get().then((snap) => {
				(function(userInteraction, qNum) {
					if(!userInteraction.includes(qNum)) {
						userInteraction.push(qNum);
						db.ref('user_interaction/' + uid).set(userInteraction);  
					}
				})(snap.val() || [], qNum);
			})
		}				
	}

	useEffect(() => {
		// attach listner on question list
		const ref = db.ref(`game_info/${rank}/${gid}/question_list`)
		const listner = ref.on('value', (snap) => {
			if(snap.val()) {
				setQList(snap.val())
			}
		})
		return () => {
			ref.off('value', listner)
		}
	}, [])

	useEffect(() => {
		setQNum(qList[0])
	}, [qList])
	
	useEffect(() => {
		//check if qList is loaded
		if(!qNum) return
		// request question info to set choiceSet and answer
		db.ref('question_info/' + qNum).get().then((questionInfo)=>{
			if(questionInfo.exists()){
				questionInfo = questionInfo.val()
				const choiceSet = questionInfo["choices"]
				setChoiceSet(choiceSet)           
				const currentAns = questionInfo["answer"]
				setAnswer(currentAns)
			}else{
				setChoiceSet([1, 2, 3, 4, 5])
				setAnswer(1)
			}
		})
	}, [qNum])

	useEffect(() => {
		// check if qList is loaded
		if(!qNum) return
		// check if img cash exist
		if(imgCash[qNum]) {
			setImgSrc(imgCash[qNum])
			return
		}
		// request img source
		storage.ref(`questions/question${qNum}.jpg`).getDownloadURL().then((url)=>{
			imgCash[qNum] = url // cash img source
			setImgSrc(url)
		})
	}, [qNum])




	if(!qNum) return <CustomLoader text={"문제 생성중"}/> 
	return (
		<Segment textAlign='center'>
			{imgSrc ? null : <CustomLoader text={"문제 로딩중"}/>}
			<Grid.Row>
				{qSelectButton}          
			</Grid.Row>
			{imgSrc ? 
				<img width="100%" src={imgSrc} alt="why not working?"></img> :""}
			<Segment style={{paddingTop: '3vh'}}>
				<Form>
					<Form.Group widths='equal'>{renderedChoiceSet}</Form.Group>
				</Form>
				<Button style={{marginTop: '3vh'}} onClick={onSubmit}>제출</Button>
			</Segment>
		</Segment>        
	)
}

export default QuestionBoard;