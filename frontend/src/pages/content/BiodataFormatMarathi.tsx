import { Link } from "react-router-dom";
import { ContentLayout, FAQSection } from "../../seo/ContentLayout";
import { SEOHead, faqPageJsonLd } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";

const FAQS = [
  {
    question: "What is a Marathi marriage biodata?",
    answer:
      "A Marathi marriage biodata (विवाह बायोडाटा) is a one-page profile used in Marathi matrimonial conversations. It includes personal details, family information (with emphasis on kuldevta/kuldaivat and gotra), education, occupation, and horoscope. It can be presented in Marathi (देवनागरी) or English.",
  },
  {
    question: "Should I write the biodata in Marathi or English?",
    answer:
      "Both work. Marathi (देवनागरी script) is traditional and respected, especially when the conversation is with older family members. English is practical for forwarding on WhatsApp and reaching families across regions. On Rishte you can include both — title in Marathi, fields in English.",
  },
  {
    question: "What is gotra and why does it appear on Marathi biodatas?",
    answer:
      "Gotra is a paternal lineage marker used in Hindu families. In Marathi Brahmin (Deshastha, Konkanastha, Karhade), Maratha, and other communities, gotra is mentioned on biodatas because traditional matchmaking avoids same-gotra alliances. Common Marathi gotras include Vasishtha, Bharadwaj, Kashyap, and Atri.",
  },
  {
    question: "Is kuldaivat important to mention?",
    answer:
      "For many Marathi families, yes. Kuldaivat (family deity) often appears alongside gotra and native place. Common ones include Tulja Bhavani, Khandoba, Vitthal, Renuka, and Mahalakshmi.",
  },
];

export function BiodataFormatMarathi() {
  const route = getSeoForPath("/biodata-format/marathi");
  return (
    <>
      <SEOHead route={route} jsonLd={[faqPageJsonLd(FAQS)]} />
      <ContentLayout
        heading="Marathi Marriage Biodata Format — मराठी विवाह बायोडाटा"
        subheading="A complete Marathi marriage biodata sample with the fields Marathi families actually look for — gotra, kuldaivat, native place — plus modern presentation tips."
        breadcrumbs={[
          { label: "Biodata Format", to: "/biodata-format" },
          { label: "Marathi" },
        ]}
      >
        <p>
          Marathi marriage biodatas have a distinct flavour — they emphasise family lineage (kul, gotra), kuldaivat, and native place alongside the usual education and career details. Whether you're from a Deshastha, Konkanastha, Karhade, Maratha, CKP, Saraswat, or any other Marathi community, the structure is similar.
        </p>

        <h2>Sample Marathi biodata (मराठी)</h2>
        <div className="content-sample">
          <h4 className="content-sample__heading">वैयक्तिक तपशील</h4>
          <dl>
            <dt>नाव</dt>
            <dd>आदित्य पाटील</dd>
            <dt>जन्म तारीख</dt>
            <dd>१८ मे १९९४</dd>
            <dt>जन्म वेळ</dt>
            <dd>सकाळी ०७:२५</dd>
            <dt>जन्म स्थळ</dt>
            <dd>पुणे, महाराष्ट्र</dd>
            <dt>उंची</dt>
            <dd>५'१०" (१७८ सेमी)</dd>
            <dt>जात / पोटजात</dt>
            <dd>मराठा, ९६ कुळी</dd>
            <dt>गोत्र</dt>
            <dd>कौशिक</dd>
            <dt>कुलदैवत</dt>
            <dd>तुळजाभवानी</dd>
            <dt>मूळ गाव</dt>
            <dd>कोल्हापूर</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">शिक्षण &amp; व्यवसाय</h4>
          <dl>
            <dt>शिक्षण</dt>
            <dd>बी.ई. (मेकॅनिकल), VJTI, मुंबई</dd>
            <dt>नोकरी</dt>
            <dd>सीनिअर मॅनेजर, टाटा मोटर्स</dd>
            <dt>वार्षिक उत्पन्न</dt>
            <dd>₹२२ लाख</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">कुटुंब</h4>
          <dl>
            <dt>वडील</dt>
            <dd>श्री. विजय पाटील — निवृत्त इंजिनिअर</dd>
            <dt>आई</dt>
            <dd>सौ. स्मिता पाटील — गृहिणी</dd>
            <dt>भाऊ</dt>
            <dd>अनिकेत — डॉक्टर, विवाहित, पुणे</dd>
            <dt>कुटुंब प्रकार</dt>
            <dd>विभक्त, पारंपरिक मूल्ये</dd>
          </dl>
        </div>

        <h2>Sample biodata (English version)</h2>
        <p>The same content, in English — useful when forwarding to non-Marathi-reading families.</p>

        <div className="content-sample">
          <h4 className="content-sample__heading">Personal Details</h4>
          <dl>
            <dt>Name</dt>
            <dd>Aditya Patil</dd>
            <dt>Date of Birth</dt>
            <dd>18 May 1994</dd>
            <dt>Time of Birth</dt>
            <dd>07:25 AM</dd>
            <dt>Place of Birth</dt>
            <dd>Pune, Maharashtra</dd>
            <dt>Caste / Community</dt>
            <dd>Maratha, 96 Kuli</dd>
            <dt>Gotra</dt>
            <dd>Kaushik</dd>
            <dt>Kuldaivat</dt>
            <dd>Tulja Bhavani</dd>
            <dt>Native Place</dt>
            <dd>Kolhapur</dd>
          </dl>
        </div>

        <h2>What's unique about Marathi biodatas</h2>
        <ul>
          <li>
            <strong>Gotra</strong> is almost always included. Traditional Marathi matchmaking avoids same-gotra alliances.
          </li>
          <li>
            <strong>Kuldaivat</strong> (family deity) is a marker of cultural lineage — common across most Marathi communities.
          </li>
          <li>
            <strong>Native place / Mool gaon</strong> matters more than current city for traditional families.
          </li>
          <li>
            <strong>Pothi-Patrika</strong> (horoscope chart) is often shared along with the biodata for kundli matching.
          </li>
        </ul>

        <h2>Tips for a Marathi biodata</h2>
        <p>
          If you want to present both languages, lead with Marathi for the header (name, blessing) and use English for the data fields — this works well on WhatsApp where mixed-language families read it. If your family is traditional, include kundli details prominently; <Link to="/kundli-milan">read more about how Marathi families do kundli matching</Link>.
        </p>

        <p>
          On Rishte you can create a Marathi-friendly biodata in 5 minutes — the platform supports Devanagari script and the templates work beautifully with both Marathi and English content.
        </p>

        <FAQSection faqs={FAQS} />
      </ContentLayout>
    </>
  );
}
