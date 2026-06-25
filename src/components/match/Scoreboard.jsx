function Scoreboard({ match }) {
  return (
    <div className="mt-8 bg-gray-900 p-6 rounded-xl">
      <h2 className="text-5xl font-bold">
        {match.runs}/{match.wickets}
      </h2>

      <p className="text-xl mt-2">
        Overs: {match.overs}.{match.balls}
      </p>

      <p className="text-xl mt-2">
        Innings: {match.innings}
      </p>

      {match.target && (
        <p className="text-green-400 font-bold mt-2">
          Target: {match.target}
        </p>
      )}

      <p className="mt-4 text-green-400">
        Status: {match.status}
      </p>

      {match.winner && (
        <p className="mt-2 text-purple-400 font-semibold">
          Winner: {match.winner}
        </p>
      )}
    </div>
  );
}

export default Scoreboard;