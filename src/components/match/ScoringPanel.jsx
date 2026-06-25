function ScoringPanel({
  match,
  addRuns,
  addWicket,
  addWide,
  addNoBall,
  undoLastEvent,
  endInnings,
  setShowResultOptions,
}) {
  const isCompleted = match.status === "completed";

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Scoring Panel</h2>

      <div className="grid grid-cols-3 gap-3 max-w-md">
        {[0, 1, 2, 3, 4, 6].map((run) => (
          <button
            key={run}
            onClick={() => addRuns(run)}
            disabled={isCompleted}
            className="bg-green-500 text-black p-4 rounded font-bold text-xl disabled:opacity-40"
          >
            {run}
          </button>
        ))}

        <button
          onClick={addWicket}
          disabled={isCompleted}
          className="bg-red-500 text-white p-4 rounded font-bold text-xl col-span-3 disabled:opacity-40"
        >
          Wicket
        </button>

        <button
          onClick={addWide}
          disabled={isCompleted}
          className="bg-yellow-500 text-black p-4 rounded font-bold text-xl disabled:opacity-40"
        >
          Wide
        </button>

        <button
          onClick={addNoBall}
          disabled={isCompleted}
          className="bg-orange-500 text-black p-4 rounded font-bold text-xl disabled:opacity-40"
        >
          No Ball
        </button>

        <button
          onClick={undoLastEvent}
          disabled={isCompleted}
          className="bg-gray-700 text-white p-4 rounded font-bold text-xl disabled:opacity-40"
        >
          Undo
        </button>

        <button
          onClick={() => setShowResultOptions(true)}
          disabled={isCompleted}
          className="bg-purple-600 text-white p-4 rounded font-bold text-xl col-span-3 disabled:opacity-40"
        >
          End Match
        </button>

        <button
          onClick={endInnings}
          disabled={isCompleted || match.innings !== 1}
          className="bg-cyan-600 text-white p-4 rounded font-bold text-xl col-span-3 disabled:opacity-40"
        >
          End Innings
        </button>
      </div>
    </div>
  );
}

export default ScoringPanel;
