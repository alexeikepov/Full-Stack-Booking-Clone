import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;

      const halfWindowHeight = windowHeight / 2;

      setScrollTop(currentScrollTop);
      setIsVisible(currentScrollTop > halfWindowHeight);
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const shouldShow = (isVisible || isHovered) && scrollTop > 100;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[9999] transition-all duration-300 ease-in-out",
        shouldShow ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        onClick={scrollToTop}
        size="icon"
        className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Scroll to top"
        disabled={!shouldShow}
      >
        <ChevronUp className="h-6 w-6" />
      </Button>
    </div>
  );
}
