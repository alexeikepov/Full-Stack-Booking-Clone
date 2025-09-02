import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const [city, setCity] = useState(params.get("city") || "");
  const [from, setFrom] = useState(params.get("from") || "");
  const [to, setTo] = useState(params.get("to") || "");
  const [adults, setAdults] = useState(Number(params.get("adults") || 1));

  useEffect(() => {
    setCity(params.get("city") || "");
    setFrom(params.get("from") || "");
    setTo(params.get("to") || "");
    setAdults(Number(params.get("adults") || 1));
  }, [params]);

  const submit = () => {
    const next = new URLSearchParams({
      city,
      from,
      to,
      adults: String(adults),
    });
    setParams(next);
    navigate(`/search?${next.toString()}`);
  };

  return (
    <div className="grid gap-2 rounded-2xl border p-3 sm:grid-cols-2 md:grid-cols-5">
      <Input
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <Input
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />
      <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      <Input
        type="number"
        min={1}
        value={adults}
        onChange={(e) => setAdults(Number(e.target.value))}
      />
      <Button onClick={submit}>Search</Button>
    </div>
  );
}
