interface FoodDrinkItem {
  name?: string;
  note?: string;
}

interface FoodDrinkSectionProps {
  facilities: (string | FoodDrinkItem)[];
  icon: React.ReactNode;
}

export default function FoodDrinkSection({
  facilities,
  icon,
}: FoodDrinkSectionProps) {
  if (!facilities || facilities.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-sm font-bold text-gray-900">Food & Drink</h3>
      </div>
      <div className="space-y-2">
        {facilities.map((facility: string | FoodDrinkItem, index: number) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
              <span className="text-sm text-gray-900">
                {typeof facility === "string" ? facility : facility.name}
              </span>
            </div>
            {typeof facility === "object" && facility.note && (
              <span className="text-xs text-gray-500">{facility.note}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
