"use client";

import Image from "next/image";
import Link from "next/link";

export function BrandStatement() {
  return (
    <div className="relative hidden min-h-screen flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div className="absolute inset-0 bg-zinc-900" />
      <Link
        href={"/"}
        className="relative z-20 flex items-center text-xl font-medium"
      >
        Entropy
      </Link>
    </div>
  );
}
