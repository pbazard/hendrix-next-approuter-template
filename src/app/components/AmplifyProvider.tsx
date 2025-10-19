"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { useEffect } from "react";

// Configure Amplify on the client side
Amplify.configure(outputs);

export default function AmplifyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Ensure Amplify is configured on client mount
    Amplify.configure(outputs);
  }, []);

  return <>{children}</>;
}
