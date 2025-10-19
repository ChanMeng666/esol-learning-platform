"use client";

import { Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface EssayEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minWords?: number;
  maxWords?: number;
  disabled?: boolean;
  className?: string;
}

export function EssayEditor({
  value,
  onChange,
  placeholder = "Start writing your essay here...",
  minWords,
  maxWords,
  disabled = false,
  className,
}: EssayEditorProps) {
  // Count words
  const wordCount = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;

  // Calculate word count color
  const getWordCountColor = () => {
    if (!minWords) return "text-muted-foreground";
    if (wordCount < minWords) return "text-yellow-600";
    if (maxWords && wordCount > maxWords) return "text-red-600";
    return "text-green-600";
  };

  // Word count status message
  const getWordCountMessage = () => {
    if (minWords && wordCount < minWords) {
      return `${minWords - wordCount} more words needed`;
    }
    if (maxWords && wordCount > maxWords) {
      return `${wordCount - maxWords} words over limit`;
    }
    if (minWords && wordCount >= minWords) {
      return "Good length!";
    }
    return "";
  };

  return (
    <Card className={cn("bg-card border", className)}>
      <CardContent className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="essay-editor" className="text-sm font-medium">
            Your Essay
          </Label>
          <div className="flex items-center gap-4 text-sm">
            <span className={cn("font-medium", getWordCountColor())}>
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
            {(minWords || maxWords) && (
              <span className="text-muted-foreground">
                {minWords && maxWords
                  ? `(${minWords}-${maxWords} words)`
                  : minWords
                  ? `(min ${minWords} words)`
                  : `(max ${maxWords} words)`}
              </span>
            )}
          </div>
        </div>

        <Textarea
          id="essay-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[400px] resize-none font-serif text-base leading-relaxed"
          spellCheck={true}
        />

        <div className="flex items-center justify-between text-xs">
          <div className={cn("font-medium", getWordCountColor())}>
            {getWordCountMessage()}
          </div>
          <div className="text-muted-foreground">
            {value.length} characters
          </div>
        </div>

        {/* Writing tips */}
        <div className="bg-muted/50 border rounded-md p-3">
          <div className="flex items-start gap-2 text-xs">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Tips:</strong> Write clearly in paragraphs. Include introduction, body, and conclusion. Check spelling and grammar.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
