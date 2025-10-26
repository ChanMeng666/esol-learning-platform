"use client";

import { Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { setPreference } from "@/lib/layout-preferences";
import {
  SIDEBAR_VARIANT_OPTIONS,
  SIDEBAR_VARIANT_VALUES,
  SIDEBAR_COLLAPSIBLE_OPTIONS,
  SIDEBAR_COLLAPSIBLE_VALUES,
  CONTENT_LAYOUT_OPTIONS,
  CONTENT_LAYOUT_VALUES,
  NAVBAR_STYLE_OPTIONS,
  NAVBAR_STYLE_VALUES,
  type SidebarVariant,
  type SidebarCollapsible,
  type ContentLayout,
  type NavbarStyle,
} from "@/types/preferences/layout";

interface LayoutControlsProps {
  variant: SidebarVariant;
  collapsible: SidebarCollapsible;
  contentLayout: ContentLayout;
  navbarStyle: NavbarStyle;
}

/**
 * Layout controls for runtime preference switching
 */
export function LayoutControls({
  variant,
  collapsible,
  contentLayout,
  navbarStyle,
}: LayoutControlsProps) {
  const router = useRouter();

  const handlePreferenceChange = async (
    key: string,
    value: string,
    allowed: readonly string[]
  ) => {
    await setPreference(key, value, allowed as readonly string[]);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Layout settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Sidebar Variant */}
        <DropdownMenuLabel>Sidebar Style</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={variant}
          onValueChange={(value) =>
            handlePreferenceChange("sidebar_variant", value, SIDEBAR_VARIANT_VALUES)
          }
        >
          {SIDEBAR_VARIANT_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        {/* Sidebar Collapsible */}
        <DropdownMenuLabel>Sidebar Collapse</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={collapsible}
          onValueChange={(value) =>
            handlePreferenceChange("sidebar_collapsible", value, SIDEBAR_COLLAPSIBLE_VALUES)
          }
        >
          {SIDEBAR_COLLAPSIBLE_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        {/* Content Layout */}
        <DropdownMenuLabel>Content Layout</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={contentLayout}
          onValueChange={(value) =>
            handlePreferenceChange("content_layout", value, CONTENT_LAYOUT_VALUES)
          }
        >
          {CONTENT_LAYOUT_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        {/* Navbar Style */}
        <DropdownMenuLabel>Navbar Style</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={navbarStyle}
          onValueChange={(value) =>
            handlePreferenceChange("navbar_style", value, NAVBAR_STYLE_VALUES)
          }
        >
          {NAVBAR_STYLE_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}