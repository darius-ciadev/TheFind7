export default function Footer() {
  return (
    <footer className="w-full mt-20 py-10 border-t text-center text-sm text-neutral">
      <div>
        © {new Date().getFullYear()} <span className="font-semibold">The Find 7</span> — All rights reserved.
      </div>

      <div className="mt-3 space-x-4">
        <a href="/privacy" className="hover:underline">Privacy</a>
        <a href="/terms" className="hover:underline">Terms</a>
        <a href="/contact" className="hover:underline">Contact</a>
      </div>
    </footer>
  );
}
