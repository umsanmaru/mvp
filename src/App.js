import React, {useState} from 'react';
import AuthPage from './components/AuthPage';
import authInit from './firebase/authInit';
import CustomLoader from './components/CustomLoader';
import CustomRouter from './components/CustomRouter';

const auth = authInit();

const App = () => {
    
    const [uid, setUid] = useState()   

    auth.onAuthStateChanged((user) => {
        if (user) setUid(user.uid)
        else setUid(null)
    });

    if (uid === undefined) return <CustomLoader text="로딩 중..." />;

    else if (uid === null) return <AuthPage />;

    else return <CustomRouter uid={uid} />; 

    // <MyPage onLogout={onLogout} uid={uid}/>;
    
    // if(status === 'isMatching') return (
    //     
    // )
    // if(status === 'isMatched') {
    //     if( !uid || !gid || !userInfo || !opponentInfo ) return (
    //         <CustomLoader text={'게임을 불러오는 중...'}/>
    //     )
    //     return (
    //         <MatchingPage 
    //             uid={uid} 
    //             gid={gid}
    //             userInfo={userInfo} 
    //             opponentInfo={opponentInfo}
    //         />
    //     )
    // }
    
    // if(status === 'isPlaying') {
    //     if( !uid || !gid || !oid || !userInfo || !opponentInfo ) return (
    //         <CustomLoader text={'로딩 중...'}/>
    //     )
    //     return (
    //         <Match 
    //             uid={uid}
    //             oid={oid}
    //             gid={gid} 
    //             userInfo={userInfo}
    //             opponentInfo={opponentInfo}
    //         />
    //     )
    // }
    
    // return (
    //     <Grid textAlign='center'>
    //         <Grid.Row style={{marginTop:'15vh', height:'70vh'}}>
    //             <CustomLoader text="장시간 지속되면 아래 버튼을 누르세요." />
    //         </Grid.Row>
    //         <Button onClick={onLogout}> 처음으로 </Button>
    //     </Grid>
    // )
}


export default App;