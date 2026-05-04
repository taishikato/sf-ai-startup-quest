"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import Image from "next/image"
import Link from "next/link"
import * as THREE from "three"

import type { CityId } from "@/lib/city-config"
import { cn } from "@/lib/utils"

type StageCity = {
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
}

type PinPosition = {
  x: number
  y: number
  visible: boolean
  scale: number
}

const STAGE_CITIES: StageCity[] = [
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

const INITIAL_PIN_POSITIONS = Object.fromEntries(
  STAGE_CITIES.map((city) => [
    city.id,
    { x: 50, y: 50, visible: false, scale: 0.9 },
  ])
) as Record<CityId, PinPosition>

export function CityStageSelect() {
  const [activeCityId, setActiveCityId] = useState<CityId>("sf")
  const activeCity = useMemo(
    () =>
      STAGE_CITIES.find((city) => city.id === activeCityId) ?? STAGE_CITIES[0],
    [activeCityId]
  )

  return (
    <main className="grid h-dvh overflow-hidden bg-[#f8faf7] text-[#1a1a2e]">
      <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)]">
        <header className="border-b-3 border-[#1a1a2e] bg-white px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-3"
              aria-label="AI Startup Quest home"
            >
              <Image
                src="/brand-mark.svg"
                alt=""
                width={34}
                height={34}
                className="shrink-0"
                priority
              />
              <span className="truncate font-(family-name:--font-pixel) text-[11px] leading-5 text-[#1a1a2e] sm:text-sm">
                AI Startup Quest
              </span>
            </Link>
            <Link
              href="/map"
              className="border-2 border-[#1a1a2e] bg-[#ffe66d] px-3 py-2 font-(family-name:--font-pixel) text-[8px] shadow-[3px_3px_0_#1a1a2e] transition-colors hover:bg-[#fff4a8] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#4ecdc4] sm:text-[9px]"
            >
              2D Map
            </Link>
          </div>
        </header>

        <section className="mx-auto grid min-h-0 w-full max-w-7xl grid-rows-[minmax(0,1fr)_minmax(185px,0.68fr)] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:grid-rows-1 lg:gap-6 lg:py-6">
          <div className="relative min-h-0 overflow-hidden border-3 border-[#1a1a2e] bg-[#050817] shadow-[6px_6px_0_#1a1a2e]">
            <div className="absolute top-4 left-4 z-20 border-2 border-[#1a1a2e] bg-[#ffe66d] px-3 py-2 font-(family-name:--font-pixel) text-[8px] text-[#1a1a2e] shadow-[3px_3px_0_#ff6b6b]">
              Pixel Globe
            </div>
            <div className="absolute right-4 bottom-4 z-20 hidden border-2 border-[#1a1a2e] bg-white px-3 py-2 shadow-[3px_3px_0_#4ecdc4] sm:block">
              <div className="font-(family-name:--font-pixel) text-[8px] text-[#ff6b6b]">
                {activeCity.stage}
              </div>
              <div className="mt-1 font-(family-name:--font-pixel) text-[11px] text-[#1a1a2e]">
                {activeCity.name}
              </div>
            </div>

            <ThreeGlobe
              cities={STAGE_CITIES}
              activeCity={activeCity}
              onActiveCityChange={setActiveCityId}
            />
          </div>

          <aside className="flex min-h-0 flex-col border-3 border-[#1a1a2e] bg-white text-[#1a1a2e] shadow-[6px_6px_0_#4ecdc4]">
            <div className="shrink-0 border-b-2 border-[#1a1a2e] px-4 py-4">
              <p className="font-(family-name:--font-pixel) text-[8px] text-[#0f8f87]">
                Select Stage
              </p>
              <h1 className="mt-3 font-(family-name:--font-pixel) text-base leading-7 text-[#1a1a2e] sm:text-lg">
                City Startup Map
              </h1>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <div className="grid gap-3">
                {STAGE_CITIES.map((city) => {
                  const isActive = city.id === activeCity.id
                  return (
                    <Link
                      key={city.id}
                      href={city.href}
                      onMouseEnter={() => setActiveCityId(city.id)}
                      onFocus={() => setActiveCityId(city.id)}
                      className={cn(
                        "grid grid-cols-[64px_minmax(0,1fr)] gap-3 border-2 p-3 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-[#4ecdc4]",
                        isActive
                          ? "border-[#1a1a2e] bg-[#fff4a8] shadow-[4px_4px_0_#1a1a2e]"
                          : "border-[#1a1a2e] bg-[#f8faf7] hover:bg-[#e9fbf8]"
                      )}
                      aria-label={`Open ${city.name} AI Startup Map`}
                    >
                      <div
                        className="grid h-12 place-items-center border-2 border-[#1a1a2e] font-(family-name:--font-pixel) text-[10px] text-[#1a1a2e] shadow-[3px_3px_0_#0f1022]"
                        style={{ backgroundColor: city.accent }}
                      >
                        {city.code}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-(family-name:--font-pixel) text-[7px] text-[#4ecdc4]">
                            {city.stage}
                          </span>
                          <span className="font-(family-name:--font-pixel) text-[6px] text-[#1a1a2e]/50">
                            Ready
                          </span>
                        </div>
                        <h2 className="mt-2 truncate font-(family-name:--font-pixel) text-[10px] text-[#1a1a2e]">
                          {city.name}
                        </h2>
                        <p className="mt-1 truncate text-xs text-[#1a1a2e]/65">
                          {city.region} / {city.tagline}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}

function ThreeGlobe({
  cities,
  activeCity,
  onActiveCityChange,
}: {
  cities: StageCity[]
  activeCity: StageCity
  onActiveCityChange: (city: CityId) => void
}) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const pinMeshesRef = useRef(new Map<CityId, THREE.Mesh>())
  const targetRotationRef = useRef<THREE.Vector2 | null>(null)
  const [pinPositions, setPinPositions] = useState(INITIAL_PIN_POSITIONS)

  useEffect(() => {
    const mount = mountRef.current

    if (!mount) {
      return
    }

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x050817, 7, 13)

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    camera.position.set(0, 0.06, 7.5)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x050817, 1)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.display = "block"
    renderer.domElement.style.height = "100%"
    renderer.domElement.style.width = "100%"
    mount.appendChild(renderer.domElement)

    const globe = new THREE.Group()
    globe.rotation.y = 1.35
    globe.rotation.x = -0.1
    scene.add(globe)

    const earthTexture = createPixelEarthTexture()
    earthTexture.colorSpace = THREE.SRGBColorSpace
    earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    earthTexture.magFilter = THREE.NearestFilter
    earthTexture.minFilter = THREE.NearestFilter

    const cloudTexture = createPixelCloudTexture()
    cloudTexture.colorSpace = THREE.SRGBColorSpace
    cloudTexture.magFilter = THREE.NearestFilter
    cloudTexture.minFilter = THREE.NearestFilter

    const starTexture = createStarTexture()

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1.84, 96, 64),
      new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 0.78,
        metalness: 0,
      })
    )
    globe.add(earth)

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.89, 96, 64),
      new THREE.MeshStandardMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.4,
        roughness: 1,
        depthWrite: false,
      })
    )
    globe.add(clouds)

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.98, 96, 64),
      new THREE.MeshBasicMaterial({
        color: 0x4ecdc4,
        transparent: true,
        opacity: 0.22,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      })
    )
    scene.add(atmosphere)

    const cityPinGeometry = new THREE.BoxGeometry(0.075, 0.075, 0.075)
    const pinMeshes = pinMeshesRef.current
    pinMeshes.clear()
    cities.forEach((city) => {
      const pin = new THREE.Mesh(
        cityPinGeometry,
        new THREE.MeshBasicMaterial({ color: new THREE.Color(city.accent) })
      )
      pin.position.copy(latLonToVector3(city.lat, city.lon, 1.96))
      globe.add(pin)
      pinMeshes.set(city.id, pin)
    })

    const stars = new THREE.Points(
      createStarFieldGeometry(),
      new THREE.PointsMaterial({
        map: starTexture,
        color: 0xffffff,
        transparent: true,
        opacity: 0.74,
        size: 0.085,
        sizeAttenuation: true,
        depthWrite: false,
      })
    )
    scene.add(stars)

    scene.add(new THREE.AmbientLight(0xffffff, 1.9))

    const sun = new THREE.DirectionalLight(0xfff0a8, 2.8)
    sun.position.set(-3.2, 2.6, 4.8)
    scene.add(sun)

    const rim = new THREE.DirectionalLight(0xff6b6b, 1.7)
    rim.position.set(3.2, 1.4, -3.2)
    scene.add(rim)

    const targetRotation = new THREE.Vector2(globe.rotation.x, globe.rotation.y)
    targetRotationRef.current = targetRotation
    const pointerState = {
      dragging: false,
      x: 0,
      y: 0,
      baseX: 0,
      baseY: 0,
    }

    const resize = () => {
      const rect = mount.getBoundingClientRect()
      const width = Math.max(rect.width, 1)
      const height = Math.max(rect.height, 1)
      renderer.setSize(width, height, true)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const onPointerDown = (event: PointerEvent) => {
      pointerState.dragging = true
      pointerState.x = event.clientX
      pointerState.y = event.clientY
      pointerState.baseX = targetRotation.x
      pointerState.baseY = targetRotation.y
      mount.setPointerCapture(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerState.dragging) {
        return
      }

      targetRotation.y =
        pointerState.baseY + (event.clientX - pointerState.x) * 0.007
      targetRotation.x = THREE.MathUtils.clamp(
        pointerState.baseX + (event.clientY - pointerState.y) * 0.005,
        -0.75,
        0.75
      )
    }

    const onPointerUp = (event: PointerEvent) => {
      pointerState.dragging = false
      if (mount.hasPointerCapture(event.pointerId)) {
        mount.releasePointerCapture(event.pointerId)
      }
    }

    mount.addEventListener("pointerdown", onPointerDown)
    mount.addEventListener("pointermove", onPointerMove)
    mount.addEventListener("pointerup", onPointerUp)
    mount.addEventListener("pointercancel", onPointerUp)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    resize()

    let frame = 0
    let animationId = 0
    const cameraPosition = new THREE.Vector3()

    const tick = () => {
      animationId = window.requestAnimationFrame(tick)

      if (!pointerState.dragging) {
        targetRotation.y += 0.0008
      }

      globe.rotation.x = THREE.MathUtils.lerp(
        globe.rotation.x,
        targetRotation.x,
        0.06
      )
      globe.rotation.y = THREE.MathUtils.lerp(
        globe.rotation.y,
        targetRotation.y,
        0.06
      )
      clouds.rotation.y += 0.0007
      stars.rotation.y -= 0.00012

      renderer.render(scene, camera)

      frame += 1
      if (frame % 2 === 0) {
        camera.getWorldPosition(cameraPosition)
        setPinPositions(projectCityPins(cities, pinMeshes, camera, mount))
      }
    }

    tick()

    return () => {
      window.cancelAnimationFrame(animationId)
      resizeObserver.disconnect()
      mount.removeEventListener("pointerdown", onPointerDown)
      mount.removeEventListener("pointermove", onPointerMove)
      mount.removeEventListener("pointerup", onPointerUp)
      mount.removeEventListener("pointercancel", onPointerUp)
      mount.removeChild(renderer.domElement)
      pinMeshes.clear()

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose()
          disposeMaterial(object.material)
        }
      })
      targetRotationRef.current = null
      earthTexture.dispose()
      cloudTexture.dispose()
      starTexture.dispose()
      renderer.dispose()
    }
  }, [cities])

  useEffect(() => {
    const targetRotation = targetRotationRef.current

    if (!targetRotation) {
      return
    }

    const localPosition = latLonToVector3(activeCity.lat, activeCity.lon, 1)
    targetRotation.x = THREE.MathUtils.clamp(
      THREE.MathUtils.degToRad(-activeCity.lat * 0.42),
      -0.62,
      0.62
    )
    targetRotation.y = Math.atan2(-localPosition.x, localPosition.z)
  }, [activeCity.lat, activeCity.lon])

  useEffect(() => {
    const pinMeshes = pinMeshesRef.current
    cities.forEach((city) => {
      const pin = pinMeshes.get(city.id)
      const material = pin?.material

      if (!pin || !(material instanceof THREE.MeshBasicMaterial)) {
        return
      }

      const isActive = city.id === activeCity.id
      pin.scale.setScalar(isActive ? 1.9 : 1)
      material.color.set(city.accent)
    })
  }, [activeCity.id, cities])

  const handlePinFocus = useCallback(
    (city: StageCity) => {
      onActiveCityChange(city.id)
    },
    [onActiveCityChange]
  )

  return (
    <div className="absolute inset-0">
      <div
        ref={mountRef}
        className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0">
        {cities.map((city) => {
          const position =
            pinPositions[city.id] ?? INITIAL_PIN_POSITIONS[city.id]
          const isActive = city.id === activeCity.id
          return (
            <Link
              key={city.id}
              href={city.href}
              onMouseEnter={() => handlePinFocus(city)}
              onFocus={() => handlePinFocus(city)}
              className={cn(
                "pointer-events-auto absolute z-20 -translate-x-1/2 -translate-y-1/2 border-2 border-[#1a1a2e] px-2 py-1 font-(family-name:--font-pixel) text-[8px] text-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e] transition-[opacity,transform] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#4ecdc4]",
                isActive ? "bg-[#ffe66d]" : "bg-white"
              )}
              style={
                {
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  opacity: position.visible ? 1 : 0,
                  transform: `translate(-50%, -50%) scale(${
                    isActive ? 1.16 : position.scale
                  })`,
                } as CSSProperties
              }
              aria-label={`Open ${city.name} AI Startup Map`}
              tabIndex={position.visible ? 0 : -1}
            >
              {city.code}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function projectCityPins(
  cities: StageCity[],
  pinMeshes: Map<CityId, THREE.Mesh>,
  camera: THREE.PerspectiveCamera,
  mount: HTMLDivElement
) {
  const next = { ...INITIAL_PIN_POSITIONS }
  const rect = mount.getBoundingClientRect()
  const worldPosition = new THREE.Vector3()
  const cameraPosition = new THREE.Vector3()
  const normal = new THREE.Vector3()

  camera.getWorldPosition(cameraPosition)

  cities.forEach((city) => {
    const pin = pinMeshes.get(city.id)

    if (!pin) {
      return
    }

    pin.getWorldPosition(worldPosition)
    normal.copy(worldPosition).normalize()
    const isFacingCamera =
      normal.dot(cameraPosition.clone().sub(worldPosition).normalize()) > 0.04
    const projected = worldPosition.clone().project(camera)

    next[city.id] = {
      x: ((projected.x + 1) / 2) * 100,
      y: ((-projected.y + 1) / 2) * 100,
      visible:
        isFacingCamera && projected.z < 1 && rect.width > 0 && rect.height > 0,
      scale: THREE.MathUtils.clamp(1.08 - projected.z * 0.24, 0.82, 1.1),
    }
  })

  return next
}

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lon + 180)

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

function createPixelEarthTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 512
  const context = canvas.getContext("2d")!

  context.imageSmoothingEnabled = false
  context.fillStyle = "#1d65c1"
  context.fillRect(0, 0, canvas.width, canvas.height)

  for (let y = 0; y < canvas.height; y += 8) {
    context.fillStyle = y % 16 === 0 ? "#2d8ee8" : "#164aa0"
    context.fillRect(0, y, canvas.width, 3)
  }

  drawPixelLand(context, "#49c96f", [
    [-168, 68],
    [-136, 72],
    [-106, 58],
    [-92, 42],
    [-76, 25],
    [-92, 14],
    [-118, 29],
    [-128, 48],
    [-158, 56],
  ])
  drawPixelLand(context, "#ffe66d", [
    [-84, 12],
    [-58, 3],
    [-48, -18],
    [-62, -54],
    [-76, -34],
    [-88, -8],
  ])
  drawPixelLand(context, "#7bd88f", [
    [-12, 58],
    [28, 68],
    [48, 50],
    [22, 36],
    [-4, 36],
    [-18, 48],
  ])
  drawPixelLand(context, "#ff9f43", [
    [-18, 34],
    [28, 36],
    [52, 16],
    [44, -28],
    [20, -35],
    [0, -6],
    [-18, 8],
  ])
  drawPixelLand(context, "#a78bfa", [
    [42, 62],
    [100, 62],
    [140, 45],
    [132, 12],
    [96, 6],
    [72, 24],
    [42, 34],
  ])
  drawPixelLand(context, "#f472b6", [
    [108, 8],
    [142, 2],
    [154, -26],
    [126, -38],
    [104, -16],
  ])
  drawPixelLand(context, "#4ecdc4", [
    [112, -12],
    [154, -18],
    [150, -44],
    [112, -42],
  ])

  context.globalAlpha = 0.58
  context.fillStyle = "#0f2f75"
  for (let x = 0; x < canvas.width; x += 64) {
    context.fillRect(x, 0, 1, canvas.height)
  }
  for (let y = 0; y < canvas.height; y += 64) {
    context.fillRect(0, y, canvas.width, 1)
  }
  context.globalAlpha = 1

  return new THREE.CanvasTexture(canvas)
}

function createPixelCloudTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 512
  const context = canvas.getContext("2d")!

  context.imageSmoothingEnabled = false
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = "rgba(255, 255, 255, 0.55)"

  const clouds = [
    [88, 112, 96, 32],
    [280, 176, 136, 32],
    [472, 96, 120, 32],
    [688, 216, 152, 40],
    [840, 136, 96, 32],
    [176, 328, 120, 32],
    [552, 352, 168, 40],
    [808, 312, 112, 32],
  ] as const

  clouds.forEach(([x, y, width, height]) => {
    context.fillRect(x, y, width, height)
    context.fillRect(x + 32, y - 16, width - 48, height)
    context.fillRect(x + 56, y + 16, width + 24, height)
  })

  return new THREE.CanvasTexture(canvas)
}

function createStarTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 32
  canvas.height = 32
  const context = canvas.getContext("2d")!
  const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16)
  gradient.addColorStop(0, "rgba(255,255,255,1)")
  gradient.addColorStop(0.28, "rgba(255,255,255,0.9)")
  gradient.addColorStop(1, "rgba(255,255,255,0)")
  context.fillStyle = gradient
  context.fillRect(0, 0, 32, 32)

  return new THREE.CanvasTexture(canvas)
}

function createStarFieldGeometry() {
  const geometry = new THREE.BufferGeometry()
  const positions: number[] = []

  for (let i = 0; i < 850; i += 1) {
    const radius = 8 + Math.random() * 5
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions.push(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    )
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  )

  return geometry
}

function drawPixelLand(
  context: CanvasRenderingContext2D,
  color: string,
  coordinates: Array<[number, number]>
) {
  const pixelSize = 4

  context.fillStyle = color
  context.strokeStyle = "#1a1a2e"
  context.lineWidth = 2
  context.beginPath()
  coordinates.forEach(([lon, lat], index) => {
    const x =
      Math.round((((lon + 180) / 360) * context.canvas.width) / pixelSize) *
      pixelSize
    const y =
      Math.round((((90 - lat) / 180) * context.canvas.height) / pixelSize) *
      pixelSize

    if (index === 0) {
      context.moveTo(x, y)
    } else {
      context.lineTo(x, y)
    }
  })
  context.closePath()
  context.fill()
  context.stroke()
}

function disposeMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((item) => item.dispose())
    return
  }

  material.dispose()
}
