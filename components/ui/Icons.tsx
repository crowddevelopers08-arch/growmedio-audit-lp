import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

/**
 * Stroked icons share the same geometry as the original page (Feather-style,
 * 24x24 viewBox). Size and colour always come from the caller's Tailwind
 * classes so each section stays self-describing.
 */
function Stroke({
  className = "",
  strokeWidth = 2,
  children,
  ...rest
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Stroke>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Stroke>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Stroke>
  );
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Stroke>
  );
}

export function LayoutIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </Stroke>
  );
}

export function TrendingDownIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </Stroke>
  );
}

export function TrendingUpIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </Stroke>
  );
}

export function XIcon(props: IconProps) {
  return (
    <Stroke strokeWidth={2.4} {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Stroke>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <Stroke strokeWidth={2.4} {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
    </Stroke>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Stroke strokeWidth={2.4} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </Stroke>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </Stroke>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="11" cy="11" r="7.5" />
      <line x1="21" y1="21" x2="16.2" y2="16.2" />
    </Stroke>
  );
}

export function PackageIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </Stroke>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <polyline points="6 9 12 15 18 9" />
    </Stroke>
  );
}

export function PlayIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function StarIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
