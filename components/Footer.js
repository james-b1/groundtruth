export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper pt-12 pb-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid sm:grid-cols-3 gap-10 mb-8">
          <div>
            <p className="font-serif text-lg text-ink mb-2">Groundtruth</p>
            <p className="text-sm text-ink-soft leading-relaxed">
              A daily digest of evidence-based global progress. Built for people who
              want to stay informed without the anxiety.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-ink font-medium mb-3">
              Sources
            </p>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li>Our World in Data</li>
              <li>World Bank</li>
              <li>UN Data Portal</li>
              <li>IEA Statistics</li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-ink font-medium mb-3">
              Disclaimer
            </p>
            <p className="text-sm text-ink-soft leading-relaxed">
              Groundtruth summarizes information from verified public datasets (World
              Bank, WHO, IEA, FAO, UN). We do not create any data — all statistics
              are sourced from official agencies or peer-reviewed research.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
