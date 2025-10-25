import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  FileQuestion,
  Users,
  ClipboardList,
  MessageSquare,
  BookOpen,
  Search,
  Inbox,
} from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "search" | "error";
}

/**
 * Empty State Component
 * Displays when there's no data to show
 *
 * Usage:
 * <EmptyState
 *   icon={<Users />}
 *   title="No students found"
 *   description="Add students to your class to get started"
 *   action={{ label: "Add Students", onClick: handleAddStudents }}
 * />
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "default",
}: EmptyStateProps) {
  const defaultIcon = variant === "search" ? <Search className="w-16 h-16" /> : <Inbox className="w-16 h-16" />;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="text-muted-foreground mb-4">{icon || defaultIcon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="default">
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * Specialized Empty State variants
 */
export function EmptyStudentsState({ onAddStudents }: { onAddStudents: () => void }) {
  return (
    <EmptyState
      icon={<Users className="w-16 h-16" />}
      title="No students yet"
      description="Add students to this class to start tracking their progress"
      action={{ label: "Add Students", onClick: onAddStudents }}
    />
  );
}

export function EmptyAssignmentsState({ onCreateAssignment }: { onCreateAssignment: () => void }) {
  return (
    <EmptyState
      icon={<ClipboardList className="w-16 h-16" />}
      title="No assignments yet"
      description="Create your first assignment to track student work"
      action={{ label: "Create Assignment", onClick: onCreateAssignment }}
    />
  );
}

export function EmptyClassesState({ onCreateClass }: { onCreateClass: () => void }) {
  return (
    <EmptyState
      icon={<BookOpen className="w-16 h-16" />}
      title="No classes yet"
      description="Create a class to start managing students and assignments"
      action={{ label: "Create Class", onClick: onCreateClass }}
    />
  );
}

export function EmptyDiagnosticResultsState() {
  return (
    <EmptyState
      icon={<FileQuestion className="w-16 h-16" />}
      title="No diagnostic results"
      description="Student hasn't completed any diagnostic tests yet"
    />
  );
}

export function EmptyRecordingsState() {
  return (
    <EmptyState
      icon={<MessageSquare className="w-16 h-16" />}
      title="No recordings yet"
      description="Student recordings will appear here once they start practicing"
    />
  );
}

export function EmptySearchState({ searchQuery }: { searchQuery: string }) {
  return (
    <EmptyState
      icon={<Search className="w-16 h-16" />}
      title="No results found"
      description={`No results match "${searchQuery}". Try adjusting your search.`}
      variant="search"
    />
  );
}

/**
 * Error State Component
 * Displays when there's an error loading data
 */
export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this data. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="default">
          Try Again
        </Button>
      )}
    </div>
  );
}
