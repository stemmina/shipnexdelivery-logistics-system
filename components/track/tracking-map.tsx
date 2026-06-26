"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface TrackingMapProps {
  latitude: number
  longitude: number
}

export function TrackingMap({ latitude, longitude }: TrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([latitude, longitude], 12)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current)
    }

    // Update map center and marker
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([latitude, longitude], 12)

      // Remove existing markers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current?.removeLayer(layer)
        }
      })

      // Add courier marker with pulsing animation
      const marker = L.marker([latitude, longitude], {
        icon: L.divIcon({
          className: "courier-marker",
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
      }).addTo(mapInstanceRef.current)

      marker.bindPopup(`Shipment is here<br/>Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`)
    }
  }, [latitude, longitude])

  return <div ref={mapRef} className="h-full w-full" />
}
