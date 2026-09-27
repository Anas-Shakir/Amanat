"use client";

import { useEffect, useRef, useState } from "react";
import { 
  DADU_MERCHANT_STORES, 
  DADU_RELIEF_ZONES, 
  DADU_DISTRICT_CENTER, 
  KiryanaStoreLocation, 
  ReliefZone 
} from "./dadu-map-data";
import { MapInspectorCard } from "./map-inspector-card";
import { MapStatsHud } from "./map-stats-hud";
import { formatCurrencyPKR } from "@/lib/utils";
import { Maximize2, LocateFixed, RefreshCw } from "lucide-react";

interface DaduAidMapProps {
  height?: string;
  initialSelectedStoreId?: string;
  interactive?: boolean;
}

export default function DaduAidMap({
  height = "600px",
  initialSelectedStoreId,
  interactive = true,
}: DaduAidMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{ markers: any[]; polygons: any[] }>({ markers: [], polygons: [] });

  const [selectedStore, setSelectedStore] = useState<KiryanaStoreLocation | null>(null);
  const [selectedZone, setSelectedZone] = useState<ReliefZone | null>(null);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "MERCHANTS" | "EMERGENCY" | "COMMUNITY">("ALL");
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize Map with Leaflet
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      
      const L = await import("leaflet");

      // Check if map already initialized on this container
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: DADU_DISTRICT_CENTER,
        zoom: 10,
        minZoom: 8,
        maxZoom: 16,
        zoomControl: false,
      });

      mapInstanceRef.current = map;

      // Add standard OpenStreetMap Tile Layer (styled dark via CSS filter in globals.css)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ["a", "b", "c"],
        maxZoom: 19,
      }).addTo(map);

      // Add Zoom Control at bottom right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Render Layers
      renderMapLayers(L, map, activeFilter);

      if (isMounted) {
        setIsLoaded(true);

        // Pre-select if ID provided
        if (initialSelectedStoreId) {
          const matched = DADU_MERCHANT_STORES.find(s => s.id === initialSelectedStoreId);
          if (matched) {
            setSelectedStore(matched);
            map.flyTo([matched.lat, matched.lng], 13, { duration: 1.5 });
          }
        }
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update layers when filter changes
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === "undefined") return;

    import("leaflet").then((L) => {
      renderMapLayers(L, mapInstanceRef.current, activeFilter);
    });
  }, [activeFilter]);

  const renderMapLayers = (L: any, map: any, filter: string) => {
    // Clean existing layers
    layersRef.current.markers.forEach((m) => map.removeLayer(m));
    layersRef.current.polygons.forEach((p) => map.removeLayer(p));
    layersRef.current = { markers: [], polygons: [] };

    // 1. Render Polygons for Relief Zones
    if (filter === "ALL" || filter === "EMERGENCY" || filter === "COMMUNITY") {
      DADU_RELIEF_ZONES.forEach((zone) => {
        if (filter === "EMERGENCY" && zone.type !== "EMERGENCY_FLOOD") return;
        if (filter === "COMMUNITY" && zone.type !== "COMMUNITY_ZAKAT") return;

        const polygon = L.polygon(zone.polygon, {
          color: zone.color,
          weight: 2,
          opacity: 0.8,
          fillColor: zone.color,
          fillOpacity: 0.15,
          dashArray: zone.type === "EMERGENCY_FLOOD" ? "4, 6" : undefined,
        }).addTo(map);

        polygon.on("click", () => {
          setSelectedStore(null);
          setSelectedZone(zone);
          map.flyTo(zone.center, 11, { duration: 1 });
        });

        polygon.bindTooltip(`
          <div class="px-2 py-1 text-xs">
            <strong style="color: ${zone.color}">${zone.name}</strong><br/>
            <span>Pool: ${formatCurrencyPKR(zone.activePoolAmount)} • ${zone.verifiedHouseholds} Families</span>
          </div>
        `, { sticky: true, className: "bg-slate-950 text-white border border-slate-800 rounded-lg" });

        layersRef.current.polygons.push(polygon);
      });
    }

    // 2. Render Kiryana Merchant Markers
    if (filter === "ALL" || filter === "MERCHANTS") {
      DADU_MERCHANT_STORES.forEach((store) => {
        const customIcon = L.divIcon({
          className: "custom-pin",
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-8 h-8 rounded-full bg-[#f58549]/20 border-2 border-[#f58549] flex items-center justify-center marker-radar-terracotta cursor-pointer shadow-md shadow-[#f58549]/30">
                <svg class="w-4 h-4 text-[#772f1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div class="absolute -bottom-6 whitespace-nowrap bg-white border border-[#eadecd] text-[10px] font-bold text-[#772f1a] px-1.5 py-0.5 rounded shadow-xs pointer-events-none">
                ${store.name.split(" ")[0]}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([store.lat, store.lng], { icon: customIcon }).addTo(map);

        marker.on("click", () => {
          setSelectedZone(null);
          setSelectedStore(store);
          map.flyTo([store.lat, store.lng], 13, { duration: 1.2 });
        });

        layersRef.current.markers.push(marker);
      });
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(DADU_DISTRICT_CENTER, 10, { duration: 1.2 });
      setSelectedStore(null);
      setSelectedZone(null);
    }
  };

  const totalVolume = DADU_MERCHANT_STORES.reduce((sum, s) => sum + s.totalFulfilledPKR, 0);
  const totalHouseholds = DADU_MERCHANT_STORES.reduce((sum, s) => sum + s.householdsServed, 0);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#eadecd] bg-white shadow-md" style={{ height }}>
      {/* Floating Stats & Filters */}
      <MapStatsHud
        activeStoreCount={DADU_MERCHANT_STORES.length}
        totalVolumePKR={totalVolume}
        totalHouseholds={totalHouseholds}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Detail Inspector Card */}
      <MapInspectorCard
        selectedStore={selectedStore}
        selectedZone={selectedZone}
        onClose={() => {
          setSelectedStore(null);
          setSelectedZone(null);
        }}
      />

      {/* Reset & Navigation Controls */}
      <div className="absolute bottom-4 left-4 z-[500] flex items-center gap-2">
        <button
          onClick={handleResetView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f5f0e8] border border-[#eadecd] text-xs font-bold text-[#772f1a] shadow-md transition-all"
          title="Reset Map to Dadu Center"
        >
          <LocateFixed className="w-3.5 h-3.5 text-[#f58549]" />
          <span>Reset Center (Dadu Hub)</span>
        </button>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
