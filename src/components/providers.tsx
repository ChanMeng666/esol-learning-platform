"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { CopilotContext } from "./copilot/copilot-context";
import { CopilotActions } from "./copilot/copilot-actions";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit publicApiKey={process.env.NEXT_PUBLIC_COPILOT_API_KEY || ""}>
      <CopilotContext>
        <CopilotActions>
          <CopilotSidebar
            defaultOpen={false}
            labels={{
              title: "NZCEL Study Assistant",
              initial: "Hi! I'm your AI study companion. Ask me anything about NZCEL, or let me help you practice!",
            }}
            clickOutsideToClose={false}
          >
            {children}
          </CopilotSidebar>
        </CopilotActions>
      </CopilotContext>
    </CopilotKit>
  );
}
