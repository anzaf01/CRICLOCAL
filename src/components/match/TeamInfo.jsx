function TeamInfo({ match }) {
  return (
    <div className="mt-4 bg-gray-900 p-4 rounded-xl">
      <p className="text-green-400 font-semibold">
        Batting: {match.battingTeam || "Not set"}
      </p>

      <p className="text-red-400 font-semibold mt-1">
        Bowling: {match.bowlingTeam || "Not set"}
      </p>
    </div>
  );
}

export default TeamInfo;
