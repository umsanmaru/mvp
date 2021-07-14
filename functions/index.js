const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp(functions.config().firebase);

const db = admin.database();
const TOTAL_QUESTION_NUM = 40;

exports.onGameCreated = functions.database.ref("game_info/{rank}/{gameId}")
    .onCreate((_, context) => {
      const rank = context.params.rank;
      const gid = context.params.gameId;
      db.ref(`game_info/${rank}/${gid}/player_object`)
          .on("value", (snap) => {
            if (!snap.val()) return null;
            else {
              const qList = (async function(playerObj, totalQ) {
                let interaction_list = [];
                const qList = [];
                for (const playerId in playerObj) {
                  const player_interaction = await db.ref(
                    `user_interaction/${playerId}`).get();
                  interaction_list += player_interaction.val();
                }
                for (let n=1; n<totalQ; n++) {
                  if (!interaction_list.includes(n)) {
                    qList.push(n);
                    if (qList.length == 5) break;
                  }
                }
                return qList
              })(snap.val(), TOTAL_QUESTION_NUM);
              qList.then((qList) => {
                db.ref(`game_info/${rank}/${gid}/question_list`)
                      .set(qList);
                console.log(qList);
              });
              qList.then((qList) => {
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
          const players = snap.val();
          const userId = context.params.playerId;
          const opponentId = (function(players) {
            for (const playerId in players) {
              if (playerId !== userId &&
                players[playerId] === "placeholder") return playerId;
            }
            return null;
          })(players);
          if (opponentId === null) {
            db.ref(`matching_info/${rank}`).off("value", onPlayerAdded);
            return null;
          }
          const transactionResult = (async function() {
            return await db.ref(`matching_info/${rank}`)
              .transaction((players) => {
                if (players) {
                  if (players[opponentId] !== "placeholder" ||
                      players[userId] !== "placeholder") {
                    return;
                  } else {
                    players[opponentId] = "isMatched";
                    players[userId] = "isMatched";
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
                      .set({gid: gid, status: "isMatched"});
              db.ref(`user_info/${opponentId}/status_object`)
                      .set({gid: gid, status: "isMatched"});
            });
          });
          db.ref(`matching_info/${rank}`).off("value", onPlayerAdded);
        }
      };
      db.ref(`matching_info/${rank}`).on("value", onPlayerAdded);
      return null;
    });
