"use client"

import { useDeferredValue, useMemo, useState } from "react"

import { CompanyCard } from "@/components/company-card"
import { DiscoveryPanel } from "@/components/discovery-panel"
import { MapShell } from "@/components/map-shell"
import { COMPANIES, type CompanyCategory } from "@/lib/companies"

const featuredOrder = ["core", "hot", "scene"] as const

export function SfAiMap() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<CompanyCategory | "All">("All")
  const [selectedSlug, setSelectedSlug] = useState("openai")

  const deferredSearch = useDeferredValue(search)

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
          company.neighborhood,
          company.whyItMatters,
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
    <main className="h-screen overflow-hidden bg-background">
      <section className="mx-auto h-full w-full">
        <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[400px_minmax(0,1fr)]">
          <DiscoveryPanel
            companies={filteredCompanies}
            selectedCompany={selectedCompany}
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            onSelectCompany={setSelectedSlug}
          />
          <div className="flex min-h-0 flex-col gap-4 overflow-hidden">
            <MapShell
              companies={mapCompanies}
              selectedCompany={selectedCompany}
              onSelectCompany={setSelectedSlug}
            />
            <div className="grid gap-4 lg:hidden">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Selected stop</h2>
                <span className="text-xs text-muted-foreground">Mobile detail view</span>
              </div>
              <CompanyCard company={selectedCompany} active />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
