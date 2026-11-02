import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="wrap page narrow prose-page">
      <h1>Privacy</h1>
      <p>
        When you place an order we collect your name, contact details and delivery address so we can fulfil it. Card
        payments are processed by Stripe, and we don&apos;t store your card details.
      </p>
      <p>Your cart is stored in your own browser and isn&apos;t sent to us until you check out.</p>
      <p>
        To ask about or correct your information, call <a href={site.phoneHref}>{site.phone}</a> or write to{" "}
        {site.name}, {site.address}.
      </p>
    </div>
  );
}
