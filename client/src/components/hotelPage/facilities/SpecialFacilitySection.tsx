interface SpecialFacilitySectionProps {
  title: string;
  content: string;
  icon: React.ReactNode;
}

export default function SpecialFacilitySection({
  title,
  content,
  icon,
}: SpecialFacilitySectionProps) {
  if (!content || content.trim() === "") {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">{content}</p>
      </div>
    </div>
  );
}
