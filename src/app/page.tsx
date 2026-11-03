import { ClaimSpot } from "@/components/ClaimSpot";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MacroDemo } from "@/components/MacroDemo";
import { Nav } from "@/components/Nav";

export default function Home() {
  return (
    <div className="relative overflow-x-clip">
      <Nav />
      <main>
        {/* 01 · Hero */}
        <Hero />

        {/* 02 · Interactive Demo */}
        <MacroDemo />

        {/* 03 · Enquire */}
        <ClaimSpot />
      </main>
      <Footer />
    </div>
  );
}
