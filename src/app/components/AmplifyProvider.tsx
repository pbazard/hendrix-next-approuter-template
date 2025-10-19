"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { useEffect, useState } from "react";

export default function AmplifyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const configureAmplify = async () => {
      try {
        console.log("[WRENCH] Configuring Amplify...");
        console.log("[FILE] Outputs:", outputs);

        // Configure Amplify on client mount
        Amplify.configure(outputs);

        // Add a small delay to ensure configuration is complete
        await new Promise((resolve) => setTimeout(resolve, 100));

        console.log("[CHECK] Amplify configured successfully");
        console.log("[SEARCH] Amplify config:", Amplify.getConfig());

        setIsConfigured(true);
      } catch (error) {
        console.error("[X] Error configuring Amplify:", error);
        // Still set as configured to prevent infinite loading
        setIsConfigured(true);
      }
    };

    configureAmplify();
  }, []);

  // Don't render children until Amplify is configured
  if (!isConfigured) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
