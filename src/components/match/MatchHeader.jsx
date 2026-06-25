function MatchHeader({ match, id }) {
  return (
    <>
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
    </>
  );
}

export default MatchHeader;