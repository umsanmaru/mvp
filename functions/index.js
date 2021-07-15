const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp(functions.config().firebase);

const db = admin.database();

/**
* @name TOTAL_QUESTION_NUM
* @description total number of questions uploaded on storage
*/
const TOTAL_QUESTION_NUM = 40;

exports.onGameCreated = functions.database.ref("game_info/{rank}/{gameId}")
    .onCreate((_, context) => {
      const rank = context.params.rank;
      const gid = context.params.gameId;
      db.ref(`game_info/${rank}/${gid}/player_object`)
          .on("value", (snap) => {
            //
            if (!snap.val()) return null;
            else {
              /**
              * @name playerObj
              * @description object conatains userInfo of two players
              */
              const playerObj = snap.val();
              /**
              * @name qList
              * @description array of questions for game
              * use IIFE to get qList
              */
              const qList = (async function(totalQ) {
                /**
                * @name interactionList
                * @description array of questions user had already solved
                */
                let interactionList = [];
                const qList = [];
                for (const playerId in playerObj) {
                  const player_interaction = await db.ref(
                    `user_interaction/${playerId}`).get();
                  interactionList += player_interaction.val();
                }
                for (let n=1; n<totalQ; n++) {
                  if (!interactionList.includes(n)) {
                    qList.push(n);
                    if (qList.length == 5) break;
                  }
                }
                return qList
              })(TOTAL_QUESTION_NUM);
              qList.then((qList) => {
                db.ref(`game_info/${rank}/${gid}`)
                    .update({question_list: qList, start_time: Date.now()});
              });
              qList.then((qList) => {
                /**
                * @name scoringObj
                * @description status of two players scoring for each questions
                */
                const scoringObj = {};
                qList.map((qNum) => {scoringObj[qNum] = 0});
                for (const playerId in playerObj) {
                  db.ref(`game_info/${rank}/${gid}/scoring_object/${playerId}`)
                      .set(scoringObj);
                }
              });
              return 1;
            }
          });
    });

exports.onUserAdded = functions.database.ref("matching_info/{rank}/{playerId}")
    .onCreate((_, context) => {
      const rank = context.params.rank;
      const onPlayerAdded = function(snap) {
        if (!snap.exists()) {
          return null;
        } else {
          /**
          * @name players
          * @description list of players on matching list
          */
          const players = snap.val();
          const userId = context.params.playerId;
          /**
          * @name opponentId
          * @description set first player on matching list as opponent
          * if no one is on matching list, set null
          */
          const opponentId = (function() {
            for (const playerId in players) {
              if (playerId !== userId &&
                players[playerId] === "placeholder") return playerId;
            }
            return null;
          })();
          if (opponentId === null) {
            db.ref(`matching_info/${rank}`).off("value", onPlayerAdded);
            return null;
          }
          /**
          * use transaction to prevent one user matched to more then two users
          * placeholer - user is still waiting
          * matched - user had matched with other user
          */
          const transactionResult = (async function() {
            return await db.ref(`matching_info/${rank}`)
              .transaction((players) => {
                if (players) {
                  
                  if (players[opponentId] !== "placeholder" ||
                      players[userId] !== "placeholder") {
                    return;
                  } else {
                    players[opponentId] = "matched";
                    players[userId] = "matched";
                  }
                }
                return players;
              });
          })();
          transactionResult.then((transactionResult)=>{
            if (!transactionResult.committed) {
              db.ref(`matching_info/${rank}`).off("value", onPlayerAdded);
              return;
            }
            /**
            * @name playerObj
            * @description object conatains userInfo of two players
            * use IIFE to get playerObj
            */
            const playerObj = (async function() {
              const playerObj = {};
              const userSnap = 
                await db.ref(`user_info/${userId}`).get();
              const opponentSnap = 
                await db.ref(`user_info/${opponentId}`).get();
              playerObj[userId] = userSnap.val();
              playerObj[opponentId] = opponentSnap.val();
              return playerObj;
            })();
            playerObj.then((playerObj) => {
              console.log(playerObj);
              const gameRef = db.ref(`game_info/${rank}`).push({
                player_object: playerObj,
              });
              const gid = gameRef.key;
              db.ref(`user_info/${userId}/status_object`)
                      .update({gid: gid, status: "Waiting"});
              db.ref(`user_info/${opponentId}/status_object`)
                      .update({gid: gid, status: "Waiting"});
            });
          });
          db.ref(`matching_info/${rank}`).off("value", onPlayerAdded);
        }
      };
      db.ref(`matching_info/${rank}`).on("value", onPlayerAdded);
      return null;
    });
