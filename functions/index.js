const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp(functions.config().firebase);

const db = admin.database();

exports.onGameCreated = functions.database.ref("game_list/{rank}/{gameId}")
    .onCreate((snap, context) => {
      const rank = context.params.rank;
      const gid = context.params.gameId;
      db.ref("game_list/" + rank + "/" +gid + "/player_object")
          .on("value", (snap) => {
            if (!snap.val()) return null;
            else {
              const userList = Object.keys(snap.val());
              const uidA = userList[0];
              const uidB = userList[1];
              const totalQ = 40;
              let n;
              const qList = [];
              console.log(uidA, uidB);
              db.ref("user_interaction/" + uidA).get().then((snapA) => {
                db.ref("user_interaction/" + uidB).get().then((snapB) => {
                  const interactionA = Object.values(snapA.val());
                  const interactionB = Object.values(snapB.val());
                  for (n=1; n<totalQ; n++) {
                    if (!interactionA.includes(n) &&
                      !interactionB.includes(n)) {
                      qList.push(n);
                      if (qList.length == 5) break;
                    }
                  }
                }).then(() => {
                  db.ref("game_list/" + rank + "/" + gid + "/qList")
                      .set(qList);
                  const scoringObj={};
                  let i;
                  for (i=0; i<qList.length; i++) {
                    scoringObj[qList[i]] = 0;
                  }
                  db.ref("game_list/" + rank + "/" + gid + "/player_object")
                      .get().then((snap) => {
                        if (snap.exists()) {
                          const playerList = Object.keys(snap.val());
                          playerList.forEach((playerId) => {
                            db.ref("game_list/" + rank +
                                "/" + gid +"/scoring/" + playerId)
                                .set(scoringObj);
                          });
                        }
                      }).catch((error) => {
                        console.log("game making error1", error);
                      });
                }).catch((error) => {
                  console.log("game making error2", error);
                });
              }).catch((error) => {
                console.log("game making error3", error);
              });
              return 1;
            }
          });
    });

exports.onUserAdded = functions.database.ref("matching_info/{rank}/{playerId}")
    .onCreate((snap, context) => {
      const rank = context.params.rank;
      console.log(rank);
      const onPlayerAdded = function(snap) {
        if (!snap.exists()) {
          return null;
        } else {
          const players = snap.val();
          let secondPlayer = null;
          Object.entries(players).forEach((player) => {
            if (player[0] !== context.params.playerId &&
                player[1] === "placeholder") {
              secondPlayer = player;
            }
          });
          if (secondPlayer === null) return null;
          const opponentId = secondPlayer[0];
          const playerId = context.params.playerId;

          db.ref("matching_info/" + rank)
              .transaction((players) => {
                if (players) {
                  if (players[opponentId] !== "placeholder" ||
                      players[playerId] !== "placeholder") {
                    secondPlayer = null;
                    return;
                  } else {
                    players[opponentId] = "isMatched";
                    players[playerId] = "isMatched";
                  }
                }
                return players;
              }).then((players)=>{
                if (!players || !secondPlayer) return;
                db.ref("user_info/" + playerId).get().then((userSnapA) => {
                  db.ref("user_info/" + opponentId).get().then((userSnapB) =>{
                    const userInfoA = userSnapA.val();
                    const userInfoB = userSnapB.val();
                    const playerObject = {};
                    playerObject[playerId] = userInfoA;
                    playerObject[opponentId] = userInfoB;
                    const gameRef = db.ref("game_list/" + rank).push({
                      player_object: playerObject,
                    });
                    const gid = gameRef.key;
                    db.ref("user_info/" + playerId + "/game_id")
                        .set(gid).then(()=>{
                          db.ref("user_info/" + playerId + "/status")
                              .set("isMatched");
                        });
                    db.ref("user_info/" + opponentId + "/game_id").set(gid)
                        .then(()=>{
                          db.ref("user_info/" + opponentId + "/status")
                              .set("isMatched");
                        });
                  });
                });
              });
          db.ref("matching_info/" + rank).off("value", onPlayerAdded);
        }
      };
      db.ref("matching_info/" + rank).on("value", onPlayerAdded);
      return null;
    });
