import type { StarsProps } from "../types";

export default function Stars({ count = 0 }: StarsProps) {
  if (!count) return null;
  return (
    <span className="text-[#febb02] text-[12px] leading-none">
      {"★".repeat(count)}
      {"☆".repeat(Math.max(0, 5 - count))}
    </span>
  );
}
