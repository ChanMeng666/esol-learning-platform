"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { CopilotContext } from "./copilot/copilot-context";
import { CopilotActions } from "./copilot/copilot-actions";
// TODO: Fix CopilotChatMonitor - useCopilotChat API needs investigation
// import { CopilotChatMonitor } from "./copilot/copilot-chat-monitor";

export function Providers({ children }: { children: React.ReactNode }) {
  // Use environment variable or fallback to default public key
  const copilotApiKey = process.env.NEXT_PUBLIC_COPILOT_API_KEY || "ck_pub_885b3aef1f61a5335479cf0beb7e6922";

  return (
    <CopilotKit publicApiKey={copilotApiKey}>
      <CopilotContext>
        <CopilotActions>
          {/* TODO: Re-enable CopilotChatMonitor after API investigation */}
          {/* <CopilotChatMonitor /> */}
          <CopilotSidebar
            labels={{
              title: "NZCEL Study Assistant",
              initial: "Hi! I'm your AI study companion. Ask me anything about NZCEL, or let me help you practice!",
            }}
          >
            {children}
          </CopilotSidebar>
        </CopilotActions>
      </CopilotContext>
    </CopilotKit>
  );
}
