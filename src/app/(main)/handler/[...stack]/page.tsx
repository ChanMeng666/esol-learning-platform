import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";

export default function Handler(props: { params: Promise<{ stack: string[] }> }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <StackHandler app={stackServerApp} routeProps={props} />
      </div>
    </div>
  );
}
