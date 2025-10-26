import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="container mx-auto px-6 py-16 md:py-24">
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Left Side: Text and Button */}
        <div className="flex-1 md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
            Find All Your UCF Resources in One Place.
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            From legal aid and healthcare to conference funding and career certifications, KnightSource connects you to the help you need to succeed.
          </p>
          <Link
            href="#categories"
            className="inline-block bg-ucf-gold text-ucf-black font-bold text-lg px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Explore Resources
          </Link>
        </div>
        
        {/* Right Side: Image */}
        <div className="flex-1 md:w-1/2 mt-8 md:mt-0">
          <Image
            src="/hero-image.jpg" // <-- Replace this with your image
            alt="UCF students on campus"
            width={600}
            height={400}
            className="rounded-lg shadow-2xl object-cover w-full h-full"
            priority
          />
        </div>
      </div>
    </section>
  );
}