import { Link } from "react-router-dom";
import { ContentLayout } from "../../seo/ContentLayout";
import { SEOHead, articleJsonLd } from "../../seo/SEOHead";
import { getSeoForPath, SITE_ORIGIN } from "../../seo/routes";

export function BlogWhyNotMatrimonialSites() {
  const route = getSeoForPath("/blog/why-not-matrimonial-sites");
  return (
    <>
      <SEOHead
        route={route}
        jsonLd={[
          articleJsonLd({
            title: route.title,
            description: route.description,
            url: `${SITE_ORIGIN}${route.path}`,
            datePublished: "2026-01-15",
            dateModified: "2026-05-01",
          }),
        ]}
      />
      <ContentLayout
        heading="An Alternative to Shaadi.com — Why Rishte is Different"
        subheading="How Rishte fundamentally differs from matrimonial sites — and why it's a better fit if you value privacy and your family's involvement."
        breadcrumbs={[
          { label: "Blog", to: "/blog/why-not-matrimonial-sites" },
          { label: "vs. Matrimonial Sites" },
        ]}
      >
        <p>
          People often ask whether Rishte is "another matrimonial site" — like Shaadi.com, BharatMatrimony, or Jeevansathi. The answer is no: Rishte is a completely different category. This post explains the difference and helps you decide which fits your situation.
        </p>

        <h2>What matrimonial sites do</h2>
        <p>
          Sites like Shaadi.com and BharatMatrimony are profile-listing platforms. The model is:
        </p>
        <ul>
          <li>You create a public-ish profile (visible to other paying members)</li>
          <li>You search the directory for prospective matches</li>
          <li>You send "interest" or messages to people you're interested in</li>
          <li>If they reciprocate, contact details unlock</li>
          <li>The platform's algorithm recommends profiles to you</li>
        </ul>
        <p>
          This works well when you want to actively browse and match yourself, especially without family involvement. The downside: your profile is browsable by many people you'll never talk to, and your photos are visible to anyone with a paid account.
        </p>

        <h2>What Rishte does</h2>
        <p>
          Rishte is a biodata creator and private sharing tool. You build a beautiful biodata, generate a kundli, and share it via private links — typically with families introduced through your own networks (relatives, friends, brokers, community).
        </p>
        <ul>
          <li>No profile listing</li>
          <li>No browsing other people</li>
          <li>No "matches" or recommendations</li>
          <li>Just the biodata + private sharing + view tracking</li>
        </ul>

        <h2>When matrimonial sites are the right fit</h2>
        <ul>
          <li>You're doing matchmaking solo (without family involvement)</li>
          <li>You don't have a network of relatives/brokers introducing matches</li>
          <li>You're comfortable being browsable</li>
          <li>You want to filter by very specific criteria (income, education, city, etc.)</li>
        </ul>

        <h2>When Rishte is the right fit</h2>
        <ul>
          <li>Your family is involved in matchmaking and uses WhatsApp/word-of-mouth networks</li>
          <li>You want a polished biodata with kundli for sharing privately</li>
          <li>Privacy of your photos and contact details matters to you</li>
          <li>You want to know who's viewed your biodata and when</li>
          <li>You don't want your face on a public directory</li>
        </ul>

        <h2>Can I use both?</h2>
        <p>
          Many people do. Use a matrimonial site for active browsing, and use Rishte for the actual sharing — most families end up needing a clean PDF biodata anyway. Rishte specifically focuses on doing that part really well, with privacy built in.
        </p>

        <h2>Trying Rishte</h2>
        <p>
          Rishte is free to start. <Link to="/onboarding">Create your biodata</Link> in 5 minutes and see if the workflow fits. If your matchmaking is happening through families and brokers rather than a public directory, you'll find this works much better than uploading to a profile site.
        </p>

        <p>
          Read more on <Link to="/privacy-first-matchmaking">privacy-first matchmaking</Link> and{" "}
          <Link to="/blog/biodata-sharing-etiquette">how to share biodatas safely</Link>.
        </p>
      </ContentLayout>
    </>
  );
}
