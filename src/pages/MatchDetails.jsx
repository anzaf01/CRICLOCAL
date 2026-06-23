import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";

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

  const addRuns = async (runsToAdd) => {
    let newRuns = match.runs + runsToAdd;
    let newWickets = match.wickets;
    let newBalls = match.balls + 1;
    let newOvers = match.overs;

    if (newBalls === 6) {
      newOvers += 1;
      newBalls = 0;
    }

    saveEvent({
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

    saveEvent({
      label: "W",
      type: "wicket",
      previousRuns: match.runs,
      previousWickets: match.wickets,
      previousOvers: match.overs,
      previousBalls: match.balls,
      newRuns: match.runs,
      newWickets: match.wickets + 1,
      newOvers,
      newBalls,
    });
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

    const q = query(
      collection(db, "pointsTable"),
      where("tournamentId", "==", match.tournamentId)
    );

    const snapshot = await getDocs(q);

    for (const teamDoc of snapshot.docs) {
      const team = teamDoc.data();
      const teamRef = doc(db, "pointsTable", teamDoc.id);

      if (resultType === "win") {
        if (team.teamName === teamOne) {
          await updateDoc(teamRef, {
            played: team.played + 1,
            won: team.won + 1,
            points: team.points + pointsRules.win,
          });
        }

        if (team.teamName === teamTwo) {
          await updateDoc(teamRef, {
            played: team.played + 1,
            lost: team.lost + 1,
            points: team.points + pointsRules.loss,
          });
        }
      }

      if (resultType === "tie") {
        if (team.teamName === teamOne || team.teamName === teamTwo) {
          await updateDoc(teamRef, {
            played: team.played + 1,
            tied: team.tied + 1,
            points: team.points + pointsRules.tie,
          });
        }
      }

      if (resultType === "noResult") {
        if (team.teamName === teamOne || team.teamName === teamTwo) {
          await updateDoc(teamRef, {
            played: team.played + 1,
            noResult: team.noResult + 1,
            points: team.points + pointsRules.noResult,
          });
        }
      }
    }
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
      <h1 className="text-4xl font-bold text-green-400">
        {match.teamA} vs {match.teamB}
      </h1>

      <p className="mt-2 text-gray-300">📍 {match.venue}</p>

      <div className="mt-3 flex gap-3 items-center flex-wrap">
        <a
          href={`/public/${id}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 underline"
        >
          Open Scoreboard
        </a>

        <button
          onClick={() => {
            const publicUrl = `${window.location.origin}/public/${id}`;
            navigator.clipboard.writeText(publicUrl);
            alert("Public link copied!");
          }}
          className="bg-blue-600 px-3 py-1 rounded text-white"
        >
          Copy Public Link
        </button>
      </div>

      <div className="mt-8 bg-gray-900 p-6 rounded-xl">
        <h2 className="text-5xl font-bold">
          {match.runs}/{match.wickets}
        </h2>

        <p className="text-xl mt-2">
          Overs: {match.overs}.{match.balls}
        </p>

        <p className="mt-4 text-green-400">Status: {match.status}</p>

        {match.winner && (
          <p className="mt-2 text-purple-400 font-semibold">
            Winner: {match.winner}
          </p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Scoring Panel</h2>

        <div className="grid grid-cols-3 gap-3 max-w-md">
          {[0, 1, 2, 3, 4, 6].map((run) => (
            <button
              key={run}
              onClick={() => addRuns(run)}
              className="bg-green-500 text-black p-4 rounded font-bold text-xl"
            >
              {run}
            </button>
          ))}

          <button
            onClick={addWicket}
            className="bg-red-500 text-white p-4 rounded font-bold text-xl col-span-3"
          >
            Wicket
          </button>

          <button
            onClick={addWide}
            className="bg-yellow-500 text-black p-4 rounded font-bold text-xl"
          >
            Wide
          </button>

          <button
            onClick={addNoBall}
            className="bg-orange-500 text-black p-4 rounded font-bold text-xl"
          >
            No Ball
          </button>

          <button
            onClick={undoLastEvent}
            className="bg-gray-700 text-white p-4 rounded font-bold text-xl"
          >
            Undo
          </button>

          <button
            onClick={() => setShowResultOptions(true)}
            className="bg-purple-600 text-white p-4 rounded font-bold text-xl col-span-3"
          >
            End Match
          </button>
        </div>
      </div>

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

      <div className="mt-10 bg-gray-900 p-6 rounded-xl max-w-md">
        <h2 className="text-2xl font-bold mb-4">Ball History</h2>

        {match.history && match.history.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {match.history.map((ball, index) => (
              <span
                key={index}
                className="bg-gray-800 px-3 py-2 rounded font-semibold"
              >
                {ball.label}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No balls yet.</p>
        )}
      </div>
    </div>
  );
}

export default MatchDetails;