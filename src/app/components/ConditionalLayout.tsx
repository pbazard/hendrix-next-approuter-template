"use client";

import { usePathname } from "next/navigation";
import TopBar from "./TopBar";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      {!isHomePage && <TopBar />}
      <main className={!isHomePage ? "pt-16" : ""}>{children}</main>
    </>
  );
}
