import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entropy | Your Account",
  description: "Manage your subscription.",
};

interface SubscriptionLayoutProps {
  children: React.ReactNode;
}

export default async function SubscriptionLayout({
  children,
}: SubscriptionLayoutProps) {
  return (
    <div className="max-w-7xl w-full mx-auto flex flex-col items-center">
      {children}
    </div>
  );
}
