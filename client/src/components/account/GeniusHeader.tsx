interface GeniusHeaderProps {
  initials: string;
  geniusLevel: number;
}

export default function GeniusHeader({
  initials,
  geniusLevel,
}: GeniusHeaderProps) {
  return (
    <div className="w-full bg-[#003b95]">
      <div className="mx-auto max-w-[1128px] px-4 py-8 pb-16">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full p-[3px] bg-[#febb02]">
            <div
              className="grid h-full w-full place-items-center rounded-full text-white font-semibold text-2xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 45%, #cf5418 0 60%, #b84512 100%)",
              }}
            >
              {initials}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-2xl font-bold">Welcome</span>
            <span className="text-lg font-medium">
              <span className="text-white">Genius </span>
              <span className="text-[#febb02]">Level {geniusLevel}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
