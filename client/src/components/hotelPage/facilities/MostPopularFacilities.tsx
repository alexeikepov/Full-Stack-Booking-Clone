interface MostPopularFacilitiesProps {
  facilities: (string | { name: string })[];
}

export default function MostPopularFacilities({
  facilities,
}: MostPopularFacilitiesProps) {
  if (!facilities || facilities.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-gray-900 mb-4">
        Most popular facilities
      </h3>
      <div className="space-y-2">
        {facilities.map(
          (facility: string | { name: string }, index: number) => {
            const facilityName =
              typeof facility === "string" ? facility : facility.name;

            return (
              <div
                key={index}
                className="flex items-center gap-3 text-sm text-gray-900"
              >
                <svg
                  className="w-4 h-4 text-black"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{facilityName}</span>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
