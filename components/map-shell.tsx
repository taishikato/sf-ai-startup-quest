"use client"

import { useEffect, useRef } from "react"
import maplibregl, { type Map as MapLibreMap, type Marker } from "maplibre-gl"

import type { Company } from "@/lib/companies"

type MapShellProps = {
  companies: Company[]
  selectedCompany: Company
  onSelectCompany: (slug: string) => void
}

const SF_CENTER: [number, number] = [-122.4167, 37.7793]
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

function styleMarker(element: HTMLButtonElement, active: boolean) {
  element.style.width = active ? "20px" : "16px"
  element.style.height = active ? "20px" : "16px"
  element.style.borderRadius = "0"
  element.style.border = active ? "2px solid #111111" : "2px solid #d4d4d8"
  element.style.background = active ? "#111111" : "#ffffff"
  element.style.boxShadow = active
    ? "0 6px 14px rgba(0, 0, 0, 0.12)"
    : "0 4px 10px rgba(0, 0, 0, 0.08)"
}

export function MapShell({ companies, selectedCompany, onSelectCompany }: MapShellProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markersRef = useRef<Map<string, Marker>>(new Map())
  const hasInteractedRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return
    }

    const markers = markersRef.current
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: SF_CENTER,
      zoom: 12.15,
      minZoom: 11.1,
      maxZoom: 15.8,
      attributionControl: false,
    })

    map.dragRotate.disable()
    map.touchZoomRotate.disableRotation()
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right")
    map.on("load", () => {
      map.resize()
    })
    mapRef.current = map

    const resizeObserver = new ResizeObserver(() => {
      map.resize()
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      markers.forEach((marker) => marker.remove())
      markers.clear()
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) {
      return
    }

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current.clear()

    companies.forEach((company) => {
      const element = document.createElement("button")
      element.type = "button"
      element.setAttribute("aria-label", company.name)
      element.style.cursor = "pointer"
      element.style.padding = "0"
      element.style.background = "transparent"
      element.style.outline = "none"
      styleMarker(element, company.slug === selectedCompany.slug)
      element.addEventListener("click", () => onSelectCompany(company.slug))

      const marker = new maplibregl.Marker({ element, anchor: "center" })
        .setLngLat(company.coordinates)
        .addTo(map)

      markersRef.current.set(company.slug, marker)
    })
  }, [companies, onSelectCompany, selectedCompany.slug])

  useEffect(() => {
    markersRef.current.forEach((marker, slug) => {
      const element = marker.getElement() as HTMLButtonElement
      const active = slug === selectedCompany.slug

      element.style.zIndex = active ? "10" : "1"
      styleMarker(element, active)
    })
  }, [selectedCompany])

  useEffect(() => {
    const map = mapRef.current
    if (!map) {
      return
    }

    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true
      return
    }

    map.flyTo({
      center: selectedCompany.coordinates,
      zoom: 13.35,
      speed: 0.65,
      curve: 1.2,
      essential: true,
    })
  }, [selectedCompany])

  return (
    <div className="relative h-[34rem] overflow-hidden border border-border bg-white lg:h-[calc(100vh-2rem)] lg:min-h-[40rem] lg:max-h-[48rem]">
      <div ref={containerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/95 to-transparent" />
      <div className="pointer-events-none absolute top-4 left-4 max-w-sm border border-border bg-background px-4 py-3">
        <div className="text-[11px] font-semibold uppercase text-muted-foreground">
          SF AI startup map
        </div>
        <p className="mt-1 text-sm leading-6 text-foreground">
          Curated for clarity, not full coverage. Use the filters to focus the map fast.
        </p>
      </div>
      <div className="pointer-events-none absolute right-4 bottom-4 border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground">
        Selected: {selectedCompany.name}
      </div>
      <style jsx global>{`
        .maplibregl-ctrl-group {
          border-radius: 0 !important;
          box-shadow: none !important;
        }

        .maplibregl-ctrl-group button {
          border-radius: 0 !important;
        }
      `}</style>
    </div>
  )
}
