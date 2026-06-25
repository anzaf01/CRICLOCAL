function BallHistory({ match }) {
  return (
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
  );
}

export default BallHistory;
