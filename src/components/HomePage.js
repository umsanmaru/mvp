import React, {useState, useEffect} from 'react';
import { Grid, Button, Container, Segment } from 'semantic-ui-react';
import Rules from './Rules';
import ButtonBoard from './ButtonBoard';
import CustomLoader from './CustomLoader';
import dbInit from '../firebase/databaseInit';
import authInit from '../firebase/authInit';

const db = dbInit();
const auth = authInit();

const HomePage = ({uid}) => {
    const [userInfo, setUserInfo] = useState({});
    const [matching, setMatching] = useState(false);

    const name = userInfo.name || "ooo";
    const rank = userInfo.rank || "ooo";

    const onLogout = () => {
        db.ref('user_info/' + uid + "/status").set('isWaiting');
        auth.signOut();
    };

    const onPlay = () => {
        if (userInfo.rank) {
            db.ref("matching_info" + '/bronze/' + uid).set("placeholder");
            setMatching(true);
        }
    };

    const onCancle = () => {
        db.ref(`matching_info/bronze/${uid}`).set(null);
        db.ref(`user_info/${uid}/status_object/gid`).set(null);
        setMatching(false);
    };

    useEffect(() => {
        db.ref("user_info/"+uid).get().then((snap)=>{
            setUserInfo(snap.val());
        });
    }, []);

    console.log(uid);
    if (matching) return <CustomLoader text={"매칭 중..."} onClick={onCancle} />
    return (
        <Grid textAlign='center' verticalAlign='middle'>
            <Grid.Row>
            <Container fluid textAlign='right' style={{marginTop: '1vh', marginBottom:'5vh'}}>
                {`안녕하세요 ${name} 님`}  
                <Button style={{marginLeft: '1vw', marginRight:'2vw'}} onClick={onLogout}>Logout</Button>
            </Container>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column style={{ maxWidth: 600}}>
                    <ButtonBoard 
                        boardName={'rank'}
                        onClick={onPlay} 
                        userInfo={userInfo} 
                        text={'PLAY'}
                        icon={'trophy'}
                    /> 
                    <Segment raised textAlign='left'>
                        <Rules/>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>     
    );
};

export default HomePage;