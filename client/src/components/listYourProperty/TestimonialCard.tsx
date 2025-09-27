interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  imgSrc: string;
}

export default function TestimonialCard({
  quote,
  name,
  role,
  imgSrc,
}: TestimonialCardProps) {
  return (
    <div className="mb-6 break-inside-avoid rounded-lg border border-[#ffb700] bg-white p-6">
      <p className="mb-4 text-[16px] leading-7 text-[#595959]">"{quote}"</p>
      <div className="flex items-center gap-3">
        <img
          src={imgSrc}
          alt={name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="text-[14px]">
          <div className="font-bold text-[#262626]">{name}</div>
          <div className="text-[#595959]">{role}</div>
        </div>
      </div>
    </div>
  );
}
