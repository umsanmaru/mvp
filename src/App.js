import React, {useState, useEffect} from 'react'
import Match from './components/Match'
import authInit from './firebase/authInit'
import LoginForm from './components/LoginLayout'
import SignUpForm from './components/SignUpLayout'
import dbInit from './firebase/databaseInit'
import MyPage from './components/MyPage'
import MatchingPage from './components/MatchingPage'
import LoaderV2 from './components/Loader'
import { Grid, Button } from 'semantic-ui-react'
import ErrorMessage from './components/ErrorMessage'

const auth = authInit()
const db = dbInit()

const App = () => {
    
    const [uid, setUid] = useState('unChecked')
    const [gid, setGid] = useState(null)
    const [oid, setOid] = useState(null)
    const [userInfo, setUserInfo] = useState(null)
    const [opponentInfo, setOpponentInfo] = useState(null)
    const [status, setStatus] = useState('rendering')   
    const [message, setMessage] = useState(null)

    const userRef = db.ref('user_info/' + uid)

    const getUserInfo = async function() {
        const userInfo = await userRef.get().then((snapshot) => {
            if(snapshot.exists()){
                const currentUserInfo = snapshot.val()
                console.log(currentUserInfo)
                setUserInfo(currentUserInfo)
                return currentUserInfo    
            }
        })
        return userInfo
    }

    const getGid = async function() {
        const gid = userRef.child('game_id').get('value').then((snapshot) => {
            if(snapshot.exists()) {
                const currentGid = snapshot.val()
                setGid(currentGid)
                return currentGid
            }
        })
        return gid
    }

    const getOid = async function(rank, gid) {
        console.log(rank)
        const oid = 
            db.ref('game_list/' + 'bronze/' + gid +'/player_object')
                .get().then((snapshot) => {
                    if(snapshot.exists()){
                        const playerObject = snapshot.val()
                        console.log(playerObject)
                        Object.keys(playerObject).map((id) => {
                            if(id !== uid && !opponentInfo) {
                                setOpponentInfo(playerObject[id])
                                setOid(id)
                                return id
                            }
                        })    
                    }       
            })
        return oid
    }
        
    useEffect(() => {
        setMessage(null)
    }, [status]);

    useEffect(() => {
        if(!uid) return
        let listener = userRef.child('status').on('value', (snapshot) => {
            const currentStatus = snapshot.val()
            if( currentStatus !== status ) { 
                setStatus(currentStatus)
            }
        })
        return () => {
            userRef.child('status').off('value', listener)
        }
    }, [uid])

    useEffect(() => {
        if(status === 'isWaiting'){
            setOpponentInfo(null)
            setOid(null)
            setGid(null)
            getUserInfo()
        }
    }, [status])

    useEffect(() => {
        if(status === 'isMatched' || 'isPlaying'){
            if(!oid){
                getUserInfo().then((userInfo) => {
                    if(!userInfo) return
                    getGid().then((gid) => {
                        if(!gid) return
                        getOid(userInfo["rank"], gid)
                    })
                })
                return
            }
            if(!gid) {
                console.log(gid)
                getGid()
            }
            if(!userInfo) getUserInfo()
        }
    }, [status])

    auth.onAuthStateChanged((user) => {
        if (user) {
          // User is signed in
          let currentUid = user.uid
          if(currentUid !== uid) setUid(currentUid)
        } else {
            setUid(null)
            if(status === 'rendering') setStatus(null)
        }
    });
    
    const onLogin = () => {
        // setIsLoading(true)
        const [id, password] = document.querySelectorAll('input')
        auth.signInWithEmailAndPassword(id.value, password.value).then(
            console.log('Success')
        ).catch((error)=>{
            setMessage(error.message)
        })

    }

    const onSignUp = () => {
        // TODO: controlled state
        const [
            id, 
            password, 
            name, 
            nickName,
            school
        ] = document.querySelectorAll('input')
        
        const [grade, rating] = document.querySelectorAll('div.divider.text')

        if(!grade || !rating || !name.value || !nickName.value || !school.value){
            setMessage("Please fill in all forms.")
            return
        }
        let rank = 1
        // TODO: variable condition check
        auth.createUserWithEmailAndPassword(id.value, password.value)
        .then((userCredential) => {
            // Sign in   
            let uid = userCredential.user.uid
            db.ref('user_info/' + uid).set({
                name: name.value, 
                nick_name: nickName.value, 
                school: school.value,
                grade: grade.innerHTML,
                rating: rating.innerHTML,
                rank: rank,
                status: 'isWaiting',
                current: {win: 0, lose:0},
                total: {win: 0, lose: 0},
            }).catch((error) => console.log(error.message))

            db.ref('user_interaction/' + uid).set([0])
        })
        .catch((error) => {
            setMessage(error.message)
            console.log(error.message)
        });

    }

    const onLogout = () => {
        db.ref('user_info/' + uid + "/status" ).set('isWaiting').then(() => {auth.signOut()})
        setStatus('login')
    }
    
    const onSignUpLoad = () => {
        setStatus('signUp')
    }

    const onLoginLoad = () => {
        setStatus('login')
    }

    const onCancle = () => {
        db.ref('user_info/' + uid + '/status').set('isWaiting')
        db.ref('matching_info/bronze/' + uid).set(null)
        db.ref('user_info/' + uid + '/game_id').set(null)
    }

    console.log(uid, gid, oid, opponentInfo, status)

    if( status === 'rendering' || uid === 'unChecked') return <LoaderV2 text="로딩 중..."/>

    if( !uid ){
        if(status === 'signUp') return (
            <Grid>
                <Grid.Column>
                    <SignUpForm onSignUp={onSignUp} onLoginLoad={onLoginLoad}>
                        {message ? <ErrorMessage errorMessage={message}/> : null}
                    </SignUpForm>
                </Grid.Column> 
            </Grid>     
        )
        else return (
            <Grid>
                <Grid.Column>
                    <LoginForm onLogin={onLogin} onSignUpLoad={onSignUpLoad}>
                        {message ? <ErrorMessage errorMessage={message}/> : null}
                    </LoginForm>
                </Grid.Column>
            </Grid>     
        )
    }

    else {
        if(status === 'isWaiting') {
            if(!uid || !userInfo) return <LoaderV2 text={'정보를 불러오는 중...'}/>
            else {
                return(
                    <MyPage onLogout={onLogout} uid={uid} userInfo={userInfo}/>
                )
            }
        }
        
        else if(status === 'isMatching') return (
            <Grid textAlign='center'>
                <Grid.Row style={{marginTop:'15vh', height:'70vh'}}>
                    <LoaderV2 text="매칭 중..." />
                </Grid.Row>
                <Button onClick={onCancle}> 취소하기 </Button>
            </Grid>
        )
        else if(status === 'isMatched') {
            if( !uid || !gid || !userInfo || !opponentInfo ) return (
                <LoaderV2 text={'게임을 불러오는 중...'}/>
            )
            return (
                <MatchingPage 
                    uid={uid} 
                    gid={gid}
                    userInfo={userInfo} 
                    opponentInfo={opponentInfo}
                />
            )
        }
        else if(status === 'isPlaying') {
            if( !uid || !gid || !oid || !userInfo || !opponentInfo ) return (
                <LoaderV2 text={'로딩 중...'}/>
            )
            return (
                <Match 
                    uid={uid}
                    oid={oid}
                    gid={gid} 
                    userInfo={userInfo}
                    opponentInfo={opponentInfo}
                />
            )
        }
        else return (
            <Grid textAlign='center'>
                <Grid.Row style={{marginTop:'15vh', height:'70vh'}}>
                    <LoaderV2 text="장시간 지속되면 아래 버튼을 누르세요." />
                </Grid.Row>
                <Button onClick={onLogout}> 처음으로 </Button>
            </Grid>
        )
    }
}

export default App;