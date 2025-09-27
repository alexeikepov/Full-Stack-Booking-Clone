import type { HTMLAttributes } from "react";

interface BluePillProps extends HTMLAttributes<HTMLDivElement> {}

export default function BluePill(props: BluePillProps) {
  return (
    <div
      {...props}
      className={
        "inline-flex items-center gap-1 rounded-[6px] border border-[#b9d2f5] bg-white px-2.5 py-[6px] text-[12px] font-medium text-[#0a5ad6] " +
        (props.className || "")
      }
    />
  );
}
