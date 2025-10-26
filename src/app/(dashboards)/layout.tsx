import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";
import { CopilotKit } from "@copilotkit/react-core";
import { Toaster } from "@/components/ui/sonner";
import "@/app/globals.css";

export default function DashboardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <CopilotKit
              runtimeUrl="/api/copilotkit"
              agent="esol_learning_assistant"
            >
              {children}
              <Toaster />
            </CopilotKit>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
