import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

/* ─── Types ─── */
type Audience = "families" | "you" | "matchmakers";

interface AudienceContent {
  body: React.ReactNode;
  ctaPrimary: string;
  ctaSecondary: string;
  trust: string[];
}

/* ─── Content per audience ─── */
const CONTENT: Record<Audience, AudienceContent> = {
  families: {
    body: (
      <>
        Create a beautiful <em>विवाह</em> biodata for your child. Share it
        privately with the right <em>परिवार</em> — on your terms, not a
        platform's.
      </>
    ),
    ctaPrimary: "Create My Biodata",
    ctaSecondary: "See a Sample ↓",
    trust: ["Free to start", "No ads or spam", "Your privacy, always"],
  },
  you: {
    body: (
      <>
        Build a biodata that truly represents you. Control who sees your photo,
        horoscope, and contact details — share selectively, never publicly.
      </>
    ),
    ctaPrimary: "Start My Biodata",
    ctaSecondary: "See a Sample ↓",
    trust: [
      "Free to start",
      "You decide who sees what",
      "No creepy matching algorithms",
    ],
  },
  matchmakers: {
    body: (
      <>
        Manage every client family in one workspace. Create biodatas in minutes,
        organize by family, and share with full access control — no extra cost
        per biodata.
      </>
    ),
    ctaPrimary: "Explore Matchmaker Workspace →",
    ctaSecondary: "How it works",
    trust: [
      "Unlimited biodatas",
      "Client folders & templates",
      "View tracking per share link",
    ],
  },
};

/* ─── SVG helpers ─── */
const CheckIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.3)"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/* ─── Scroll reveal hook ─── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("lp-in");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll(".lp-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Sparrow logo mark ─── */
const SparrowMark = ({ size = 26, opacity = 0.88 }: { size?: number; opacity?: number }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <path
      d="M15 3C11.5 3 8 5.8 8 9.5C8 12.2 9.8 14 11.5 15L7.5 23H11L13 19.2C13.6 19.4 14.3 19.5 15 19.5C18.6 19.5 21.5 16.5 21.5 13C21.5 9.5 18.8 5.5 15 3Z"
      fill="#B8860B"
      opacity={opacity}
    />
    <path
      d="M9.5 11C9.5 11 7 12.5 6 14.5"
      stroke="#B8860B"
      strokeWidth="1.3"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export function LandingPage() {
  const [audience, setAudience] = useState<Audience>("families");
  const [bodyFade, setBodyFade] = useState(false);
  const matchmakerRef = useRef<HTMLElement>(null);

  useReveal();

  const switchAudience = (next: Audience) => {
    if (next === audience) return;
    setBodyFade(true);
    setTimeout(() => {
      setAudience(next);
      setBodyFade(false);
    }, 180);
  };

  const scrollToMatchmaker = (e: React.MouseEvent) => {
    e.preventDefault();
    matchmakerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const content = CONTENT[audience];

  return (
    <div className="landing">

      {/* ── NAV ── */}
      <nav className="lp-nav">
        <Link to="/" className="lp-logo">
          <SparrowMark />
          <div className="lp-logo-text">
            <span className="lp-logo-rishte">रिश्ते</span>
            <span className="lp-logo-by">BY DAANYAM</span>
          </div>
        </Link>
        <div className="lp-nav-right">
          <button className="lp-nav-link" onClick={scrollToMatchmaker}>
            For Matchmakers
          </button>
          <Link to="/biodata/personal" className="lp-btn lp-btn-fill">
            Create My Biodata
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section>
        <div className="lp-hero">

          {/* Left */}
          <div className="lp-hero-left">
            <div className="lp-eyebrow lp-reveal">
              <div className="lp-eyebrow-dot" />
              <span>
                Made for Hindu &amp; Jain{" "}
                <span className="lp-deva">परिवार</span>
              </span>
            </div>

            <h1 className="lp-h1 lp-reveal lp-d1">
              Every <span className="lp-rista">रिश्ता</span>
              <br />
              begins with trust.
            </h1>

            <div className="lp-hr lp-reveal lp-d2" />

            {/* Audience toggle */}
            <div className="lp-toggle lp-reveal lp-d2">
              {(["families", "you", "matchmakers"] as Audience[]).map(
                (aud, i) => (
                  <>
                    {i > 0 && <span key={`sep-${aud}`} className="lp-tog-sep">·</span>}
                    <button
                      key={aud}
                      className={`lp-tog${audience === aud ? " lp-active" : ""}`}
                      onClick={() => switchAudience(aud)}
                    >
                      {aud === "families"
                        ? "For Families"
                        : aud === "you"
                          ? "For You"
                          : "For Matchmakers"}
                    </button>
                  </>
                ),
              )}
            </div>

            <p className={`lp-hero-body lp-reveal lp-d3${bodyFade ? " lp-fade" : ""}`}>
              {content.body}
            </p>

            <div className="lp-hero-actions lp-reveal lp-d3">
              <Link to="/biodata/personal" className="lp-btn lp-btn-fill">
                {content.ctaPrimary}
              </Link>
              <Link to="/preview" className="lp-btn lp-btn-ghost">
                {content.ctaSecondary}
              </Link>
            </div>

            <div className="lp-trust-row lp-reveal lp-d4">
              {content.trust.map((t) => (
                <div key={t} className="lp-trust-chip">
                  <CheckIcon />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right: arch + biodata preview */}
          <div className="lp-hero-right">
            <div className="lp-arch-wrap">
              <div className="lp-arch">
                <div className="lp-biodata-card">
                  <div className="lp-bc-bar" />
                  <div className="lp-bc-inner">
                    <div className="lp-bc-top">
                      <div className="lp-bc-photo">🌸</div>
                      <div>
                        <div className="lp-bc-name-deva">प्रिया शर्मा</div>
                        <div className="lp-bc-name-en">Priya Sharma</div>
                        <div className="lp-bc-age">25 · Mumbai · Hindu</div>
                      </div>
                    </div>
                    {[
                      ["Education", "B.Tech, IIT Delhi"],
                      ["Profession", "Software Engineer"],
                      ["Gotra", "Bharadwaj"],
                      ["Rashi · Manglik", "Kanya · No"],
                      ["Father", "Rajesh Sharma, CA"],
                    ].map(([k, v]) => (
                      <div key={k} className="lp-bc-field">
                        <span className="lp-bc-k">{k}</span>
                        <span className="lp-bc-v">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="lp-bc-foot">
                    <span className="lp-bc-link">🔒 Private · Expires May 5</span>
                    <span className="lp-bc-badge">● Active</span>
                  </div>
                </div>
              </div>

              {/* Floating notification */}
              <div className="lp-arch-badge">
                <div className="lp-arch-badge-dot" />
                <span className="lp-deva">शर्मा परिवार</span>&nbsp;viewed
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lp-section-how">
        <div className="lp-inner">
          <div className="lp-section-head lp-reveal">
            <div className="lp-rule">
              <div className="lp-rule-line" />
              <span className="lp-rule-star">✦</span>
              <div className="lp-rule-line" />
            </div>
            <h2 className="lp-section-title">How it works</h2>
            <p className="lp-section-sub">
              From your first detail to a shared biodata — three steps.
            </p>
          </div>

          <div className="lp-how-grid">
            {/* Steps */}
            <div>
              {[
                {
                  num: "०१",
                  hindi: "भरें",
                  title: "Fill your details",
                  desc: "A guided 5-step form covering personal details, family, education, and horoscope. Takes about 15 minutes.",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  ),
                  delay: "",
                },
                {
                  num: "०२",
                  hindi: "सजाएं",
                  title: "Choose your style",
                  desc: "Pick from 4 beautifully designed templates — Traditional, Modern, Premium, and Split layout.",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                    </svg>
                  ),
                  delay: "lp-d1",
                },
                {
                  num: "०३",
                  hindi: "भेजें",
                  title: "Share privately",
                  desc: "Create personal share links. Decide which sections each recipient sees. Revoke access anytime.",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  ),
                  delay: "lp-d2",
                },
              ].map((s) => (
                <div key={s.num} className={`lp-step lp-reveal ${s.delay}`}>
                  <div className="lp-step-num-col">
                    <span className="lp-step-num">{s.num}</span>
                    <div className="lp-step-icon">{s.icon}</div>
                  </div>
                  <div>
                    <div className="lp-step-hindi">{s.hindi}</div>
                    <div className="lp-step-title">{s.title}</div>
                    <div className="lp-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Traditions */}
            <div className="lp-reveal lp-d1">
              <span className="lp-trad-eyebrow">Purpose-built for your traditions</span>

              <div className="lp-trad-card">
                <div className="lp-trad-sym" style={{ color: "#BF4A1A" }}>ॐ</div>
                <div>
                  <div className="lp-trad-name">Hindu</div>
                  <div className="lp-trad-tags">Gotra · Nakshatra · Manglik · Rashi</div>
                </div>
              </div>

              <div className="lp-trad-card">
                <div className="lp-trad-sym" style={{ color: "#2A6B60" }}>☸</div>
                <div>
                  <div className="lp-trad-name">Jain</div>
                  <div className="lp-trad-tags">Sect · Samaj · Pravachan · Gotra</div>
                </div>
              </div>

              <div className="lp-trad-soon">
                Sikh, Muslim &amp; Christian communities coming soon
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MATCHMAKER ── */}
      <section className="lp-section-mm" ref={matchmakerRef}>
        <div className="lp-inner">
          <div className="lp-mm-grid">

            {/* Left: copy */}
            <div>
              <span className="lp-label lp-reveal" style={{ marginBottom: 20, display: "block" }}>
                For Matchmakers
              </span>
              <h2 className="lp-mm-h2 lp-reveal lp-d1">
                Your practice deserves
                <br />
                <em>professional tools.</em>
              </h2>
              <p className="lp-mm-body lp-reveal lp-d2">
                If you're managing 50–100 families at a time, a simple biodata
                form isn't enough. Rishte's matchmaker workspace gives you a full
                client management system — built around how you actually work.
              </p>

              <div className="lp-mm-feats lp-reveal lp-d2">
                {[
                  ["Unlimited client biodatas", "— no per-family charge, ever"],
                  ["Client folders", "— organize every family, search instantly"],
                  ["Reusable templates", "— create once, apply across similar profiles"],
                  ["View tracking", "— see which families opened which profiles"],
                  ["Per-link access control", "— revoke any share, anytime"],
                ].map(([bold, rest]) => (
                  <div key={bold} className="lp-mm-feat">
                    <div className="lp-mm-feat-line" />
                    <div className="lp-mm-feat-text">
                      <strong>{bold}</strong> {rest}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/biodata/personal"
                className="lp-btn lp-btn-gold lp-reveal lp-d3"
              >
                Explore Matchmaker Workspace →
              </Link>
            </div>

            {/* Right: workspace mockup */}
            <div className="lp-workspace lp-reveal lp-d2">
              <div className="lp-ws-titlebar">
                <span className="lp-ws-title">My Clients</span>
                <span className="lp-ws-add">+ Add Family</span>
              </div>
              <div className="lp-ws-stats">
                {[
                  ["47", "Families"],
                  ["12", "Active shares"],
                  ["3", "Viewed today"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div className="lp-ws-stat-n">{n}</div>
                    <div className="lp-ws-stat-l">{l}</div>
                  </div>
                ))}
              </div>
              <div className="lp-ws-search">
                <SearchIcon />
                <span className="lp-ws-search-text">Search families…</span>
              </div>
              {[
                { cls: "lp-av-s", initial: "S", name: "Sharma", hindi: "परिवार", meta: "3 links · Viewed Apr 20", chip: "lp-chip-active", chipLabel: "● Active" },
                { cls: "lp-av-m", initial: "M", name: "Mehta",  hindi: "जी",      meta: "1 link · Viewed Apr 18", chip: "lp-chip-viewed", chipLabel: "Viewed" },
                { cls: "lp-av-g", initial: "G", name: "Gupta",  hindi: "परिवार", meta: "Biodata incomplete",      chip: "lp-chip-draft",  chipLabel: "Draft" },
                { cls: "lp-av-v", initial: "V", name: "Verma",  hindi: "परिवार", meta: "2 links · Viewed Apr 22", chip: "lp-chip-active", chipLabel: "● Active" },
              ].map((row) => (
                <div key={row.name} className="lp-ws-row">
                  <div className={`lp-ws-av ${row.cls}`}>{row.initial}</div>
                  <div className="lp-ws-info">
                    <div className="lp-ws-name">
                      {row.name}{" "}
                      <span className="lp-deva" style={{ fontSize: 12 }}>
                        {row.hindi}
                      </span>
                    </div>
                    <div className="lp-ws-meta">{row.meta}</div>
                  </div>
                  <div className={`lp-ws-chip ${row.chip}`}>{row.chipLabel}</div>
                </div>
              ))}
              <div className="lp-ws-more">View all 47 families →</div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="lp-section-trust">
        <div className="lp-inner">
          <div className="lp-section-head lp-reveal">
            <div className="lp-rule">
              <div className="lp-rule-line" />
              <span className="lp-rule-star">✦</span>
              <div className="lp-rule-line" />
            </div>
            <h2 className="lp-section-title">Built on trust</h2>
            <p className="lp-section-sub">
              <span className="lp-deva">शादी</span> is one of life's biggest
              steps. We take that seriously.
            </p>
          </div>

          {/* Numbers */}
          <div className="lp-trust-numbers lp-reveal lp-d1">
            {[
              ["2,400+", "Biodatas created"],
              ["180+", "Matchmakers using Rishte"],
              ["Zero", "Ads. Ever."],
            ].map(([n, l]) => (
              <div key={l} className="lp-trust-n-item">
                <div className="lp-trust-n">{n}</div>
                <div className="lp-trust-n-l">{l}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="lp-trust-feats">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ),
                title: "You control who sees what",
                desc: "Share only the sections each recipient needs. Horoscope, photo, contact — all on separate links.",
                delay: "",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ),
                title: "Verified profiles",
                desc: "Real families. No fake profiles, no bots, no automated matching from our side.",
                delay: "lp-d1",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
                title: "No ads, ever",
                desc: <>Your <span className="lp-deva">बायोडेटा</span> is not a product. We will never sell your family's data to anyone.</>,
                delay: "lp-d2",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ),
                title: "Built for your values",
                desc: "Designed around Hindu & Jain traditions — not adapted from a generic Western platform.",
                delay: "lp-d3",
              },
            ].map((f) => (
              <div key={f.title} className={`lp-reveal ${f.delay}`}>
                <div className="lp-tf-icon">{f.icon}</div>
                <div className="lp-tf-title">{f.title}</div>
                <div className="lp-tf-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <Link to="/" className="lp-foot-logo">
          <SparrowMark size={18} opacity={0.7} />
          <span className="lp-foot-rishte">रिश्ते</span>
          <span className="lp-foot-by">by Daanyam</span>
        </Link>
        <nav className="lp-foot-nav">
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="lp-foot-copy">© 2025 Daanyam</div>
      </footer>

    </div>
  );
}
