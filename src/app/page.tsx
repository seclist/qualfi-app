import { Suspense } from "react";
import { ClaimSpot } from "@/components/ClaimSpot";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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
        <ErrorBoundary fallbackTitle="Hero preview encountered an error">
          <Hero />
        </ErrorBoundary>

        {/* 02 · Interactive Demo */}
        <ErrorBoundary fallbackTitle="Interactive diagnostic sandbox encountered an error">
          <Suspense fallback={<div className="min-h-[640px]" aria-busy="true" />}>
            <MacroDemo />
          </Suspense>
        </ErrorBoundary>

        {/* 03 · Enquire */}
        <ErrorBoundary fallbackTitle="Blueprint configurator encountered an error">
          <Suspense fallback={<div className="min-h-[520px]" aria-busy="true" />}>
            <ClaimSpot />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
