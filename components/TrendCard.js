export default function TrendCard({ trend }) {
  return (
    <article className="card">
      <div className="card-top">
        <span className="topic">{trend.topic}</span>
        {trend.live ? (
          <span className="badge live">Live</span>
        ) : (
          <span className="badge curated">Curated</span>
        )}
      </div>
      <h3>{trend.title}</h3>
      <div className="metric">
        <span className="value">{trend.metric}</span>
        <span className="label">{trend.metricLabel}</span>
      </div>
      {trend.live && trend.valueYear ? (
        <p className="data-year">Figure from {trend.valueYear}</p>
      ) : null}
      <p>{trend.summary}</p>
      <div className="source">
        <a href={trend.source.url} target="_blank" rel="noreferrer">
          Source: {trend.source.name} ↗
        </a>
      </div>
    </article>
  );
}
