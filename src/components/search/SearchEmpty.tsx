export default function SearchEmpty({ query }) {
  return (
    <div className="text-center mt-16 opacity-70">
      <h2 className="text-xl font-semibold">No results found</h2>
      <p className="mt-2">We couldn’t find anything matching “{query}”.</p>
    </div>
  );
}