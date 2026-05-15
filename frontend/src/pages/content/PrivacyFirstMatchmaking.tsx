import { Link } from "react-router-dom";
import { ContentLayout, FAQSection } from "../../seo/ContentLayout";
import { SEOHead, faqPageJsonLd } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";

const FAQS = [
  {
    question: "What is privacy-first matchmaking?",
    answer:
      "Privacy-first matchmaking means you control who sees your biodata, photos, and family details — at every stage. Rather than uploading your profile to a public matrimonial site where it can be browsed by anyone, you generate private share links for specific families.",
  },
  {
    question: "Are matrimonial sites like Shaadi.com private?",
    answer:
      "Matrimonial sites have privacy controls, but the core model is profile listing — your profile is browsable by other paid members, and your photos are typically visible to anyone who pays. Rishte's model is different: there's no public listing at all.",
  },
  {
    question: "How does Rishte protect my data?",
    answer:
      "Three layers: (1) no public profiles — your biodata only exists when you generate a share link; (2) per-share visibility — you choose what's visible on each link (photo, contact, full kundli); (3) revocation — you can revoke any link instantly, cutting off access.",
  },
  {
    question: "Can families I share with forward my biodata?",
    answer:
      "They can forward the share link, but you set the visibility rules — so even if it's forwarded, the original visibility you chose applies. And you can revoke at any time. This is fundamentally different from sending a PDF, which can't be unsent.",
  },
];

export function PrivacyFirstMatchmaking() {
  const route = getSeoForPath("/privacy-first-matchmaking");
  return (
    <>
      <SEOHead route={route} jsonLd={[faqPageJsonLd(FAQS)]} />
      <ContentLayout
        heading="Privacy-First Matchmaking — A Safer Way to Share Biodatas"
        subheading="Why privacy matters in matrimonial matchmaking, what's wrong with the current model, and how Rishte's per-share controls actually work."
        breadcrumbs={[{ label: "Privacy-First Matchmaking" }]}
      >
        <p>
          When you create a marriage biodata, you're putting together a document that contains everything: your face, your family, your birth time, your job, your phone number. Once that document is out, you have no control over where it goes. This page is about a better model.
        </p>

        <h2>The problem with the current approach</h2>
        <p>
          Most marriage biodatas end up being shared in one of two ways:
        </p>
        <ul>
          <li>
            <strong>As a WhatsApp PDF or image:</strong> easy to send, impossible to recall. Your photo and contact ends up in dozens of group chats.
          </li>
          <li>
            <strong>On a public matrimonial site:</strong> your profile becomes browseable by every other paying member, often with photos and contact details visible.
          </li>
        </ul>
        <p>
          Neither gives you real control. By the time you've found a match, your biodata is in hundreds of places — and most of those people had nothing to do with the eventual rishta.
        </p>

        <h2>What "privacy-first" actually means</h2>
        <p>
          Privacy-first matchmaking flips the model. Instead of one document that goes everywhere, you generate a unique link for each family you share with. Each link has its own visibility settings. And you can revoke any link, anytime.
        </p>

        <h2>How Rishte's privacy controls work</h2>
        <h3>1. No public profiles</h3>
        <p>
          Your biodata isn't listed anywhere. There's no search, no browse, no "see who's interested in you" feature. The only way for someone to see your biodata is for you to give them a link.
        </p>

        <h3>2. Per-share visibility</h3>
        <p>
          When you create a share, you choose what's visible on that specific link:
        </p>
        <ul>
          <li>Name and basic details: on / off</li>
          <li>Photos: on / off</li>
          <li>Horoscope summary: on / off</li>
          <li>Detailed kundli (birth time, full chart): on / off</li>
          <li>Contact (phone, email): on / off</li>
        </ul>
        <p>
          You can have a "family-level" share that shows everything, and a "broker-level" share that shows only the basics — same biodata, different visibility per recipient.
        </p>

        <h3>3. Revocation</h3>
        <p>
          Click revoke on any share link, and the recipient can no longer see your biodata. This is fundamentally different from a PDF — once sent, a PDF is permanent.
        </p>

        <h3>4. View tracking</h3>
        <p>
          You can see when each share link was opened and how many times. If something looks off, you can revoke before anything sensitive spreads.
        </p>

        <h3>5. Expiry dates</h3>
        <p>
          Every share link has an expiry — typically 30, 60, or 90 days. After that, the link auto-revokes. No stale biodatas floating around years later.
        </p>

        <h2>What this looks like in practice</h2>
        <p>
          Imagine your aunt asks for your biodata to forward to a family she knows. Instead of sending a PDF, you create a "family-share" link with photo + contact visible. She forwards it. The recipient family opens it; you see the view in your dashboard.
        </p>
        <p>
          A week later, a different friend asks for your biodata for a broker. You create a "broker-share" link with photo hidden and contact hidden. The broker can see your basic details, but not your face or phone number. If you want to share more later, you can — or revoke entirely.
        </p>

        <h2>Privacy as a feature, not a footnote</h2>
        <p>
          Big matrimonial sites have privacy settings, but their core revenue comes from people browsing profiles. The product is designed for visibility. Rishte's product is designed for the opposite: minimum exposure, maximum control. That's a fundamentally different stance.
        </p>

        <p>
          We've written more on related topics — <Link to="/blog/biodata-sharing-etiquette">biodata sharing etiquette</Link>,{" "}
          <Link to="/blog/horoscope-privacy">why your birth details deserve protection</Link>, and{" "}
          <Link to="/blog/why-not-matrimonial-sites">how we compare to matrimonial sites</Link>.
        </p>

        <FAQSection faqs={FAQS} />
      </ContentLayout>
    </>
  );
}
