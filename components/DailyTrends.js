export default function DailyTrends() {
  return (
    <section className="max-w-[900px] mx-auto px-8 py-20 font-inter">
      <h2 className="text-2xl font-medium mb-8 text-foreground">
        Today’s Progress Brief
      </h2>

      <div className="space-y-6">
        <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm">
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          <h3 className="text-lg font-medium mb-2">Extreme poverty keeps falling</h3>
          <p className="text-muted-foreground mb-2">
            The share of the world in extreme poverty has dropped from 38% in 1990 to under 10% today.
          </p>
          <p className="text-xs text-muted-foreground">Source: World Bank</p>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm">
          <span className="inline-block w-3 h-3 rounded-full bg-emerald-400 mr-2"></span>
          <h3 className="text-lg font-medium mb-2">Child mortality keeps falling</h3>
          <p className="text-muted-foreground mb-2">
            The global under‑five death rate has more than halved since 1990.
          </p>
          <p className="text-xs text-muted-foreground">Source: UN IGME</p>
        </div>
      </div>
    </section>
  );
}
