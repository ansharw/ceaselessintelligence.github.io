import type { Metadata } from "next";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="August 2, 2026"
      notice="Placeholder draft. This page needs to be reviewed by a legal team/counsel before go-live, especially regarding compliance with Indonesia's Personal Data Protection Law (UU PDP)."
    >
      <p>
        Ceaseless Intelligence (&ldquo;we&rdquo;) values the privacy of our visitors and clients.
        This policy explains what data we collect, how we use it, and your rights regarding that
        data.
      </p>

      <div>
        <h2>1. Data We Collect</h2>
        <ul>
          <li>
            Data you submit through the contact form: name, company name, business email, website,
            company description, and the information you share about your business.
          </li>
          <li>Site usage data via Google Analytics 4, such as pages visited and interactions with buttons/CTAs.</li>
          <li>Communication data you send via WhatsApp or email.</li>
        </ul>
      </div>

      <div>
        <h2>2. How We Use Data</h2>
        <ul>
          <li>To contact you regarding your inquiry.</li>
          <li>To store and manage prospect data in HubSpot CRM.</li>
          <li>To improve the quality of our services and site content.</li>
        </ul>
      </div>

      <div>
        <h2>3. Data Storage and Security</h2>
        <p>
          Data is stored on CRM systems (HubSpot) and trusted third-party infrastructure. We take
          reasonable technical and organizational measures to keep data secure.
        </p>
      </div>

      <div>
        <h2>4. Sharing Data with Third Parties</h2>
        <p>
          We do not sell your personal data. Data may be shared with service providers that support
          our operations (such as HubSpot, Google Workspace) to the extent necessary.
        </p>
      </div>

      <div>
        <h2>5. Your Rights</h2>
        <p>
          You have the right to request access to, correction of, or deletion of your personal data
          by contacting us via the email listed in this site&rsquo;s footer.
        </p>
      </div>

      <div>
        <h2>6. Contact</h2>
        <p>Questions about this policy can be sent to Ceaseless Intelligence&rsquo;s official email listed in the footer.</p>
      </div>
    </LegalLayout>
  );
}
