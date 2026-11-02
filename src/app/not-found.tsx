import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap page empty">
      <h1>We can&apos;t find that page.</h1>
      <Link href="/products" className="btn">
        Shop all products
      </Link>
    </div>
  );
}
