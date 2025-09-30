import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Search, MapPin, Building } from "lucide-react";

interface SearchSuggestionsProps {
  query: string;
  onSelect: (value: string, type: 'city' | 'hotel', opts?: { id?: string }) => void;
  onClose: () => void;
  isOpen: boolean;
}

interface SuggestionItem {
  text: string;
  type: 'city' | 'hotel';
  count?: number;
  id?: string;
}

export default function SearchSuggestions({ 
  query, 
  onSelect, 
  onClose, 
  isOpen 
}: SearchSuggestionsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch city suggestions
  const { data: citySuggestions = [] } = useQuery({
    queryKey: ["city-suggestions", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const response = await api.get("/api/hotels/_meta/cities", {
        params: { q: query }
      });
      return response.data.map((item: any) => ({
        text: item.city,
        type: 'city' as const,
        count: item.count
      }));
    },
    enabled: isOpen && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch hotel suggestions (name contains query, independent from city)
  const { data: hotelSuggestions = [] } = useQuery({
    queryKey: ["hotel-suggestions", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const response = await api.get("/api/hotels/_meta/hotels", {
        params: { q: query }
      });
      return response.data.map((hotel: any) => ({
        text: hotel.name,
        type: 'hotel' as const,
        city: hotel.city,
        id: hotel.id
      }));
    },
    enabled: isOpen && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const suggestions: SuggestionItem[] = [
    ...citySuggestions,
    ...hotelSuggestions
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            const sel = suggestions[selectedIndex] as SuggestionItem;
            onSelect(sel.text, sel.type, { id: sel.id });
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, suggestions, selectedIndex, onSelect, onClose]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions.length]);

  if (!isOpen || !query || query.length < 2) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
    >
      {suggestions.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <Search className="w-6 h-6 mx-auto mb-2 text-gray-400" />
          <p>No suggestions found</p>
        </div>
      ) : (
        <div className="py-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.text}-${index}`}
              onClick={() => onSelect(suggestion.text, suggestion.type, { id: suggestion.id })}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
            >
              {suggestion.type === 'city' ? (
                <MapPin className="w-5 h-5 text-gray-400" />
              ) : (
                <Building className="w-5 h-5 text-gray-400" />
              )}
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {suggestion.text}
                </div>
                {suggestion.type === 'hotel' && (suggestion as any).city && (
                  <div className="text-sm text-gray-500">
                    {(suggestion as any).city}
                  </div>
                )}
                {suggestion.count && (
                  <div className="text-sm text-gray-500">
                    {suggestion.count} properties
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
