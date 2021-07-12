import React, {useState, useEffect} from 'react'
import storageInit from '../firebase/storageInit'
import LoaderV2 from './Loader'
import { Grid, Segment, Form, Button } from 'semantic-ui-react'

var storage = storageInit()
var imgCash = [null, null, null, null, null]

const QuestionBoard = ({gid, uid, db}) => {
    const [qNum, setQNum] = useState(null)
    const [qList, setQList] = useState([])
    const [choiceSet, setChoiceSet] = useState([])
    const [imgSrc, setImgSrc] = useState(null)
    const [answer, setAnswer] = useState(null)
    const [checked, setChecked] = useState(0)
    let qSelectButton = null
    let renderedChoiceSet = null

    console.log(qList)
    const handleChange = (e, { value }) => {
        setChecked(value)
    }
    
    const onQNumClick = (dbQNum)=>{
        if(qNum !== dbQNum){
            setQNum(dbQNum)
            setImgSrc(null)
        }
    }

    useEffect(() => {
        if(!qNum) setQNum(qList[0])
    }, [qList])

    useEffect(() => {
        const ref = db.ref("game_list/bronze/" + gid + '/qList')
        const listner = ref.on('value', (snap) => {
            if(snap.val()) {
                setQList(snap.val())
            }
        })
        return () => {
            ref.off('value', listner)
        }
    }, [gid])
    
    

    useEffect(() => {
        if(!qNum) return
        db.ref('question_info/' + qNum).get().then((questionInfo)=>{
            if(questionInfo.exists()){
                questionInfo = questionInfo.val()
                const choiceSet = questionInfo["choices"]
                setChoiceSet(choiceSet)           
                const currentAns = questionInfo["answer"]
                setAnswer(currentAns)
            }else{
                setChoiceSet([1, 2, 3, 4, 5])
                setChecked(0)
                setAnswer(1)
            }
        })
    }, [qNum])

    useEffect(() => {
        console.log(imgCash[qNum])
        if(!qNum) return
        if(imgCash[qNum]) {
            setImgSrc(imgCash[qNum])
            return
        }
        storage.ref(`questions/question${qNum}.jpg`).getDownloadURL().then((url)=>{
            console.log(url)
            imgCash[qNum] = url
            setImgSrc(url)
        })
    }, [qNum])


    const onSubmit = ()=>{
        const res = (checked == answer-1) ? "O" : "X"
        db.ref('game_list/bronze/' + gid + '/scoring/' + uid + '/' + qNum).get()
            .then((data) =>{
                const prev = data.val() ? data.val() : ""
                if(!prev.includes("O")){
                    db.ref('game_list/bronze/' + gid + '/scoring/' + uid + '/' + qNum)
                        .set(prev+res)
                } 
            })
        if(res === "O"){
            db.ref('user_interaction/' + uid).get().then((snap) => {
                let userInteraction = snap.val()
                console.log(userInteraction)
                if(!userInteraction){
                    db.ref('user_interaction/' + uid).set({0: qNum})
                }else{
                    console.log(userInteraction)
                    if(!userInteraction.includes(qNum)) userInteraction.push(qNum)
                    db.ref('user_interaction/' + uid).set(userInteraction)        
                }
            })
        }
            
    }

    if(choiceSet){
        renderedChoiceSet = choiceSet.map((choice, n) => {
            return <Form.Radio
                label={choice}
                value={n}
                checked={checked === n}
                onChange={handleChange}
            />
        })
    }

    if(qList){
        qSelectButton = qList.map((dbQNum, index)=>{
            return (
                <div 
                    onClick={() => onQNumClick(dbQNum)} 
                    className={`ui ${dbQNum===qNum ? "active" : ""} button`}
                >{`Q${index+1}`}</div>
            )
        })
    }

    if(qList.length === 0) return <LoaderV2 text={"문제 생성중"}/> 
    return (
        <Segment textAlign='center'>
            {imgSrc ? null : <LoaderV2 text={"문제 로딩중"}/>}
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

export default QuestionBoard