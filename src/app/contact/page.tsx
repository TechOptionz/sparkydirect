import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="wrap page narrow prose-page">
      <h1>Talk to us</h1>
      <p className="lead muted">Real people, based in Queensland.</p>
      <dl className="specs">
        <div>
          <dt>Phone</dt>
          <dd>
            <a href={site.phoneHref}>{site.phone}</a>
          </dd>
        </div>
        {site.email && (
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </dd>
          </div>
        )}
        <div>
          <dt>Hours</dt>
          <dd>{site.hours}</dd>
        </div>
        <div>
          <dt>Click &amp; Collect</dt>
          <dd>{site.address}</dd>
        </div>
      </dl>
    </div>
  );
}
