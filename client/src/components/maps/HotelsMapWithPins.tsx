import { useEffect, useRef, useState } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useSearchParams } from "react-router-dom";
import { loadGoogleMaps } from "@/lib/googleMapsLoader";

type HotelPin = { id:string; name:string; lat:number; lng:number; address?:string; city?:string; rating?:number; imageUrl?:string };

function coerceNumber(v: any): number {
  const n = Number(v);
  if (Number.isFinite(n)) return n;
  if (v && typeof v === "object") {
    if (typeof v.$numberDouble === "string") return Number(v.$numberDouble);
    if (typeof v.$numberInt === "string") return Number(v.$numberInt);
    if (typeof v.$numberDecimal === "string") return Number(v.$numberDecimal);
    if (typeof v.value === "string" || typeof v.value === "number") return Number(v.value);
  }
  return NaN;
}

export default function HotelsMapWithPins({ hotels: externalHotels }: { hotels?: any[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hotels, setHotels] = useState<HotelPin[]>([]);
  const [params] = useSearchParams();

  useEffect(() => {
    if (externalHotels && Array.isArray(externalHotels)) {
      const mapped: HotelPin[] = externalHotels.map((h: any) => {
        const id = String((h as any)._id?.$oid || h.id || h._id || "");
        const name = h.name;
        const address = [h.address, h.city].filter(Boolean).join(", ");
        const city = h.city;
        const rating = coerceNumber(h.averageRating ?? 0) || 0;
        const imageUrl = (h.media?.find((m: any) => m?.url)?.url) || h.media?.[0]?.url;
        let lat = coerceNumber(h.location?.lat ?? h.lat ?? h.latitude ?? 0);
        let lng = coerceNumber(h.location?.lng ?? h.lng ?? h.longitude ?? 0);
        const coords = (h.location?.coordinates || h.coords || h.location?.geo || []) as any;
        if (!lat && !lng && Array.isArray(coords) && coords.length >= 2) {
          const cLng = coerceNumber(coords[0]);
          const cLat = coerceNumber(coords[1]);
          if (Number.isFinite(cLat) && Number.isFinite(cLng)) { lat = cLat; lng = cLng; }
        }
        return { id, name, lat, lng, address, city, rating, imageUrl } as HotelPin;
      });
      setHotels(mapped.filter(h => Number.isFinite(h.lat) && Number.isFinite(h.lng)));
      return;
    }
    const sp = new URLSearchParams();
    const city = params.get("city");
    const from = params.get("from");
    const to = params.get("to");
    const adults = params.get("adults");
    const children = params.get("children");
    const rooms = params.get("rooms");
    if (city) sp.set("city", city);
    if (from) sp.set("from", from);
    if (to) sp.set("to", to);
    if (adults) sp.set("adults", adults);
    if (children) sp.set("children", children);
    if (rooms) sp.set("rooms", rooms);
    if (!sp.has("limit")) sp.set("limit", "1000");
    const url = `/api/hotels?${sp.toString()}`;
    fetch(url)
      .then(r => r.json())
      .then((items) => {
        const arr = Array.isArray(items) ? items : (items?.items || []);
        const mapped: HotelPin[] = arr.map((h: any) => {
          const id = String((h as any)._id?.$oid || h.id || h._id || "");
          const name = h.name;
          const address = [h.address, h.city].filter(Boolean).join(", ");
          const city = h.city;
          const rating = coerceNumber(h.averageRating ?? 0) || 0;
          const imageUrl = (h.media?.find((m: any) => m?.url)?.url) || h.media?.[0]?.url;
          // Try multiple coordinate shapes
          let lat = coerceNumber(h.location?.lat ?? h.lat ?? h.latitude ?? 0);
          let lng = coerceNumber(h.location?.lng ?? h.lng ?? h.longitude ?? 0);
          const coords = (h.location?.coordinates || h.coords || h.location?.geo || []) as any;
          if (!lat && !lng && Array.isArray(coords) && coords.length >= 2) {
            // GeoJSON [lng, lat]
            const cLng = coerceNumber(coords[0]);
            const cLat = coerceNumber(coords[1]);
            if (Number.isFinite(cLat) && Number.isFinite(cLng)) {
              lat = cLat; lng = cLng;
            }
          }
          return { id, name, lat, lng, address, city, rating, imageUrl } as HotelPin;
        });
        setHotels(mapped.filter(h => Number.isFinite(h.lat) && Number.isFinite(h.lng)));
      })
      .catch(() => setHotels([]));
  }, [params, externalHotels]);

  useEffect(() => {
    let map: google.maps.Map | null = null;
    let info: google.maps.InfoWindow | null = null;
    let clusterer: MarkerClusterer | null = null;
    let markers: google.maps.Marker[] = [];

    loadGoogleMaps().then(async () => {
      if (!ref.current) return;
      map = new google.maps.Map(ref.current, {
        center: { lat: 31.4118, lng: 35.0818 },
        zoom: 7,
        streetViewControl: false,
        mapTypeControl: false,
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
      const pinIconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

      if (!hotels.length) return;

      const bounds = new google.maps.LatLngBounds();
      const geocoder = new google.maps.Geocoder();

      // Helper to create one marker
      const addMarker = (h: HotelPin, pos: google.maps.LatLngLiteral) => {
        const m = new google.maps.Marker({
          position: pos,
          title: h.name,
          icon: {
            url: pinIconUrl,
            scaledSize: new google.maps.Size(36, 36),
            anchor: new google.maps.Point(18, 36),
          },
        });
        m.addListener("click", () => {
          const html = `
            <div style="max-width:240px">
              ${h.imageUrl ? `<img src="${h.imageUrl}" alt="${h.name}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />` : ""}
              <div style="font-weight:600;margin-bottom:4px">${h.name}</div>
              ${h.rating ? `<div style=\"margin-bottom:4px\">Rating: ${h.rating.toFixed(1)}</div>` : ""}
              ${h.address ? `<div style=\"color:#555\">${h.address}</div>` : ""}
              <div style="margin-top:6px"><a href="/hotel/${h.id}" style="color:#0a5ad6;text-decoration:underline">Open</a></div>
            </div>`;
          info!.setContent(html);
          info!.open({ anchor: m, map: map! });
        });
        markers.push(m);
        bounds.extend(pos as google.maps.LatLngLiteral);
      };

      // Plot with coordinates / geocode when missing (limit to 50 geocodes)
      let geocodeCount = 0;
      for (const h of hotels) {
        if (Number.isFinite(h.lat) && Number.isFinite(h.lng) && (h.lat !== 0 || h.lng !== 0)) {
          addMarker(h, { lat: h.lat, lng: h.lng });
          continue;
        }
        if (geocodeCount >= 50) continue;
        const query = [h.address, h.city, h.name].filter(Boolean).join(", ");
        if (!query) continue;
        try {
          const { results } = await geocoder.geocode({ address: query });
          const loc = results?.[0]?.geometry?.location;
          if (loc) {
            addMarker(h, { lat: loc.lat(), lng: loc.lng() });
            geocodeCount++;
          }
        } catch {}
      }

      if (markers.length) {
        clusterer = new MarkerClusterer({ markers, map });
        markers.length > 1 ? map.fitBounds(bounds, 40) : map.setCenter(markers[0].getPosition() as google.maps.LatLng);
        if (markers.length === 1) map.setZoom(14);
      }
    });

    return () => {
      clusterer?.clearMarkers();
      markers.forEach(m => m.setMap(null));
      info?.close();
      map = null;
    };
  }, [hotels]);

  return <div ref={ref} style={{ width: "100%", height: "100%", borderRadius: 12, overflow: "hidden" }} />;
}
