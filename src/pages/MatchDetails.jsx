import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import MatchHeader from "../components/match/MatchHeader";
import TeamInfo from "../components/match/TeamInfo";
import Scoreboard from "../components/match/Scoreboard";
import BallHistory from "../components/match/BallHistory";
import ScoringPanel from "../components/match/ScoringPanel";

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function MatchDetails() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [showResultOptions, setShowResultOptions] = useState(false);

  const fetchMatch = async () => {
    const docRef = doc(db, "matches", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setMatch(docSnap.data());
    }
  };

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const saveEvent = async (event) => {
    const docRef = doc(db, "matches", id);
    const currentHistory = match.history || [];

    await updateDoc(docRef, {
      runs: event.newRuns,
      wickets: event.newWickets,
      overs: event.newOvers,
      balls: event.newBalls,
      history: [...currentHistory, event],
    });

    fetchMatch();
  };
// ================================
// AUTO WIN CHECK
// ================================
const checkMatchResult = async (newRuns) => {
  if (match.innings !== 2) return;
  if (!match.target) return;

  if (newRuns >= match.target) {
    const winner = match.battingTeam;
    const loser = match.bowlingTeam;

    if (!winner || !loser) {
      alert("Batting/Bowling team is missing. Create a new match.");
      return;
    }

    const matchRef = doc(db, "matches", id);

    await updateDoc(matchRef, {
      status: "completed",
      winner,
      resultType: "win",
    });

    await updatePointsTable(winner, loser, "win");

    alert(`${winner} won the match!`);
    fetchMatch();
  }
};
const addRuns = async (runsToAdd) => {
  let newRuns = match.runs + runsToAdd;
  let newWickets = match.wickets;
  let newBalls = match.balls + 1;
  let newOvers = match.overs;

  if (newBalls === 6) {
    newOvers += 1;
    newBalls = 0;
  }

  await saveEvent({
    label: String(runsToAdd),
    type: "run",
    previousRuns: match.runs,
    previousWickets: match.wickets,
    previousOvers: match.overs,
    previousBalls: match.balls,
    newRuns,
    newWickets,
    newOvers,
    newBalls,
  });

  await checkInningsEnd(newRuns, newWickets, newOvers, newBalls);
};
// ================================
// CHECK IF INNINGS SHOULD END
// ================================
const checkInningsEnd = async (newRuns, newWickets, newOvers, newBalls) => {
  const oversCompleted = newOvers >= match.maxOvers && newBalls === 0;

  // First innings: end automatically when all out or overs completed
  if (match.innings === 1) {
    if (newWickets >= 10 || oversCompleted) {
      await endInnings();
      return;
    }
  }

  // Second innings: target reached
  if (match.innings === 2 && newRuns >= match.target) {
    await checkMatchResult(newRuns);
    return;
  }

  // Second innings: all out
  if (match.innings === 2 && newWickets >= 10) {
    await endMatch("win", match.bowlingTeam);
    return;
  }

  // Second innings: overs completed
  if (match.innings === 2 && oversCompleted) {
    if (newRuns === match.target - 1) {
      await endMatch("tie");
    } else {
      await endMatch("win", match.bowlingTeam);
    }
  }
};
  const addWide = async () => {
    saveEvent({
      label: "Wd",
      type: "wide",
      previousRuns: match.runs,
      previousWickets: match.wickets,
      previousOvers: match.overs,
      previousBalls: match.balls,
      newRuns: match.runs + 1,
      newWickets: match.wickets,
      newOvers: match.overs,
      newBalls: match.balls,
    });
  };

  const addNoBall = async () => {
    saveEvent({
      label: "Nb",
      type: "noball",
      previousRuns: match.runs,
      previousWickets: match.wickets,
      previousOvers: match.overs,
      previousBalls: match.balls,
      newRuns: match.runs + 1,
      newWickets: match.wickets,
      newOvers: match.overs,
      newBalls: match.balls,
    });
  };

  const addWicket = async () => {
  let newBalls = match.balls + 1;
  let newOvers = match.overs;

  if (newBalls === 6) {
    newOvers += 1;
    newBalls = 0;
  }

  const newWickets = match.wickets + 1;

  await saveEvent({
    label: "W",
    type: "wicket",
    previousRuns: match.runs,
    previousWickets: match.wickets,
    previousOvers: match.overs,
    previousBalls: match.balls,
    newRuns: match.runs,
    newWickets,
    newOvers,
    newBalls,
  });

  await checkInningsEnd(
    match.runs,
    newWickets,
    newOvers,
    newBalls
  );
};
  const undoLastEvent = async () => {
    const history = match.history || [];

    if (history.length === 0) {
      alert("Nothing to undo");
      return;
    }

    const lastEvent = history[history.length - 1];
    const updatedHistory = history.slice(0, -1);
    const docRef = doc(db, "matches", id);

    await updateDoc(docRef, {
      runs: lastEvent.previousRuns,
      wickets: lastEvent.previousWickets,
      overs: lastEvent.previousOvers,
      balls: lastEvent.previousBalls,
      history: updatedHistory,
    });

    fetchMatch();
  };

const oversToDecimal = (overs, balls) => {
  return overs + balls / 6;
};

const calculateNRR = (
  runsScored,
  oversFaced,
  runsConceded,
  oversBowled
) => {
  if (oversFaced === 0 || oversBowled === 0) {
    return 0;
  }

  const nrr =
    runsScored / oversFaced -
    runsConceded / oversBowled;

  return Number(nrr.toFixed(2));
};

const updatePointsTable = async (teamOne, teamTwo, resultType) => {
  const tournamentRef = doc(db, "tournaments", match.tournamentId);
  const tournamentSnap = await getDoc(tournamentRef);

  if (!tournamentSnap.exists()) {
    alert("Tournament not found");
    return;
  }

  const pointsRules = tournamentSnap.data().pointsRules || {
    win: 2,
    loss: 0,
    tie: 1,
    noResult: 1,
  };

  const firstInningsOversDecimal = oversToDecimal(
    match.firstInningsOvers || 0,
    match.firstInningsBalls || 0
  );

  const secondInningsOversDecimal = oversToDecimal(
    match.overs || 0,
    match.balls || 0
  );

  const teamAStats = {
    runsScored: match.firstInningsScore || 0,
    oversFaced: firstInningsOversDecimal,
    runsConceded: match.runs || 0,
    oversBowled: secondInningsOversDecimal,
  };

  const teamBStats = {
    runsScored: match.runs || 0,
    oversFaced: secondInningsOversDecimal,
    runsConceded: match.firstInningsScore || 0,
    oversBowled: firstInningsOversDecimal,
  };

  const q = query(
    collection(db, "pointsTable"),
    where("tournamentId", "==", match.tournamentId)
  );

  const snapshot = await getDocs(q);

  for (const teamDoc of snapshot.docs) {
    const team = teamDoc.data();
    const teamRef = doc(db, "pointsTable", teamDoc.id);

    let played = team.played || 0;
    let won = team.won || 0;
    let lost = team.lost || 0;
    let tied = team.tied || 0;
    let noResult = team.noResult || 0;
    let points = team.points || 0;

    let runsScored = team.runsScored || 0;
    let oversFaced = team.oversFaced || 0;
    let runsConceded = team.runsConceded || 0;
    let oversBowled = team.oversBowled || 0;

    if (team.teamName === match.teamA) {
      runsScored += teamAStats.runsScored;
      oversFaced += teamAStats.oversFaced;
      runsConceded += teamAStats.runsConceded;
      oversBowled += teamAStats.oversBowled;
    }

    if (team.teamName === match.teamB) {
      runsScored += teamBStats.runsScored;
      oversFaced += teamBStats.oversFaced;
      runsConceded += teamBStats.runsConceded;
      oversBowled += teamBStats.oversBowled;
    }

    if (resultType === "win") {
      if (team.teamName === teamOne) {
        played += 1;
        won += 1;
        points += pointsRules.win;
      }

      if (team.teamName === teamTwo) {
        played += 1;
        lost += 1;
        points += pointsRules.loss;
      }
    }

    if (resultType === "tie") {
      if (team.teamName === teamOne || team.teamName === teamTwo) {
        played += 1;
        tied += 1;
        points += pointsRules.tie;
      }
    }

    if (resultType === "noResult") {
      if (team.teamName === teamOne || team.teamName === teamTwo) {
        played += 1;
        noResult += 1;
        points += pointsRules.noResult;
      }
    }

    const nrr = calculateNRR(
      runsScored,
      oversFaced,
      runsConceded,
      oversBowled
    );

    await updateDoc(teamRef, {
      played,
      won,
      lost,
      tied,
      noResult,
      points,
      runsScored,
      oversFaced,
      runsConceded,
      oversBowled,
      nrr,
    });
  }
};
// ================================
// END INNINGS
// ================================
const endInnings = async () => {
  if (match.innings !== 1) {
    alert("Only first innings can be ended");
    return;
  }

  const docRef = doc(db, "matches", id);

  await updateDoc(docRef, {
   firstInningsOvers: match.overs,
   firstInningsBalls: match.balls,
   firstInningsScore: match.runs,
    target: match.runs + 1,

    innings: 2,

    runs: 0,
    wickets: 0,
    overs: 0,
    balls: 0,

    battingTeam: match.bowlingTeam,
    bowlingTeam: match.battingTeam,

    history: [],
  });

  alert(`Target is ${match.runs + 1}`);

  fetchMatch();
};
  const endMatch = async (resultType, winner = null) => {
    const matchRef = doc(db, "matches", id);

    await updateDoc(matchRef, {
      status: "completed",
      resultType,
      winner,
    });

    if (resultType === "win") {
      const loser = winner === match.teamA ? match.teamB : match.teamA;
      await updatePointsTable(winner, loser, "win");
    }

    if (resultType === "tie") {
      await updatePointsTable(match.teamA, match.teamB, "tie");
    }

    if (resultType === "noResult") {
      await updatePointsTable(match.teamA, match.teamB, "noResult");
    }

    setShowResultOptions(false);
    fetchMatch();
    alert("Match ended and points table updated");
  };

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        Loading Match...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
    <MatchHeader match={match} id={id} />

     <TeamInfo match={match} />
      

     <Scoreboard match={match} />

      <ScoringPanel
       match={match}
       addRuns={addRuns}
       addWicket={addWicket}
       addWide={addWide}
       addNoBall={addNoBall}
       undoLastEvent={undoLastEvent}
       endInnings={endInnings}
       setShowResultOptions={setShowResultOptions}
      />

      {showResultOptions && (
        <div className="mt-6 bg-gray-900 p-6 rounded-xl max-w-md">
          <h2 className="text-xl font-bold mb-4 text-purple-400">
            Select Match Result
          </h2>

          <div className="grid gap-3">
            <button
              onClick={() => endMatch("win", match.teamA)}
              className="bg-green-500 text-black p-3 rounded font-semibold"
            >
              {match.teamA} Won
            </button>

            <button
              onClick={() => endMatch("win", match.teamB)}
              className="bg-green-500 text-black p-3 rounded font-semibold"
            >
              {match.teamB} Won
            </button>

            <button
              onClick={() => endMatch("tie")}
              className="bg-yellow-500 text-black p-3 rounded font-semibold"
            >
              Match Tied
            </button>

            <button
              onClick={() => endMatch("noResult")}
              className="bg-gray-600 text-white p-3 rounded font-semibold"
            >
              No Result
            </button>

            <button
              onClick={() => setShowResultOptions(false)}
              className="bg-red-600 text-white p-3 rounded font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

     
      <BallHistory match={match} />
    </div>
  );
};

export default MatchDetails;