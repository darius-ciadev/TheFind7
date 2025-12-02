import CategoryCard from "@/components/CategoryCard";

export default function CategoriesPage() {
  return (
    <div className="max-w-6xl mx-auto py-16">
      <h1 className="text-4xl font-bold text-center mb-2">Browse Categories</h1>
      <p className="text-center text-gray-600 mb-10">
        Seven ways to the right choice — curated for every kind of shopper.
      </p>
      
      {/* You already have CategoryCard, so reuse it here */}
      {/* <CategoryCard /> */}
    </div>
  );
}
