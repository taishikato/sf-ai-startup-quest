"use client"

import { useEffect, useRef } from "react"
import maplibregl, { type Map as MapLibreMap, type Marker } from "maplibre-gl"

import { getCompanyLogoUrl, getCompanyMonogram, type Company } from "@/lib/companies"

type MapShellProps = {
  companies: Company[]
  selectedCompany: Company
  onSelectCompany: (slug: string) => void
}

const SF_CENTER: [number, number] = [-122.4167, 37.7793]
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

function styleMarker(element: HTMLButtonElement, active: boolean, dense: boolean) {
  const size = dense ? (active ? 26 : 20) : active ? 30 : 24

  element.style.width = `${size}px`
  element.style.height = `${size}px`
  element.style.borderRadius = "0"
  element.style.border = active ? "2px solid #111111" : "2px solid #d4d4d8"
  element.style.background = active ? "#111111" : "#ffffff"
  element.style.display = "flex"
  element.style.alignItems = "center"
  element.style.justifyContent = "center"
  element.style.boxShadow = active
    ? "0 6px 14px rgba(0, 0, 0, 0.12)"
    : "0 4px 10px rgba(0, 0, 0, 0.08)"
}

function setMarkerContent(
  element: HTMLButtonElement,
  company: Company,
  active: boolean,
  dense: boolean
) {
  const monogram = getCompanyMonogram(company)
  const image = document.createElement("img")
  const iconSize = dense ? (active ? 14 : 11) : active ? 18 : 14

  image.src = getCompanyLogoUrl(company)
  image.alt = `${company.name} logo`
  image.width = iconSize
  image.height = iconSize
  image.style.width = `${iconSize}px`
  image.style.height = `${iconSize}px`
  image.style.objectFit = "contain"

  image.addEventListener("error", () => {
    element.replaceChildren()
    const fallback = document.createElement("span")
    fallback.textContent = monogram
    fallback.style.fontSize = dense ? (active ? "10px" : "9px") : active ? "11px" : "10px"
    fallback.style.fontWeight = "700"
    fallback.style.lineHeight = "1"
    fallback.style.color = active ? "#ffffff" : "#111111"
    element.appendChild(fallback)
  })

  element.replaceChildren(image)
}

export function MapShell({ companies, selectedCompany, onSelectCompany }: MapShellProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markersRef = useRef<Map<string, Marker>>(new Map())
  const hasInteractedRef = useRef(false)
  const dense = companies.length >= 60

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
      element.style.background = company.slug === selectedCompany.slug ? "#111111" : "#ffffff"
      element.style.outline = "none"
      styleMarker(element, company.slug === selectedCompany.slug, dense)
      setMarkerContent(element, company, company.slug === selectedCompany.slug, dense)
      element.addEventListener("click", () => onSelectCompany(company.slug))

      const marker = new maplibregl.Marker({ element, anchor: "center" })
        .setLngLat(company.coordinates)
        .addTo(map)

      markersRef.current.set(company.slug, marker)
    })
  }, [companies, dense, onSelectCompany, selectedCompany.slug])

  useEffect(() => {
    markersRef.current.forEach((marker, slug) => {
      const element = marker.getElement() as HTMLButtonElement
      const active = slug === selectedCompany.slug
      const company = companies.find((item) => item.slug === slug)

      element.style.zIndex = active ? "10" : "1"
      if (company) {
        styleMarker(element, active, dense)
        setMarkerContent(element, company, active, dense)
      }
    })
  }, [companies, dense, selectedCompany])

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
    <div className="relative h-full overflow-hidden border border-border bg-white lg:min-h-160">
      <div ref={containerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background/95 to-transparent" />
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
