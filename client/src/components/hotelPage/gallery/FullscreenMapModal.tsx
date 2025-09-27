import { useEffect, useRef } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Hotel } from "@/types/hotel";
import { loadGoogleMaps } from "@/lib/googleMapsLoader";

interface FullscreenMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel;
}

export default function FullscreenMapModal({
  isOpen,
  onClose,
  hotel,
}: FullscreenMapModalProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen || !mapRef.current) return;

    let map: google.maps.Map | null = null;
    let info: google.maps.InfoWindow | null = null;
    let clusterer: MarkerClusterer | null = null;
    let markers: google.maps.Marker[] = [];

    loadGoogleMaps().then(async () => {
      if (!mapRef.current) return;

      map = new google.maps.Map(mapRef.current, {
        center: {
          lat: hotel.location?.lat || 31.4118,
          lng: hotel.location?.lng || 35.0818,
        },
        zoom: 15,
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      info = new google.maps.InfoWindow();

      // Custom blue pin SVG (Booking-like)
      const svg = `<?xml version="1.0" encoding="UTF-8"?>
        <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#0b66e4"/>
              <stop offset="100%" stop-color="#0a5ad6"/>
            </linearGradient>
          </defs>
          <path d="M24 2c-8.284 0-15 6.716-15 15 0 11.25 15 28.5 15 28.5S39 28.25 39 17c0-8.284-6.716-15-15-15z" fill="url(#g)"/>
          <circle cx="24" cy="17" r="6.5" fill="#fff"/>
        </svg>`;
      const pinIconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
        svg
      )}`;

      // Add hotel marker
      const hotelLat = hotel.location?.lat || 31.4118;
      const hotelLng = hotel.location?.lng || 35.0818;

      if (hotelLat && hotelLng) {
        const marker = new google.maps.Marker({
          position: { lat: hotelLat, lng: hotelLng },
          title: hotel.name,
          icon: {
            url: pinIconUrl,
            scaledSize: new google.maps.Size(48, 48),
            anchor: new google.maps.Point(24, 48),
          },
        });

        marker.addListener("click", () => {
          const html = `
            <div style="max-width:300px">
              ${
                hotel.media?.[0]?.url
                  ? `<img src="${hotel.media[0].url}" alt="${hotel.name}" style="width:100%;height:150px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />`
                  : ""
              }
              <div style="font-weight:600;margin-bottom:4px;font-size:16px">${
                hotel.name
              }</div>
              ${
                hotel.averageRating
                  ? `<div style="margin-bottom:4px;color:#0a5ad6">Rating: ${hotel.averageRating.toFixed(
                      1
                    )}</div>`
                  : ""
              }
              ${
                hotel.address
                  ? `<div style="color:#555;margin-bottom:4px">${hotel.address}</div>`
                  : ""
              }
              ${hotel.city ? `<div style="color:#555">${hotel.city}</div>` : ""}
            </div>`;
          info!.setContent(html);
          info!.open({ anchor: marker, map: map! });
        });

        markers.push(marker);
        clusterer = new MarkerClusterer({ markers, map });
      }
    });

    return () => {
      clusterer?.clearMarkers();
      markers.forEach((m) => m.setMap(null));
      info?.close();
      map = null;
    };
  }, [isOpen, hotel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Map Location</h2>
              <p className="text-sm text-gray-600">{hotel.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div
            ref={mapRef}
            className="w-full h-full"
            style={{ minHeight: "500px" }}
          />
        </div>
      </div>
    </div>
  );
}
