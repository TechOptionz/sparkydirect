import videos from "@/data/videos.json";

// Clips are listed in src/data/videos.json.
export function Videos() {
  const list = videos as { src: string; title: string }[];
  if (!list.length) return null;
  return (
    <section className="wrap section">
      <h2 className="section-title">See it working</h2>
      <div className="videos">
        {list.map((v) => (
          <video key={v.src} src={v.src} title={v.title} controls muted playsInline preload="metadata" />
        ))}
      </div>
    </section>
  );
}
