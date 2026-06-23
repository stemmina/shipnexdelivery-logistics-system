"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

type ShipmentMapProps = {
  latitude: number
  longitude: number
  label?: string
}

export default function ShipmentMap({ latitude, longitude, label }: ShipmentMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    if (!mapRef.current) {
      const map = L.map(containerRef.current, {
        center: [latitude, longitude],
        zoom: 11,
        scrollWheelZoom: false,
        attributionControl: true,
      })

      // Esri World Imagery (satellite) — free, no API key required.
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 18,
          attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
        },
      ).addTo(map)

      // Labels overlay so cities/roads are readable on satellite imagery.
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 18 },
      ).addTo(map)

      const icon = L.divIcon({
        className: "",
        html: '<div class="courier-marker"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      })

      const marker = L.marker([latitude, longitude], { icon }).addTo(map)
      if (label) {
        marker.bindPopup(label)
      }

      mapRef.current = map
      markerRef.current = marker
    } else {
      mapRef.current.setView([latitude, longitude], mapRef.current.getZoom())
      markerRef.current?.setLatLng([latitude, longitude])
      if (label) markerRef.current?.bindPopup(label)
    }
  }, [latitude, longitude, label])

  useEffect(() => {
    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return <div ref={containerRef} className="h-full w-full" aria-label="Shipment location map" role="img" />
}
