# 1:1 Matching Math Competition Application
- 실력이 비슷한 두 유저를 온라인에서 매칭
- 제한시간동안 수학문제 5개를 풀어 승패를 정함
- 승패에 따라 3경기를 주기로 승격 강등이 정해짐

## 1. Getting started
#### - Open local server
    npm init
    npm install
    npm start
브라우저에서 http://localhost:3000 을 여시면 App을 보실 수 있습니다.
서로 다른 기기, 또는 한 기기 내의 서로 다른 두 브라우저에서 App을 여시고 다른 e-mail로 sign-in 하시면 매칭을 시킬 수 있습니다.

#### - Firebase hosting
    https://mvp-db-ecbe5.web.app/
firebase hosting을 통한 배포 버전 링크입니다.

## 2. App Spec

#### - Server
firebase storage와 firebase realtime database를 이용해 serverless 형태로 구현했습니다.

#### - Client
React와 semantic-ui를 이용해 구현했습니다.

## 3. App Detail

#### - Routing
App.js에서 Auth 상태에 따라 AuthPage 또는 CustomRouter를 랜더링합니다.  
CustomRouter.js 에서 Status Object의 값에 따라 페이지를 랜더링합니다.  
status는 유저의 상황에 따라 Home / Waiting / Playing / End 의 값을 가집니다.

#### - Pages
페이지는 status에 따라 유저가 보게되는 화면을 뜻합니다.  

    1 .AuthPage
    login 또는 signin을 하는 페이지입니다.

    2. HomePage
    login 후 매칭 전에 대기하는 페이지입니다.  

    3. WaitingPage
    매칭 후 경기 시작 전 대기하는 페이지입니다.  

    4. PlayingPage
    경기를 진행하는 페이지입니다.  

    5. EndPage
    경기가 끝난 후 결과를 보여주는 페이지입니다.    

#### - Boards
보드는 페이지를 구성하는 컴포넌트들입니다.  

    1. RuleBoard
    HomePage에서 규칙이 써진 컴포넌트를 랜더합니다.  

    2. ButtonBoard
    HomePage와 WaitingPage에서 유저 프로필과 각각 play버튼, ready버튼을 랜더합니다.     

    3. QuestionBoard
    PlayingPage에서 문제, 선택지, 제출 버튼을 랜더합니다.  

    4. UserBoard
    PlayingPage에서 각 유저의 프로필, 채점 현황, 총점을 랜더합니다.  

    5. TimerBoard
    PlayingPage에서 타이머를 랜더합니다.
