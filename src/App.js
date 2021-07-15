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
}


export default App;