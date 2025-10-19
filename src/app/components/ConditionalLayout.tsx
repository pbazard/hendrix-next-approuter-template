"use client";

import { usePathname } from "next/navigation";
import TopBar from "./TopBar";
import { useIsClient } from "../hooks/useIsClient";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isClient = useIsClient();
  const isHomePage = pathname === "/";

  // Prevent hydration mismatch by ensuring consistent rendering
  if (!isClient) {
    return <main>{children}</main>;
  }

  return (
    <>
      {!isHomePage && <TopBar />}
      <main className={!isHomePage ? "pt-16" : ""}>{children}</main>
    </>
  );
}
