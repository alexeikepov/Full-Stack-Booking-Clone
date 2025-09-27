import type { Hotel } from "@/types/hotel";

interface FacilitySectionProps {
  title: string;
  facilities: string[];
  icon: React.ReactNode;
}

export default function FacilitySection({
  title,
  facilities,
  icon,
}: FacilitySectionProps) {
  if (!facilities || facilities.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-2">
        {facilities.map((facility: string, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <svg
              className="w-3 h-3 text-green-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm text-gray-900">{facility}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
