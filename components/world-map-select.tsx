"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import type { CityId } from "@/lib/city-config"

type WorldStageCity = {
  id: CityId
  href: string
  stage: string
  code: string
  name: string
  region: string
  tagline: string
  lat: number
  lon: number
  accent: string
  signDx?: number
  signDy?: number
}

type WorldFeatureCollection = {
  type: "FeatureCollection"
  features: WorldFeature[]
}

type WorldFeature = {
  type: "Feature"
  properties: {
    name?: string
    continent?: string
  }
  geometry: {
    type: "Polygon" | "MultiPolygon"
    coordinates: PolygonCoordinates | MultiPolygonCoordinates
  }
}

type Position = [number, number]
type PolygonCoordinates = Position[][]
type MultiPolygonCoordinates = Position[][][]
type TerrainPatchType = "desert" | "forest" | "tundra" | "dry"

type TerrainPatch = {
  id: string
  type: TerrainPatchType
  lon: number
  lat: number
  rx: number
  ry: number
  rotate?: number
}

type MapEllipse = {
  id: string
  lon: number
  lat: number
  rx: number
  ry: number
  rotate?: number
}

type UrbanCluster = {
  id: string
  lon: number
  lat: number
  color?: string
}

const WORLD_STAGE_CITIES: WorldStageCity[] = [
  {
    id: "sf",
    href: "/sf",
    stage: "Stage 01",
    code: "SF",
    name: "San Francisco",
    region: "United States",
    tagline: "Founders, labs, frontier models",
    lat: 37.7749,
    lon: -122.4194,
    accent: "#ff6b6b",
    signDx: -24,
    signDy: 12,
  },
  {
    id: "vancouver",
    href: "/vancouver",
    stage: "Stage 02",
    code: "VAN",
    name: "Vancouver",
    region: "Canada",
    tagline: "Robotics, climate, applied AI",
    lat: 49.2827,
    lon: -123.1207,
    accent: "#4ecdc4",
    signDx: -8,
    signDy: -10,
  },
  {
    id: "toronto",
    href: "/toronto",
    stage: "Stage 03",
    code: "TO",
    name: "Toronto",
    region: "Canada",
    tagline: "Research depth, enterprise AI",
    lat: 43.6532,
    lon: -79.3832,
    accent: "#ffe66d",
    signDx: -15,
    signDy: -4,
  },
  {
    id: "ny",
    href: "/ny",
    stage: "Stage 04",
    code: "NY",
    name: "New York",
    region: "United States",
    tagline: "Media, finance, creative tools",
    lat: 40.7128,
    lon: -74.006,
    accent: "#7bd88f",
    signDx: 18,
    signDy: 4,
  },
  {
    id: "london",
    href: "/london",
    stage: "Stage 05",
    code: "LDN",
    name: "London",
    region: "United Kingdom",
    tagline: "Agents, voice, regulated markets",
    lat: 51.5074,
    lon: -0.1278,
    accent: "#a78bfa",
  },
  {
    id: "tokyo",
    href: "/tokyo",
    stage: "Stage 06",
    code: "TKY",
    name: "Tokyo",
    region: "Japan",
    tagline: "Research, hardware, consumer AI",
    lat: 35.6762,
    lon: 139.6503,
    accent: "#f472b6",
  },
]

const WORLD_MAP_WIDTH = 1200
const WORLD_MAP_HEIGHT = 600

const CONTINENT_COLORS: Record<string, string> = {
  "North America": "#36d63f",
  "South America": "#3bd34a",
  Europe: "#49d94f",
  Africa: "#43cf3d",
  Asia: "#36d63f",
  Oceania: "#56d957",
  Antarctica: "#f8faf7",
}

const TERRAIN_PATCHES: TerrainPatch[] = [
  { id: "sahara", type: "desert", lon: 15, lat: 22, rx: 96, ry: 34 },
  { id: "arabia", type: "desert", lon: 45, lat: 23, rx: 45, ry: 24, rotate: -8 },
  { id: "gobi", type: "dry", lon: 103, lat: 43, rx: 52, ry: 18, rotate: -8 },
  { id: "australia-outback", type: "desert", lon: 134, lat: -25, rx: 64, ry: 30 },
  { id: "us-southwest", type: "dry", lon: -111, lat: 35, rx: 32, ry: 18 },
  { id: "amazon", type: "forest", lon: -62, lat: -6, rx: 62, ry: 38, rotate: -14 },
  { id: "congo", type: "forest", lon: 22, lat: -2, rx: 42, ry: 28 },
  { id: "boreal-canada", type: "tundra", lon: -104, lat: 58, rx: 82, ry: 17 },
  { id: "siberia", type: "tundra", lon: 95, lat: 60, rx: 120, ry: 20 },
  { id: "southeast-asia", type: "forest", lon: 104, lat: 14, rx: 36, ry: 20, rotate: 10 },
]

const LAKE_MARKERS: MapEllipse[] = [
  { id: "great-lakes", lon: -84, lat: 45, rx: 22, ry: 8, rotate: -8 },
  { id: "victoria", lon: 33, lat: -1, rx: 13, ry: 8 },
  { id: "baikal", lon: 108, lat: 53, rx: 5, ry: 16, rotate: -25 },
  { id: "caspian", lon: 51, lat: 41, rx: 11, ry: 21, rotate: -8 },
]

const MOUNTAIN_RANGES: { id: string; points: Position[] }[] = [
  {
    id: "rockies",
    points: [
      [-128, 54],
      [-120, 47],
      [-112, 40],
      [-106, 32],
    ],
  },
  {
    id: "andes",
    points: [
      [-79, 10],
      [-76, -6],
      [-72, -18],
      [-70, -32],
      [-70, -46],
    ],
  },
  {
    id: "himalayas",
    points: [
      [68, 34],
      [80, 31],
      [92, 29],
    ],
  },
  {
    id: "alps",
    points: [
      [5, 46],
      [11, 47],
      [16, 46],
    ],
  },
]

const URBAN_CLUSTERS: UrbanCluster[] = [
  { id: "western-us", lon: -122, lat: 37, color: "#ffd15c" },
  { id: "eastern-us", lon: -74, lat: 41, color: "#ffd15c" },
  { id: "western-europe", lon: 2, lat: 49, color: "#f8e27a" },
  { id: "uk", lon: -1, lat: 52, color: "#f8e27a" },
  { id: "japan", lon: 139, lat: 36, color: "#ffd15c" },
  { id: "east-china", lon: 121, lat: 31, color: "#eecb5c" },
  { id: "india", lon: 77, lat: 23, color: "#eecb5c" },
]

export function WorldMapSelect() {
  const [activeCityId, setActiveCityId] = useState<CityId>("sf")
  const activeCity = useMemo(
    () =>
      WORLD_STAGE_CITIES.find((city) => city.id === activeCityId) ??
      WORLD_STAGE_CITIES[0],
    [activeCityId]
  )

  return (
    <main className="relative h-dvh overflow-hidden bg-[#1439b8] text-[#1a1a2e]">
      <WorldMapCanvas
        cities={WORLD_STAGE_CITIES}
        activeCity={activeCity}
        onActiveCityChange={setActiveCityId}
      />

      <header className="pointer-events-none absolute top-0 right-0 left-0 z-30 flex items-start gap-3 p-4 sm:p-6">
        <Link
          href="/"
          className="pointer-events-auto flex min-w-0 items-center gap-3 border-2 border-[#1a1a2e] bg-white px-3 py-2 shadow-[4px_4px_0_#1a1a2e]"
          aria-label="AI Startup Quest home"
        >
          <Image
            src="/brand-mark.svg"
            alt=""
            width={30}
            height={30}
            className="shrink-0"
            priority
          />
          <span className="hidden truncate font-(family-name:--font-pixel) text-[11px] leading-5 text-[#1a1a2e] sm:block">
            AI Startup Quest
          </span>
        </Link>
      </header>

      <div className="pointer-events-none absolute right-4 bottom-4 z-30 max-w-[min(360px,calc(100vw-32px))] border-2 border-[#1a1a2e] bg-white px-4 py-3 shadow-[4px_4px_0_#4ecdc4] sm:right-6 sm:bottom-6">
        <div className="font-(family-name:--font-pixel) text-[13px] leading-5 text-[#1a1a2e]">
          {activeCity.name}
        </div>
        <div className="mt-1 truncate text-xs text-[#1a1a2e]/65">
          {activeCity.region} / {activeCity.tagline}
        </div>
      </div>
    </main>
  )
}

function WorldMapCanvas({
  cities,
  activeCity,
  onActiveCityChange,
}: {
  cities: WorldStageCity[]
  activeCity: WorldStageCity
  onActiveCityChange: (city: CityId) => void
}) {
  const [worldData, setWorldData] = useState<WorldFeatureCollection | null>(
    null
  )

  useEffect(() => {
    let cancelled = false

    fetch("/world-countries.geojson")
      .then((response) => response.json() as Promise<WorldFeatureCollection>)
      .then((data) => {
        if (!cancelled) {
          setWorldData(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWorldData({ type: "FeatureCollection", features: [] })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const countryPaths = useMemo(() => {
    return (
      worldData?.features.map((feature, index) => ({
        id: `${feature.properties.name ?? "country"}-${index}`,
        d: geometryToPath(feature.geometry),
        fill:
          feature.properties.continent === "Antarctica"
            ? CONTINENT_COLORS.Antarctica
            : "url(#grass-dither)",
      })) ?? []
    )
  }, [worldData])

  return (
    <div className="absolute inset-0">
      <div className="relative h-full w-full overflow-hidden bg-[#173bbb]">
        <svg
          viewBox={`0 0 ${WORLD_MAP_WIDTH} ${WORLD_MAP_HEIGHT}`}
          role="img"
          aria-label="World map with selectable startup city stages"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="ocean-bits"
              width="18"
              height="18"
              patternUnits="userSpaceOnUse"
            >
              <rect width="18" height="18" fill="#173bbb" />
              <rect x="2" y="3" width="4" height="4" fill="#2454d5" />
              <rect x="12" y="10" width="3" height="3" fill="#0f2e9d" />
              <rect x="8" y="15" width="5" height="2" fill="#2b66ee" />
            </pattern>
            <pattern
              id="ocean-wave-bits"
              width="72"
              height="36"
              patternUnits="userSpaceOnUse"
            >
              <g>
                <rect x="4" y="8" width="7" height="3" fill="#4c82ff" />
                <rect x="18" y="12" width="5" height="3" fill="#2f64e8" />
                <rect x="37" y="6" width="8" height="3" fill="#6ca0ff" />
                <rect x="57" y="15" width="6" height="3" fill="#1e49c7" />
                <rect x="10" y="27" width="8" height="3" fill="#2b66ee" />
                <rect x="31" y="24" width="5" height="3" fill="#7fb0ff" />
                <rect x="51" y="29" width="9" height="3" fill="#2454d5" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0 0; 18 0; 0 0"
                  dur="7s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>
            <pattern
              id="grass-dither"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <rect width="10" height="10" fill="#36d63f" />
              <rect x="0" y="0" width="4" height="2" fill="#82f06c" />
              <rect x="6" y="6" width="4" height="2" fill="#238c24" />
            </pattern>
            <pattern
              id="desert-dither"
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <rect width="12" height="12" fill="#f0cf76" />
              <rect x="2" y="2" width="3" height="3" fill="#ffd98a" />
              <rect x="8" y="7" width="3" height="2" fill="#c99a3f" />
            </pattern>
            <pattern
              id="forest-dither"
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <rect width="12" height="12" fill="#1f9a32" />
              <rect x="1" y="2" width="4" height="4" fill="#42c84a" />
              <rect x="7" y="7" width="3" height="3" fill="#126820" />
            </pattern>
            <pattern
              id="tundra-dither"
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <rect width="12" height="12" fill="#a5db87" />
              <rect x="1" y="2" width="4" height="2" fill="#d8f0c8" />
              <rect x="8" y="8" width="3" height="2" fill="#7db76a" />
            </pattern>
            <pattern
              id="dry-dither"
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <rect width="12" height="12" fill="#c8b65a" />
              <rect x="2" y="3" width="4" height="2" fill="#e1d06c" />
              <rect x="8" y="8" width="3" height="2" fill="#8a7f36" />
            </pattern>
            <pattern
              id="lake-bits"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <rect width="8" height="8" fill="#144bd3" />
              <rect x="1" y="2" width="4" height="2" fill="#4b8dff" />
              <rect x="5" y="6" width="2" height="1" fill="#0d318f" />
            </pattern>
            <clipPath id="land-clip">
              {countryPaths.map((country) => (
                <path key={`${country.id}-clip`} d={country.d} />
              ))}
            </clipPath>
          </defs>
          <rect
            width={WORLD_MAP_WIDTH}
            height={WORLD_MAP_HEIGHT}
            fill="#173bbb"
          />
          <rect
            width={WORLD_MAP_WIDTH}
            height={WORLD_MAP_HEIGHT}
            fill="url(#ocean-bits)"
            opacity="1"
          />
          <rect
            width={WORLD_MAP_WIDTH}
            height={WORLD_MAP_HEIGHT}
            fill="url(#ocean-wave-bits)"
            opacity="0.46"
          />
          <g>
            {countryPaths.map((country) => (
              <path key={country.id} d={country.d} fill={country.fill} />
            ))}
          </g>
          <g clipPath="url(#land-clip)">
            {TERRAIN_PATCHES.map((patch) => {
              const position = projectLonLat(patch.lon, patch.lat)
              return (
                <ellipse
                  key={patch.id}
                  cx={position.x}
                  cy={position.y}
                  rx={patch.rx}
                  ry={patch.ry}
                  fill={`url(#${patch.type}-dither)`}
                  opacity="0.78"
                  transform={`rotate(${patch.rotate ?? 0} ${position.x} ${
                    position.y
                  })`}
                />
              )
            })}
            {MOUNTAIN_RANGES.map((range) => {
              return (
                <g key={range.id} opacity="0.88">
                  {range.points.map(([lon, lat], index) => {
                    const position = projectLonLat(lon, lat)
                    return (
                      <MountainGlyph
                        key={`${range.id}-${index}`}
                        x={position.x}
                        y={position.y}
                      />
                    )
                  })}
                </g>
              )
            })}
            {LAKE_MARKERS.map((lake) => {
              const position = projectLonLat(lake.lon, lake.lat)
              return (
                <ellipse
                  key={lake.id}
                  cx={position.x}
                  cy={position.y}
                  rx={lake.rx}
                  ry={lake.ry}
                  fill="url(#lake-bits)"
                  stroke="#164018"
                  strokeWidth="2"
                  opacity="0.92"
                  transform={`rotate(${lake.rotate ?? 0} ${position.x} ${
                    position.y
                  })`}
                />
              )
            })}
            {URBAN_CLUSTERS.map((cluster) => {
              const position = projectLonLat(cluster.lon, cluster.lat)
              return (
                <g key={cluster.id} transform={`translate(${position.x} ${position.y})`}>
                  <rect x="-4" y="-4" width="3" height="3" fill="#3b2f1a" />
                  <rect x="1" y="-5" width="3" height="3" fill={cluster.color} />
                  <rect x="-1" y="0" width="3" height="3" fill="#f8f0a0" />
                  <rect x="5" y="2" width="3" height="3" fill="#3b2f1a" />
                </g>
              )
            })}
          </g>
          <g opacity="0.32">
            {countryPaths.map((country) => (
              <path
                key={`${country.id}-shade`}
                d={country.d}
                fill="none"
                stroke="#8af36f"
                strokeWidth="1.1"
              />
            ))}
          </g>
          <g
            fill="none"
            stroke="#164018"
            strokeLinejoin="miter"
            strokeWidth="2.2"
          >
            {countryPaths.map((country) => (
              <path key={`${country.id}-border`} d={country.d} />
            ))}
          </g>
          {cities.map((city) => {
            const isActive = city.id === activeCity.id
            const position = projectLonLat(city.lon, city.lat)
            return (
              <a
                key={city.id}
                href={city.href}
                onMouseEnter={() => onActiveCityChange(city.id)}
                onFocus={() => onActiveCityChange(city.id)}
                aria-label={`Open ${city.name} AI Startup Map`}
                className="focus:outline-none"
              >
                <g
                  transform={`translate(${position.x.toFixed(1)} ${position.y.toFixed(1)}) scale(${
                    isActive ? 1.14 : 1
                  })`}
                >
                  <WoodSignMarker
                    code={city.code}
                    signDx={city.signDx ?? 0}
                    signDy={city.signDy ?? 0}
                  />
                </g>
              </a>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

function WoodSignMarker({
  code,
  signDx,
  signDy,
}: {
  code: string
  signDx: number
  signDy: number
}) {
  const labelWidth = code.length > 2 ? 48 : 40

  return (
    <>
      <line
        x1="0"
        y1="0"
        x2={signDx}
        y2={signDy + 2}
        stroke="#1a1a2e"
        strokeWidth="2"
        opacity="0.7"
      />
      <image
        href="/map-assets/city-sign-marker.png"
        x={signDx - 31}
        y={signDy - 47}
        width="62"
        height="62"
        preserveAspectRatio="xMidYMid meet"
      />
      <rect
        x={signDx - labelWidth / 2}
        y={signDy - 25}
        width={labelWidth}
        height="14"
        fill="rgba(60, 31, 18, 0.54)"
        stroke="#1a1a2e"
        strokeWidth="0.8"
        opacity="0.64"
      />
      <text
        x={signDx}
        y={signDy - 15}
        textAnchor="middle"
        fill="#fff4ce"
        fontSize="9.5"
        stroke="#1a1a2e"
        strokeWidth="0.5"
        paintOrder="stroke"
        style={{ fontFamily: "var(--font-pixel)" }}
      >
        {code}
      </text>
    </>
  )
}

function MountainGlyph({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M 0 -8 L 9 7 H -9 Z"
        fill="#7a5a35"
        stroke="#164018"
        strokeLinejoin="miter"
        strokeWidth="1.8"
      />
      <path d="M 0 -6 L 4 2 H -2 Z" fill="#d8c7a2" opacity="0.9" />
      <rect x="-3" y="5" width="6" height="2" fill="#4b3522" opacity="0.8" />
    </g>
  )
}

function geometryToPath(geometry: WorldFeature["geometry"]) {
  if (geometry.type === "Polygon") {
    return polygonToPath(geometry.coordinates as PolygonCoordinates)
  }

  return (geometry.coordinates as MultiPolygonCoordinates)
    .map((polygon) => polygonToPath(polygon))
    .join(" ")
}

function polygonToPath(polygon: PolygonCoordinates) {
  return polygon
    .map((ring) => {
      const commands = ring.map(([lon, lat], index) => {
        const { x, y } = projectLonLat(lon, lat)
        return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`
      })

      return `${commands.join(" ")} Z`
    })
    .join(" ")
}

function projectLonLat(lon: number, lat: number) {
  return {
    x: ((lon + 180) / 360) * WORLD_MAP_WIDTH,
    y: ((90 - lat) / 180) * WORLD_MAP_HEIGHT,
  }
}
