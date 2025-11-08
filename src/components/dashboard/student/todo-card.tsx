"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Target, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { getStudentTodoItems } from "@/actions/dashboard/student-todo";
import type { TodoItem } from "@/types";
import Link from "next/link";
import { format } from "date-fns";

/**
 * Todo Card Component for Student Dashboard
 *
 * Displays actionable todo items from three sources:
 * 1. Incomplete assignments (due soon)
 * 2. Achievements nearly complete (progress > 80%)
 * 3. Recommended practice based on diagnostic results
 *
 * Self-contained component that fetches its own data via Server Action.
 *
 * @example
 * ```tsx
 * <TodoCard />
 * ```
 */
export function TodoCard() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const items = await getStudentTodoItems();
        setTodos(items);
      } catch (error) {
        console.error("Failed to load todo items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTodos();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Your Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPriorityStyles = (priority: TodoItem["priority"]) => {
    switch (priority) {
      case "high":
        return {
          badge: "destructive",
          border: "border-l-4 border-l-red-500",
          icon: "text-red-500",
        };
      case "medium":
        return {
          badge: "default",
          border: "border-l-4 border-l-orange-500",
          icon: "text-orange-500",
        };
      case "low":
        return {
          badge: "secondary",
          border: "border-l-4 border-l-gray-400",
          icon: "text-gray-500",
        };
    }
  };

  const getTypeIcon = (type: TodoItem["type"]) => {
    switch (type) {
      case "assignment":
        return Clock;
      case "achievement":
        return Target;
      case "recommendation":
        return Sparkles;
    }
  };

  const getTypeBadge = (type: TodoItem["type"]) => {
    switch (type) {
      case "assignment":
        return { label: "Assignment", variant: "default" as const };
      case "achievement":
        return { label: "Achievement", variant: "secondary" as const };
      case "recommendation":
        return { label: "Recommended", variant: "outline" as const };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Your Tasks
        </CardTitle>
        <CardDescription>Focus on what matters most</CardDescription>
      </CardHeader>
      <CardContent>
        {todos.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-3" />
            <h3 className="font-semibold text-lg mb-1">All caught up!</h3>
            <p className="text-sm text-muted-foreground">
              No pending tasks. Great work! Check back later for new assignments.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.slice(0, 5).map((todo) => {
              const priorityStyles = getPriorityStyles(todo.priority);
              const TypeIcon = getTypeIcon(todo.type);
              const typeBadge = getTypeBadge(todo.type);

              return (
                <Link key={todo.id} href={todo.actionUrl}>
                  <div
                    className={`group p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer ${priorityStyles.border}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`p-2 rounded-lg bg-background border mt-0.5 ${priorityStyles.icon}`}
                        >
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm truncate">{todo.title}</h4>
                            <Badge variant={typeBadge.variant} className="text-xs shrink-0">
                              {typeBadge.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {todo.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            {todo.dueDate && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Due {format(new Date(todo.dueDate), "MMM d")}
                              </span>
                            )}
                            {todo.progress !== undefined && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {todo.progress}% complete
                              </span>
                            )}
                            {todo.priority === "high" && (
                              <Badge
                                variant="destructive"
                                className="text-xs h-5 px-2 py-0"
                              >
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Link>
              );
            })}

            {todos.length > 5 && (
              <div className="pt-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/student/assignments">
                    View all tasks ({todos.length})
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
