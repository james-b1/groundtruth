export default function ContrastBlock({ contrast }) {
  if (!contrast) return null;
  const { headline, trend } = contrast;

  return (
    <section className="contrast">
      <div className="row headline">
        <div className="kicker">Today's headline</div>
        <p>
          <strong>{headline.text}</strong>
        </p>
        <div className="source">
          <a href={headline.source.url} target="_blank" rel="noreferrer">
            {headline.source.name} ↗
          </a>
        </div>
      </div>
      <div className="row trend">
        <div className="kicker">The long-term trend</div>
        <p>{trend.text}</p>
        <div className="source">
          <a href={trend.source.url} target="_blank" rel="noreferrer">
            Source: {trend.source.name} ↗
          </a>
        </div>
      </div>
    </section>
  );
}
