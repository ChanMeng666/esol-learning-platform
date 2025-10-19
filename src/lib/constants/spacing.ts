/**
 * Spacing constants for consistent layout breathing room
 * Using an 8px base grid system
 */

export const SPACING = {
  // Base spacing units
  XS: '4px',
  SM: '8px',
  MD: '16px',
  LG: '24px',
  XL: '32px',
  XXL: '48px',

  // Specific use cases
  CARD_PADDING: 'p-6',
  CARD_HEADER_PADDING: 'pb-4',
  SECTION_GAP: 'gap-6',
  CONTAINER_PADDING: 'px-4 py-8 md:px-6 md:py-12',
  CARD_GAP: 'gap-6',
} as const;

/**
 * Animation constants for unified transitions
 */
export const ANIMATION = {
  // Transition durations
  FAST: '150ms',
  NORMAL: '300ms',
  SLOW: '500ms',

  // Easing functions
  EASE: 'ease',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',

  // Common transition configs
  TRANSITION_FAST: 'transition-all duration-150 ease-out',
  TRANSITION_NORMAL: 'transition-all duration-300 ease-out',
  HOVER_SCALE: 'hover:scale-[0.98] active:scale-[0.96]',
} as const;
