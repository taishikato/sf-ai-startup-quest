"use client"

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"

import { DiscoveryPanel } from "@/components/discovery-panel"
import { MapShell } from "@/components/map-shell"
import { COMPANIES, type CompanyCategory } from "@/lib/companies"
import { cn } from "@/lib/utils"

const featuredOrder = ["core", "hot", "scene"] as const

export function SfAiMap() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<CompanyCategory | "All">("All")
  const [selectedSlug, setSelectedSlug] = useState("openai")
  const [isAudioMuted, setIsAudioMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    const audio = new Audio("/audio/sf-ai-startup-map-theme.mp3")
    audio.loop = true
    audio.preload = "auto"
    audio.volume = 0.42
    audio.muted = true
    audioRef.current = audio

    audio.play().catch(() => {
      // Browsers usually allow muted autoplay, but failing closed is fine here.
    })

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    audio.muted = isAudioMuted
  }, [isAudioMuted])

  const handleToggleMute = async () => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    const nextMuted = !isAudioMuted
    audio.muted = nextMuted
    setIsAudioMuted(nextMuted)

    if (!nextMuted) {
      try {
        await audio.play()
      } catch {
        setIsAudioMuted(true)
        audio.muted = true
      }
    }
  }

  const filteredCompanies = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase()

    return [...COMPANIES]
      .filter((company) => (category === "All" ? true : company.category === category))
      .filter((company) => {
        if (!query) {
          return true
        }

        return [
          company.name,
          company.shortDescription,
          company.category,
          company.locationLabel,
          company.whyItMatters,
          company.sourceLabel,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      })
      .sort((left, right) => {
        const tierDelta =
          featuredOrder.indexOf(left.featuredTier) - featuredOrder.indexOf(right.featuredTier)

        if (tierDelta !== 0) {
          return tierDelta
        }

        return left.name.localeCompare(right.name)
      })
  }, [category, deferredSearch])

  const selectedCompany =
    filteredCompanies.find((company) => company.slug === selectedSlug) ??
    COMPANIES.find((company) => company.slug === selectedSlug) ??
    filteredCompanies[0] ??
    COMPANIES[0]

  const mapCompanies = filteredCompanies.length > 0 ? filteredCompanies : [selectedCompany]

  return (
    <main className="h-dvh overflow-hidden bg-[#1a1a2e]">
      <section className="mx-auto h-full min-h-0 w-full">
        <div
          className={cn(
            "grid h-full min-h-0",
            "max-lg:grid-rows-[minmax(0,1fr)_minmax(260px,min(52vh,50dvh))]",
            "lg:grid-cols-[380px_minmax(0,1fr)]",
            "lg:grid-rows-1",
          )}
        >
          <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <DiscoveryPanel
              companies={filteredCompanies}
              selectedCompany={selectedCompany}
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              onSelectCompany={setSelectedSlug}
            />
          </div>
          <div className="relative h-full min-h-0 overflow-hidden">
            <MapShell
              companies={mapCompanies}
              selectedCompany={selectedCompany}
              onSelectCompany={setSelectedSlug}
              isAudioMuted={isAudioMuted}
              onToggleMute={handleToggleMute}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
