import * as React from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only"
          {...props}
        />
        <div
          className={`
            h-4 w-4 shrink-0 rounded-sm border border-gray-300 
            flex items-center justify-center
            ${checked ? "bg-blue-600 border-blue-600" : "bg-white"}
            ${
              props.disabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }
            hover:border-gray-400 transition-colors
            ${className || ""}
          `}
          onClick={() => {
            if (!props.disabled && onCheckedChange) {
              onCheckedChange(!checked);
            }
          }}
        >
          {checked && <Check className="h-3 w-3 text-white" />}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
