import { site } from "@/lib/site";

export function Logo() {
  return <img className="logo" src="/brand/sd_logo.svg" width={152} height={41} alt={`${site.name} logo`} />;
}
