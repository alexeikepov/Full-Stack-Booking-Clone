import { Link } from "react-router-dom";

interface FooterColProps {
  title: string;
  items: string[];
}

export default function FooterCol({ title, items }: FooterColProps) {
  return (
    <div>
      <Link
        to="#"
        className="block text-[#0071c2] font-semibold hover:underline"
      >
        {title}
      </Link>
      <ul className="mt-2 space-y-1">
        {items.map((i) => (
          <li key={i}>
            <Link to="#" className="text-[#0071c2] hover:underline">
              {i}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
