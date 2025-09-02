import { Button } from "@/components/ui/button";

export function Counter({
  label,
  value,
  set,
  min = 0,
  max = 30,
}: {
  label: string;
  value: number;
  set: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="font-medium text-black dark:text-white">{label}</div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          disabled={value <= min}
          onClick={() => set(Math.max(min, value - 1))}
        >
          −
        </Button>
        <div className="w-8 text-center">{value}</div>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          disabled={value >= max}
          onClick={() => set(Math.min(max, value + 1))}
        >
          +
        </Button>
      </div>
    </div>
  );
}
