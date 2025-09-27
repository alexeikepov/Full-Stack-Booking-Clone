import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, DollarSign } from "lucide-react";
import { searchHotelsByQuery } from "@/lib/api";

interface Hotel {
  _id: string;
  name: string;
  city: string;
  media?: string[];
  images?: string[];
  averageRating?: number;
  rating?: number;
  priceFrom?: number;
  price?: number;
}

interface HotelSelectorProps {
  onSelectHotel: (hotel: Hotel) => void;
  onClose: () => void;
}

export default function HotelSelector({ onSelectHotel, onClose }: HotelSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);

  const searchHotelsHandler = async (query: string) => {
    if (!query.trim()) {
      setHotels([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchHotelsByQuery(query);
      setHotels(results);
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to search hotels");
    } finally {
      setLoading(false);
    }
  };

  // Real-time search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchHotelsHandler(searchQuery);
      } else {
        setHotels([]);
      }
    }, 200); // Very fast response for better UX

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Select Hotel to Share
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search hotels by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Searching hotels...</p>
            </div>
          )}

          {!loading && hotels.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hotels found</h3>
              <p className="text-gray-600">Try searching with different keywords</p>
            </div>
          )}

          {!loading && hotels.length > 0 && (
            <div className="max-h-96 overflow-y-auto space-y-3">
              {hotels.map((hotel) => (
                <Card key={hotel._id} className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {(hotel.images && hotel.images.length > 0) || (hotel.media && hotel.media.length > 0) ? (
                          <img
                            src={(hotel.images && hotel.images[0]) || (hotel.media && hotel.media[0])}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <MapPin className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">{hotel.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {hotel.city}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {hotel.rating || hotel.averageRating || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${hotel.price || hotel.priceFrom || 0}/night
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800">
                            Available
                          </Badge>
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          onSelectHotel(hotel);
                          // Don't call onClose() here - let the parent handle it
                        }}
                        className="flex-shrink-0"
                      >
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
