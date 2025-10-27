"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Filter,
  X,
  Search,
  Calendar as CalendarIcon,
  SlidersHorizontal,
  RotateCcw,
  Download,
  Save,
  Upload
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Filter configuration types
export interface FilterConfig {
  id: string;
  label: string;
  type: "text" | "select" | "multiselect" | "range" | "date" | "daterange" | "boolean";
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface FilterValue {
  [key: string]: any;
}

interface AdvancedFilterProps {
  filters: FilterConfig[];
  values: FilterValue;
  onChange: (values: FilterValue) => void;
  onApply?: (values: FilterValue) => void;
  onReset?: () => void;
  className?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (search: string) => void;
  savedFilters?: SavedFilter[];
  onSaveFilter?: (name: string, values: FilterValue) => void;
  onLoadFilter?: (filter: SavedFilter) => void;
}

interface SavedFilter {
  id: string;
  name: string;
  values: FilterValue;
  createdAt: Date;
}

export function AdvancedFilter({
  filters,
  values = {},  // Default to empty object
  onChange,
  onApply,
  onReset,
  className,
  showSearch = true,
  searchPlaceholder = "Search...",
  onSearchChange,
  savedFilters = [],
  onSaveFilter,
  onLoadFilter,
}: AdvancedFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [saveFilterName, setSaveFilterName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Ensure values is always an object
  const safeValues = values || {};

  // Count active filters
  const activeFilterCount = useMemo(() => {
    if (!safeValues || typeof safeValues !== 'object') return 0;

    return Object.entries(safeValues).filter(([key, value]) => {
      if (value === null || value === undefined || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }).length;
  }, [safeValues]);

  // Handle filter change
  const handleFilterChange = useCallback((filterId: string, value: any) => {
    const newValues = { ...safeValues, [filterId]: value };
    onChange(newValues);
  }, [safeValues, onChange]);

  // Handle search
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    onSearchChange?.(value);
  }, [onSearchChange]);

  // Apply filters
  const handleApply = useCallback(() => {
    onApply?.(safeValues);
    setIsOpen(false);
    toast.success("Filters applied");
  }, [safeValues, onApply]);

  // Reset filters
  const handleReset = useCallback(() => {
    const resetValues: FilterValue = {};
    filters.forEach(filter => {
      resetValues[filter.id] = getDefaultValue(filter);
    });
    onChange(resetValues);
    onReset?.();
    toast.info("Filters reset");
  }, [filters, onChange, onReset]);

  // Save current filter
  const handleSaveFilter = useCallback(() => {
    if (!saveFilterName.trim()) {
      toast.error("Please enter a filter name");
      return;
    }
    onSaveFilter?.(saveFilterName, safeValues);
    setSaveFilterName("");
    setShowSaveDialog(false);
    toast.success(`Filter "${saveFilterName}" saved`);
  }, [saveFilterName, safeValues, onSaveFilter]);

  // Load saved filter
  const handleLoadFilter = useCallback((filter: SavedFilter) => {
    onChange(filter.values);
    onLoadFilter?.(filter);
    toast.success(`Filter "${filter.name}" loaded`);
  }, [onChange, onLoadFilter]);

  // Export filters
  const handleExportFilters = useCallback(() => {
    const data = {
      filters: savedFilters,
      current: safeValues,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `filters_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Filters exported");
  }, [savedFilters, safeValues]);

  // Import filters
  const handleImportFilters = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.current) {
          onChange(data.current);
        }
        toast.success("Filters imported");
      } catch (error) {
        toast.error("Invalid filter file");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }, [onChange]);

  // Render filter input based on type
  const renderFilterInput = (filter: FilterConfig) => {
    const value = safeValues[filter.id] ?? getDefaultValue(filter);

    switch (filter.type) {
      case "text":
        return (
          <Input
            placeholder={filter.placeholder || `Enter ${filter.label.toLowerCase()}`}
            value={value}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full"
          />
        );

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(val) => handleFilterChange(filter.id, val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">None</SelectItem>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multiselect":
        return (
          <div className="space-y-2">
            <ScrollArea className="h-32 w-full rounded-md border p-2">
              {filter.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`${filter.id}-${option.value}`}
                    checked={value?.includes(option.value) || false}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...(value || []), option.value]
                        : (value || []).filter((v: string) => v !== option.value);
                      handleFilterChange(filter.id, newValue);
                    }}
                  />
                  <Label
                    htmlFor={`${filter.id}-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </ScrollArea>
            {value?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {value.map((v: string) => {
                  const option = filter.options?.find(o => o.value === v);
                  return (
                    <Badge key={v} variant="secondary" className="text-xs">
                      {option?.label || v}
                      <button
                        onClick={() => {
                          handleFilterChange(
                            filter.id,
                            value.filter((val: string) => val !== v)
                          );
                        }}
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        );

      case "range":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{filter.min ?? 0}</span>
              <span className="font-medium">{value?.[0] ?? filter.min} - {value?.[1] ?? filter.max}</span>
              <span>{filter.max ?? 100}</span>
            </div>
            <Slider
              value={value || [filter.min ?? 0, filter.max ?? 100]}
              onValueChange={(val) => handleFilterChange(filter.id, val)}
              min={filter.min ?? 0}
              max={filter.max ?? 100}
              step={filter.step ?? 1}
              className="w-full"
            />
          </div>
        );

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => handleFilterChange(filter.id, date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case "daterange":
        return (
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !value?.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value?.from ? (
                    value.to ? (
                      <>
                        {format(new Date(value.from), "LLL dd, y")} -{" "}
                        {format(new Date(value.to), "LLL dd, y")}
                      </>
                    ) : (
                      format(new Date(value.from), "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: value?.from ? new Date(value.from) : undefined,
                    to: value?.to ? new Date(value.to) : undefined,
                  }}
                  onSelect={(range) => handleFilterChange(filter.id, {
                    from: range?.from?.toISOString(),
                    to: range?.to?.toISOString(),
                  })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case "boolean":
        return (
          <RadioGroup
            value={value?.toString() || "all"}
            onValueChange={(val) => handleFilterChange(filter.id, val === "all" ? null : val === "true")}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id={`${filter.id}-all`} />
                <Label htmlFor={`${filter.id}-all`} className="text-sm font-normal">
                  All
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id={`${filter.id}-true`} />
                <Label htmlFor={`${filter.id}-true`} className="text-sm font-normal">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id={`${filter.id}-false`} />
                <Label htmlFor={`${filter.id}-false`} className="text-sm font-normal">
                  No
                </Label>
              </div>
            </div>
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  // Get default value for filter type
  function getDefaultValue(filter: FilterConfig): any {
    switch (filter.type) {
      case "text":
      case "select":
      case "date":
        return "";
      case "multiselect":
        return [];
      case "range":
        return [filter.min ?? 0, filter.max ?? 100];
      case "daterange":
        return { from: null, to: null };
      case "boolean":
        return null;
      default:
        return null;
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 pr-4"
          />
        </div>
      )}

      {/* Filter Button and Dropdown */}
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <h3 className="font-semibold">Filters</h3>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-7 px-2"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            <ScrollArea className="h-[400px] p-4">
              <div className="space-y-4">
                {filters.map((filter) => (
                  <div key={filter.id} className="space-y-2">
                    <Label className="text-sm font-medium">{filter.label}</Label>
                    {renderFilterInput(filter)}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t space-y-2">
              {/* Saved Filters */}
              {savedFilters.length > 0 && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Saved Filters</Label>
                    <Select onValueChange={(id) => {
                      const filter = savedFilters.find(f => f.id === id);
                      if (filter) handleLoadFilter(filter);
                    }}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Load saved filter" />
                      </SelectTrigger>
                      <SelectContent>
                        {savedFilters.map((filter) => (
                          <SelectItem key={filter.id} value={filter.id}>
                            {filter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                </>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {onSaveFilter && (
                    <Popover open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64" align="start">
                        <div className="space-y-2">
                          <Label className="text-sm">Filter Name</Label>
                          <Input
                            placeholder="Enter filter name"
                            value={saveFilterName}
                            onChange={(e) => setSaveFilterName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveFilter();
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={handleSaveFilter}
                          >
                            Save Filter
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={handleExportFilters}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFilters}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="ghost" size="sm" className="h-8">
                      <Upload className="h-3 w-3 mr-1" />
                      Import
                    </Button>
                  </div>
                </div>
                <Button size="sm" onClick={handleApply}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-1">
            {Object.entries(safeValues).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null;

              const filter = filters.find(f => f.id === key);
              if (!filter) return null;

              let displayValue = value;
              if (filter.type === "select" || filter.type === "multiselect") {
                if (Array.isArray(value)) {
                  displayValue = value.map(v =>
                    filter.options?.find(o => o.value === v)?.label || v
                  ).join(", ");
                } else {
                  displayValue = filter.options?.find(o => o.value === value)?.label || value;
                }
              } else if (filter.type === "range") {
                displayValue = `${value[0]} - ${value[1]}`;
              } else if (filter.type === "daterange" && value.from) {
                displayValue = value.to
                  ? `${format(new Date(value.from), "MMM dd")} - ${format(new Date(value.to), "MMM dd")}`
                  : format(new Date(value.from), "MMM dd");
              }

              return (
                <Badge key={key} variant="secondary" className="text-xs">
                  {filter.label}: {displayValue?.toString()}
                  <button
                    onClick={() => handleFilterChange(key, getDefaultValue(filter))}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}