import type { HTMLAttributes } from "react";

interface TagPlainProps extends HTMLAttributes<HTMLDivElement> {}

export default function TagPlain(props: TagPlainProps) {
  return (
    <div
      {...props}
      className={
        "inline-flex items-center gap-1 px-0 py-[6px] text-[12px] font-medium text-[#6b7280] " +
        (props.className || "")
      }
    />
  );
}
