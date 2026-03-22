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

export function MapShell({ companies, selectedCompany, onSelectCompany }: MapShellProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markersRef = useRef<Map<string, Marker>>(new Map())

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
    mapRef.current = map

    return () => {
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
      element.className = "group relative flex items-center justify-center"
      element.setAttribute("aria-label", company.name)
      element.innerHTML = `
        <span class="absolute inline-flex h-10 w-10 rounded-full bg-[rgba(255,255,255,0.6)] blur-[10px] transition-opacity duration-200 group-hover:opacity-100"></span>
        <span class="relative flex h-5 w-5 items-center justify-center rounded-full border border-white/85 bg-[#29374a] shadow-[0_10px_22px_-10px_rgba(41,55,74,0.8)] transition-transform duration-200 group-hover:scale-110">
          <span class="h-2.5 w-2.5 rounded-full bg-[#ff8f61]"></span>
        </span>
      `
      element.addEventListener("click", () => onSelectCompany(company.slug))

      const marker = new maplibregl.Marker({ element, anchor: "center" })
        .setLngLat(company.coordinates)
        .addTo(map)

      markersRef.current.set(company.slug, marker)
    })
  }, [companies, onSelectCompany])

  useEffect(() => {
    markersRef.current.forEach((marker, slug) => {
      const element = marker.getElement()
      const active = slug === selectedCompany.slug

      const target = element.querySelector("span:last-child")

      element.style.zIndex = active ? "10" : "1"

      if (target) {
        target.className = active
          ? "relative flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#ff8f61] shadow-[0_18px_36px_-16px_rgba(255,143,97,0.95)] transition-transform duration-200 group-hover:scale-110"
          : "relative flex h-5 w-5 items-center justify-center rounded-full border border-white/85 bg-[#29374a] shadow-[0_10px_22px_-10px_rgba(41,55,74,0.8)] transition-transform duration-200 group-hover:scale-110"

        const inner = target.querySelector("span")
        if (inner) {
          inner.className = active
            ? "h-3 w-3 rounded-full bg-white"
            : "h-2.5 w-2.5 rounded-full bg-[#ff8f61]"
        }
      }
    })
  }, [selectedCompany])

  useEffect(() => {
    const map = mapRef.current
    if (!map) {
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
    <div className="relative h-[34rem] overflow-hidden rounded-[34px] border border-[color:var(--line)] bg-[var(--map-shell)] shadow-[0_36px_80px_-48px_rgba(48,58,74,0.55)] lg:h-full">
      <div ref={containerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[rgba(252,249,243,0.92)] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[rgba(252,249,243,0.9)] to-transparent" />
      <div className="pointer-events-none absolute top-5 left-5 max-w-sm rounded-[26px] border border-white/70 bg-white/78 px-4 py-3 backdrop-blur">
        <div className="text-[11px] font-semibold tracking-[0.18em] text-[var(--muted-ink)] uppercase">
          What&apos;s happening in SF
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--ink)]">
          The map is intentionally edited for feel, not full coverage. Think of it as a
          walk through the current AI scene.
        </p>
      </div>
      <div className="pointer-events-none absolute right-5 bottom-5 rounded-full border border-white/70 bg-white/78 px-4 py-2 text-xs text-[var(--muted-ink)] backdrop-blur">
        Real map, softened. Pins stay the star.
      </div>
    </div>
  )
}
