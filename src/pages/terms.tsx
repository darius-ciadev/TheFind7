import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl font-extrabold mb-4">
        Terms & Conditions
      </h1>

      <p className="text-lg text-gray-600 mb-10">
        We’re finalizing these details to make everything clear and transparent.
      </p>

      <div className="rounded-xl border p-10 bg-gradient-to-br from-green-50 to-white shadow-sm">
        <p className="text-lg mb-6">
          Clear rules. No jargon. Just simple terms you can trust.
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
