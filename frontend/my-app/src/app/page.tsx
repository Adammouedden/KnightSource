import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ChatButton from "@/components/ChatButton";

export default function Home() {
  return (
    <div className="relative">
      <main className="flex min-h-screen flex-col">
        <Navbar />
        <Hero />
        <CategoryGrid />
      </main>
      <ChatButton />
    </div>
  );
}