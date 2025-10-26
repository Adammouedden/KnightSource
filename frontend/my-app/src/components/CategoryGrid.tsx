import Image from "next/image";

// Define your categories
const categories = [
  { name: "Legal Services", imageUrl: "/categories/legal.jpg" },
  { name: "Healthcare", imageUrl: "/categories/healthcare.jpg" },
  { name: "Conference Travel", imageUrl: "/categories/travel.jpg" },
  { name: "Certifications", imageUrl: "/categories/certs.jpg" },
  { name: "Recreation", imageUrl: "/categories/recreation.jpg" },
  { name: "Academic Support", imageUrl: "/categories/academic.jpg" },
];

// This is the individual tile component
function CategoryTile({ name, imageUrl }: { name: string, imageUrl: string }) {
  return (
    <div className="group relative rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105">
      <Image
        src={imageUrl} // <-- Replace with your category images
        alt={name}
        width={400}
        height={250}
        className="w-full h-56 object-cover transition-opacity group-hover:opacity-80"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
        <h3 className="text-white text-2xl font-bold p-4 text-center">
          {name}
        </h3>
      </div>
    </div>
  );
}

// This is the main grid component
export default function CategoryGrid() {
  return (
    <section id="categories" className="w-full bg-gray-50 dark:bg-gray-800 py-16 md:py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Browse by Category
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryTile 
              key={category.name} 
              name={category.name} 
              imageUrl={category.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}