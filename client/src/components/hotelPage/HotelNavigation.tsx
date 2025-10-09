interface HotelNavigationProps {
  activeSection: string;
  onSectionClick: (section: string) => void;
}

const navItems = [
  { id: "overview", label: "Overview" },
  { id: "info", label: "Info & prices" },
  { id: "activity", label: "Activity" },
  { id: "facilities", label: "Facilities" },
  { id: "house-rules", label: "House rules" },
  { id: "fine-print", label: "The fine print" },
  { id: "reviews", label: "Guest reviews (372)" },
];

export default function HotelNavigation({
  activeSection,
  onSectionClick,
}: HotelNavigationProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="flex items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionClick(item.id)}
              className={`py-4 px-6 text-sm font-medium whitespace-nowrap transition-colors flex-1 ${
                activeSection === item.id
                  ? "border-b-2 border-blue-500 text-gray-900"
                  : "border-b border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
