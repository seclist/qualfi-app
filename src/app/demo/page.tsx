import type { Metadata } from "next";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { StandaloneDemo } from "@/components/StandaloneDemo";

export const metadata: Metadata = {
  title: "Interactive Bio-Link Demo",
  description:
    "Interactive 60-second macro & body-comp diagnostic with live WhatsApp qualification preview.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DemoPage() {
  return (
    <ErrorBoundary fallbackTitle="Standalone bio-link demo encountered an error">
      <Suspense fallback={<Loading />}>
        <StandaloneDemo />
      </Suspense>
    </ErrorBoundary>
  );
}
