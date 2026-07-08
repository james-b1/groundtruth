"use client";

import { useEffect, useId, useState } from "react";

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

/** Builds a simple HTML email body from today's brief. */
function buildEmailHtml(brief) {
  const week = weekLabel(brief.date);
  const trends = brief.trends
    .map(
      (t) => `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #e5e3dc;">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#1f8a5b;">
            ${escapeHtml(t.topic)}
          </div>
          <div style="font-size:17px;font-weight:700;margin:4px 0 6px;color:#1c2a24;">
            ${escapeHtml(t.title)}
          </div>
          <div style="font-size:22px;font-weight:700;color:#1f8a5b;">
            ${escapeHtml(t.metric)}
            <span style="font-size:13px;font-weight:400;color:#5f6f68;">
              ${escapeHtml(t.metricLabel)}
            </span>
          </div>
          <p style="margin:8px 0 6px;font-size:14px;line-height:1.5;color:#1c2a24;">
            ${escapeHtml(t.summary)}
          </p>
          <a href="${escapeHtml(t.source.url)}" style="font-size:12px;color:#5f6f68;">
            ${escapeHtml(t.source.name)}
          </a>
        </td>
      </tr>`
    )
    .join("");

  const contrast = brief.contrast
    ? `
    <tr>
      <td style="padding:20px 0 8px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#5f6f68;margin-bottom:10px;">
          Today vs. the trend
        </div>
        <div style="border:1px solid #e5e3dc;border-radius:10px;overflow:hidden;">
          <div style="padding:14px 16px;border-bottom:1px solid #e5e3dc;background:#faf9f6;">
            <div style="font-size:11px;font-weight:700;color:#b4432f;text-transform:uppercase;letter-spacing:0.05em;">Headline</div>
            <p style="margin:6px 0 0;font-size:14px;color:#1c2a24;"><strong>${escapeHtml(brief.contrast.headline.text)}</strong></p>
          </div>
          <div style="padding:14px 16px;">
            <div style="font-size:11px;font-weight:700;color:#1f8a5b;text-transform:uppercase;letter-spacing:0.05em;">Long-term trend</div>
            <p style="margin:6px 0 0;font-size:14px;color:#1c2a24;">${escapeHtml(brief.contrast.trend.text)}</p>
          </div>
        </div>
      </td>
    </tr>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Groundtruth weekly</title>
</head>
<body style="margin:0;padding:0;background:#f7f6f2;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f2;">
    <tr>
      <td align="center" style="padding:28px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e5e3dc;border-radius:12px;padding:28px 24px;">
          <tr>
            <td>
              <div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#1f8a5b;">
                Groundtruth weekly
              </div>
              <h1 style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:22px;margin:8px 0 4px;color:#1c2a24;">
                Week of ${escapeHtml(week)}
              </h1>
              <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px;color:#5f6f68;margin:0 0 20px;">
                Sourced trends that are getting better. Preview only. Nothing was emailed.
              </p>
            </td>
          </tr>
          ${trends}
          ${contrast}
          <tr>
            <td style="padding-top:20px;font-family:ui-sans-serif,system-ui,sans-serif;font-size:12px;color:#5f6f68;">
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

      {open && (
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
                <strong id={titleId}>Email preview</strong>
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
        </div>
      )}
    </section>
  );
}
