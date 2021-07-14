import React, {useState} from 'react'
import { Grid } from 'semantic-ui-react'
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import ErrorMessage from './ErrorMessage';
import authInit from '../firebase/authInit';
import dbInit from '../firebase/databaseInit';


const SIGNUP = 0;
const LOGIN = 1;
const auth = authInit();
const db = dbInit();

const AuthPage = () => {
  const [form, setForm] = useState(LOGIN);
  const [message, setMessage] = useState();

  const onLogin = (id, password) => {
    auth.signInWithEmailAndPassword(id, password)
      .catch((error)=>{
        setMessage(error.message)
      });
  }

  const onSignUp = (signUpInfo) => {
    // TODO: controlled state
		console.log(signUpInfo)
    const [
			id, 
			password, 
			name, 
			nickName,
			school,
			grade,
			rating
		] = signUpInfo;

		for ( var i=0; i<signUpInfo.length; i++ ) {
			if (!signUpInfo[i]) {
				setMessage("Please fill in all forms.");
				return;
			}
		}

		auth.createUserWithEmailAndPassword(id, password)
			.then((userCredential) => {
					// Sign in   
					let uid = userCredential.user.uid
					db.ref('user_info/' + uid).set({
							id: uid,
							name: name, 
							nick_name: nickName, 
							school: school,
							grade: grade,
							rating: rating,
							rank: rating,
							status_object: {
								status: 'isWaiting'
							},
							current: {win: 0, lose:0},
							total: {win: 0, lose: 0},
					});

					db.ref('user_interaction/' + uid).set([0]);
			})
			.catch((error) => {
					setMessage(error.message);
			});

	};

	const onSignUpLoad = () => {
		setForm(SIGNUP);
	};

	const onLoginLoad = () => {
		setForm(LOGIN);
	};

	const formComponent = form === LOGIN ? ( 
		<LoginForm onLogin={onLogin} onSignUpLoad={onSignUpLoad}>
				{message ? <ErrorMessage errorMessage={message}/> : null}
		</LoginForm>
	):( 
		<SignUpForm onSignUp={onSignUp} onLoginLoad={onLoginLoad}>
				{message ? <ErrorMessage errorMessage={message}/> : null}
		</SignUpForm>
	);
	
	return(
		<Grid>
				<Grid.Column>
						{formComponent}              
				</Grid.Column> 
		</Grid> 
	);
}

export default AuthPage;