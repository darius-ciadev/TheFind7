import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl font-extrabold mb-4">
        Privacy Policy
      </h1>

      <p className="text-lg text-gray-600 mb-10">
        Our full privacy policy is being written with care — coming soon.
      </p>

      <div className="rounded-xl border p-10 bg-gradient-to-br from-green-50 to-white shadow-sm">
        <p className="text-lg mb-6">
          Your trust matters to us. We keep your data safe, simple, and private.
        </p>

        <Link
          href="/"
          className="inline-block bg-[var(--green)] text-white px-6 py-3 rounded-full hover:bg-[var(--green-dark)] transition"
        >
          Back to Home →
        </Link>
      </div>
    </div>
  );
}