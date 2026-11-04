import type { Metadata } from "next";
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
  return <StandaloneDemo />;
}

