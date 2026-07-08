"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

function weekLabel(isoDate) {
  try {
    const d = new Date(isoDate + "T00:00:00");
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Editorial Brief tokens — kept in sync with app/globals.css */
const EMAIL = {
  paper: "#fbfbf9",
  paperWarm: "#faf9f6",
  ink: "#141414",
  inkSoft: "#3f3f3a",
  line: "#e6e6e2",
  accent: "#1f4d3d",
  muted: "#8a8a82",
  warn: "#9a3b12",
  sans: "'Inter', ui-sans-serif, system-ui, sans-serif",
  serif: "'Newsreader', ui-serif, Georgia, serif",
};

/** Builds a simple HTML email body from today's brief. */
function buildEmailHtml(brief) {
  const week = weekLabel(brief.date);
  const trends = brief.trends
    .map(
      (t) => `
      <tr>
        <td style="padding:20px 0;border-top:1px solid ${EMAIL.line};">
          <div style="font-family:${EMAIL.sans};font-size:10px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL.accent};">
            ${escapeHtml(t.topic)}
          </div>
          <div style="font-family:${EMAIL.serif};font-size:20px;font-weight:600;margin:6px 0 8px;color:${EMAIL.ink};line-height:1.3;">
            ${escapeHtml(t.title)}
          </div>
          <div style="font-family:${EMAIL.sans};font-size:24px;font-weight:600;color:${EMAIL.accent};font-variant-numeric:tabular-nums;">
            ${escapeHtml(t.metric)}
            <span style="font-size:14px;font-weight:400;color:${EMAIL.inkSoft};">
              ${escapeHtml(t.metricLabel)}
            </span>
          </div>
          <p style="margin:10px 0 8px;font-family:${EMAIL.sans};font-size:14px;line-height:1.65;color:${EMAIL.inkSoft};">
            ${escapeHtml(t.summary)}
          </p>
          <a href="${escapeHtml(t.source.url)}" style="font-family:${EMAIL.sans};font-size:12px;color:${EMAIL.muted};text-decoration:none;border-bottom:1px solid ${EMAIL.line};">
            ${escapeHtml(t.source.name)}
          </a>
        </td>
      </tr>`
    )
    .join("");

  const contrast = brief.contrast
    ? `
    <tr>
      <td style="padding:24px 0 8px;border-top:1px solid ${EMAIL.line};">
        <div style="font-family:${EMAIL.sans};font-size:10px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:${EMAIL.muted};margin-bottom:12px;">
          Today vs. the trend
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${EMAIL.line};">
          <tr>
            <td style="padding:16px;border-bottom:1px solid ${EMAIL.line};background:${EMAIL.paperWarm};">
              <div style="font-family:${EMAIL.sans};font-size:10px;font-weight:500;color:${EMAIL.warn};text-transform:uppercase;letter-spacing:0.07em;">In the news</div>
              <p style="margin:8px 0 0;font-family:${EMAIL.sans};font-size:14px;font-weight:500;color:${EMAIL.ink};line-height:1.45;">${escapeHtml(brief.contrast.headline.text)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px;background:#ffffff;">
              <div style="font-family:${EMAIL.sans};font-size:10px;font-weight:500;color:${EMAIL.accent};text-transform:uppercase;letter-spacing:0.07em;">The long-term trend</div>
              <p style="margin:8px 0 0;font-family:${EMAIL.sans};font-size:14px;color:${EMAIL.inkSoft};line-height:1.65;">${escapeHtml(brief.contrast.trend.text)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Groundtruth weekly</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:opsz,wght@6..72,600;6..72,700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background:${EMAIL.paper};font-family:${EMAIL.sans};color:${EMAIL.ink};font-variant-numeric:tabular-nums;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${EMAIL.paper};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid ${EMAIL.line};padding:28px 24px;">
          <tr>
            <td>
              <div style="font-family:${EMAIL.sans};font-size:10px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:${EMAIL.muted};">
                Groundtruth weekly
              </div>
              <h1 style="font-family:${EMAIL.serif};font-size:26px;font-weight:600;margin:8px 0 6px;color:${EMAIL.ink};line-height:1.2;">
                Week of ${escapeHtml(week)}
              </h1>
              <p style="font-family:${EMAIL.sans};font-size:14px;color:${EMAIL.inkSoft};margin:0 0 8px;line-height:1.6;">
                Sourced trends that are getting better.
              </p>
              <p style="font-family:${EMAIL.sans};font-size:12px;color:${EMAIL.muted};margin:0 0 4px;">
                Preview only. Nothing was emailed.
              </p>
            </td>
          </tr>
          ${trends}
          ${contrast}
          <tr>
            <td style="padding-top:20px;border-top:1px solid ${EMAIL.line};font-family:${EMAIL.sans};font-size:12px;color:${EMAIL.muted};line-height:1.5;">
              Every claim links to its source. Figures come from curated data and OWID where live.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default function NewsletterPreview({ brief }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!brief) return null;

  const week = weekLabel(brief.date);
  const subject = `Groundtruth weekly · week of ${week}`;
  const html = buildEmailHtml(brief);

  return (
    <section className="newsletter">
      <h3>Weekly email</h3>
      <p className="newsletter-copy">
        Demo of the weekly newsletter. Opens a preview. Does not send mail.
      </p>
      <button type="button" className="newsletter-btn" onClick={() => setOpen(true)}>
        Preview this week&apos;s email
      </button>

      {open && createPortal(
        <div
          className="newsletter-overlay"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            className="newsletter-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="newsletter-chrome">
              <div className="newsletter-chrome-top">
                <strong id={titleId} className="font-serif font-normal">
                  Email preview
                </strong>
                <button type="button" className="newsletter-close" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
              <div className="newsletter-meta">
                <div>
                  <span className="meta-label">From</span> Groundtruth &lt;brief@groundtruth.demo&gt;
                </div>
                <div>
                  <span className="meta-label">To</span> you@example.com
                </div>
                <div>
                  <span className="meta-label">Subject</span> {subject}
                </div>
              </div>
            </div>
            <iframe
              className="newsletter-frame"
              title="Weekly newsletter preview"
              sandbox=""
              srcDoc={html}
            />
            <p className="newsletter-disclaimer">Preview only.</p>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
