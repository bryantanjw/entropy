import { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";
import { BrandStatement } from "@/components/ui/brand-statement";

export const metadata: Metadata = {
  title: "Entropy | Reset Password",
  description: "Reset your password.",
};

export default async function ForgotPasswordPage() {
  return (
    <div className="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <BrandStatement />
      <div className="lg:p-8 flex justify-center items-center h-screen">
        <div className="lg:p-8 flex justify-center items-center h-screen relative">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
