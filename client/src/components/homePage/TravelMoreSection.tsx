// src/components/TravelMoreSection.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Feature = {
  title: string;
  subtitle: string;
  img: string; // картинка
  imgAlt: string;
};

const FEATURES: Feature[] = [
  {
    title: "Book now, pay at the property",
    subtitle: "FREE cancellation on most rooms",
    img: "https://t-cf.bstatic.com/design-assets/assets/v3.160.0/illustrations-traveller/FreeCancellation.png",
    imgAlt: "Checklist illustration",
  },
  {
    title: "2+ million properties worldwide",
    subtitle: "Hotels, guest houses, apartments, and more...",
    img: "https://t-cf.bstatic.com/design-assets/assets/v3.160.0/illustrations-traveller/TripsGlobe.png",
    imgAlt: "Globe illustration",
  },
  {
    title: "Trusted customer service you can rely on, 24/7",
    subtitle: "We're always here to help",
    img: "https://t-cf.bstatic.com/design-assets/assets/v3.160.0/illustrations-traveller/CustomerSupport.png",
    imgAlt: "Customer support illustration",
  },
];

export default function TravelMoreSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {FEATURES.map((f) => (
          <Card key={f.title} className="rounded-sm border p-5.5">
            <div className="flex items-start gap-4">
              <div className="flex h-15 w-15 items-center justify-center rounded-xl ">
                <img
                  src={f.img}
                  alt={f.imgAlt}
                  className="h-25 w-25 object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <div className="text-base font-bold leading-snug">
                  {f.title}
                </div>
                <div className="mt-1 text-sm">{f.subtitle}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="mt-12 text-[26px] font-bold">Travel more, spend less</h2>

      <Card className="mt-4 rounded-sm border md:p-4">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_150px]">
          <div>
            <h3 className="text-lg font-bold">Sign in, save money</h3>
            <p className="mt-1 text-sm">
              Save 10% or more at participating properties – just look for the
              blue Genius label
            </p>

            <div className="mt-3 flex items-center gap-2">
              <Button
                asChild
                className="h-9 px-4 rounded-sm bg-[#006ce4] hover:bg-[#0057c2] text-white text-sm font-medium shadow-sm
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003580] focus-visible:ring-offset-2"
              >
                <Link to="/signin">Sign in</Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="h-9 px-4 rounded-sm text-[#006ce4] text-sm font-medium
               hover:bg-[#e7f0ff] active:bg-[#d6e4ff]
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003580]"
              >
                <Link to="/register">Register</Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto h-25 w-50">
            <img
              src="https://t-cf.bstatic.com/design-assets/assets/v3.160.0/illustrations-traveller/GeniusGenericGiftBox.png"
              alt="Genius gift"
              className="h-25 w-60 object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </Card>
    </section>
  );
}
