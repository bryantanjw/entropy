import Transition from "@/components/ui/transition";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entropy | Generated Image",
  description: "Generate images.",
};

interface GenerationLayoutProps {
  children: React.ReactNode;
}

export default async function GenerationLayout({
  children,
}: GenerationLayoutProps) {
  return <Transition>{children}</Transition>;
}
