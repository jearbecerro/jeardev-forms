import { FieldWidth } from "../types";

// Returns Tailwind class (for 24/12/8/6) and style for everything else
export function getWidthClassAndStyle(width: FieldWidth = 24): { className: string; style: React.CSSProperties } {
  if (width === 24) return { className: "basis-full", style: {} };
  if (width === 12) return { className: "basis-1/2", style: {} };
  if (width === 8)  return { className: "basis-1/3", style: {} };
  if (width === 6)  return { className: "basis-1/4", style: {} };
  return {
    className: "",
    style: { flexBasis: `${(width / 24) * 100}%` }
  };
}
