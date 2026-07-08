export default function Footer() {
  return (
    <footer className="bg-[#F7F8FA] border-t border-gray-100 pt-12 pb-8">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-3 gap-12 mb-10">

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-emerald-400"></div>
              <span className="font-inter font-semibold text-sm text-[#111827]">
                GroundTruth
              </span>
            </div>
            <p className="font-inter text-sm text-[#6B7280] leading-relaxed">
              A daily digest of evidence-based global progress.
              Built for people who want to stay informed without the anxiety.
            </p>
          </div>

          <div>
            <p className="font-inter font-medium text-xs uppercase tracking-wide text-[#374151] mb-3">
              Sources
            </p>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>Our World in Data</li>
              <li>World Bank</li>
              <li>UN Data Portal</li>
              <li>IEA Statistics</li>
            </ul>
          </div>

          <div>
            <p className="font-inter font-medium text-xs uppercase tracking-wide text-[#374151] mb-3">
              Navigation
            </p>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>About</li>
              <li>Methodology</li>
              <li>FAQ</li>
              <li>Privacy</li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
