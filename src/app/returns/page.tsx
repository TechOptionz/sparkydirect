import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <div className="wrap page narrow prose-page">
      <h1>Returns</h1>
      <p className="lead muted">You have 100 days to change your mind.</p>
      <p>Return an item within 100 days for a refund. Returns are sent by post, and the return postage is at your cost.</p>
      <p>
        To start a return, call <a href={site.phoneHref}>{site.phone}</a> ({site.hours}). This guarantee doesn&apos;t
        limit your rights under the Australian Consumer Law.
      </p>
    </div>
  );
}
