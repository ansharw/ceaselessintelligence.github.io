import type { Metadata } from "next";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated="August 2, 2026"
      notice="Placeholder draft. This page needs to be reviewed by a legal team/counsel before go-live, and adapted to match the applicable service scope and official contracts."
    >
      <p>By accessing and using this site and Ceaseless Intelligence&rsquo;s services, you agree to the following terms.</p>

      <div>
        <h2>1. Scope of Services</h2>
        <p>
          Ceaseless Intelligence provides customer acquisition, AI automation, and growth
          infrastructure services for qualifying B2B businesses. The scope, timeline, and cost of
          each engagement are set out in a separate proposal following an initial conversation.
        </p>
      </div>

      <div>
        <h2>2. No Guarantee of Results</h2>
        <p>
          We do not guarantee a specific number of leads, meetings, or sales. Results are
          influenced by market conditions, the offer, pricing, reputation, data quality, and the
          client team&rsquo;s ability to follow up on opportunities.
        </p>
      </div>

      <div>
        <h2>3. Confidentiality</h2>
        <p>
          Business information shared by the client during the discovery and engagement process
          will be treated as confidential and used only for the agreed service purposes.
        </p>
      </div>

      <div>
        <h2>4. Limitation of Liability</h2>
        <p>
          Ceaseless Intelligence is not liable for indirect losses arising from the use of
          recommendations, automation, or systems implemented, beyond any applicable written
          agreement.
        </p>
      </div>

      <div>
        <h2>5. Changes to Terms</h2>
        <p>These terms may be updated from time to time. The latest version will always be available on this page.</p>
      </div>

      <div>
        <h2>6. Contact</h2>
        <p>Questions about these terms can be sent to Ceaseless Intelligence&rsquo;s official email listed in the footer.</p>
      </div>
    </LegalLayout>
  );
}
