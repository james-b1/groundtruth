export default function TrendCard({ trend }) {
  return (
    <article className="card">
      <span className="topic">{trend.topic}</span>
      <h3>{trend.title}</h3>
      <div className="metric">
        <span className="value">{trend.metric}</span>
        <span className="label">{trend.metricLabel}</span>
      </div>
      <p>{trend.summary}</p>
      <div className="source">
        <a href={trend.source.url} target="_blank" rel="noreferrer">
          Source: {trend.source.name} ↗
        </a>
      </div>
    </article>
  );
}
