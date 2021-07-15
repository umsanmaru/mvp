## Getting started

### `npm start`

브라우저에서 http://localhost:3000 을 여시면 App을 보실 수 있습니다.
서로 다른 기기, 또는 한 기기내의 서로 다른 두 브라우저에서 App을 여시고 다른 e-mail로 signin 하시면 매칭을 시킬 수 있습니다.

## App purpose

온라인 상에서 같은 등급의 학생을 매칭하고, 동일한 수학 문제를 풀면서 경쟁하는 App입니다. 

## App Spec

firebase를 이용해 serverless 형태로 구현했습니다.
React와 semantic-ui를 이용해 front-end를 구현했습니다.

## App structure

#### Routing

App.js에서 Auth 상태에 따라 AuthPage 또는 CustomRouter를 랜더링합니다.
CustomRouter.js 에서 Status Object의 값에 따라 페이지를 랜더링합니다.
status는 유저의 상황에 따라 Home / Waiting / Playing / End 의 값을 가집니다.

#### Pages

페이지는 status에 따라 유저가 보게되는 화면을 뜻합니다.

#### AuthPage:
login 또는 signin을 하는 페이지입니다.

#### HomePage:
login 후 매칭 전에 대기하는 페이지입니다.  

#### WaitingPage:
매칭 후 경기 시작 전 대기하는 페이지입니다.  

#### PlayingPage:
경기를 진행하는 페이지입니다.  

#### EndPage:
경기가 끝난 후 결과를 보여주는 페이지입니다.    

### Boards

보드는 페이지를 구성하는 컴포넌트들입니다.

#### RuleBoard:
HomePage에서 규칙이 써진 컴포넌트를 랜더합니다.

#### ButtonBoard:
HomePage와 WaitingPage에서 유저 프로필과 각각 play버튼, ready버튼을 랜더합니다. 

#### QuestionBoard:
PlayingPage에서 문제, 선택지, 제출 버튼을 랜더합니다.

#### UserBoard:
PlayingPage에서 각 유저의 프로필, 채점 현황, 총점을 랜더합니다.

#### TimerBoard:
PlayingPage에서 타이머를 랜더합니다.

