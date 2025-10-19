import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";

export default async function Handler(props: { params: Promise<{ stack: string[] }> }) {
  const params = await props.params;
  const currentPage = params.stack?.[0];

  // Pages that should be centered (simple forms)
  const centeredPages = ['sign-in', 'sign-up', 'forgot-password', 'password-reset'];
  const shouldCenter = centeredPages.includes(currentPage);

  if (shouldCenter) {
    // Centered layout for authentication forms
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          <StackHandler app={stackServerApp} routeProps={props} />
        </div>
      </div>
    );
  }

  // Full-width layout for complex pages (account settings, etc.)
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <StackHandler app={stackServerApp} routeProps={props} />
    </div>
  );
}
