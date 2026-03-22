"use client"

import { useDeferredValue, useMemo, useState } from "react"

import { CompanyCard } from "@/components/company-card"
import { DiscoveryPanel } from "@/components/discovery-panel"
import { MapShell } from "@/components/map-shell"
import { COMPANIES, type CompanyCategory, type QuickFilterId } from "@/lib/companies"

const featuredOrder = ["core", "hot", "scene"] as const

export function SfAiMap() {
  const [search, setSearch] = useState("")
  const [quickFilter, setQuickFilter] = useState<QuickFilterId>("all")
  const [category, setCategory] = useState<CompanyCategory | "All">("All")
  const [selectedSlug, setSelectedSlug] = useState("openai")

  const deferredSearch = useDeferredValue(search)

  const filteredCompanies = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase()

    return [...COMPANIES]
      .filter((company) => {
        if (quickFilter === "hot") return company.featuredTier === "hot"
        if (quickFilter === "core") return company.featuredTier === "core"
        if (quickFilter === "agents") return company.category === "Agents"
        if (quickFilter === "infra") return company.category === "Infra"
        if (quickFilter === "consumer") return company.category === "Consumer AI"

        return true
      })
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
  }, [category, deferredSearch, quickFilter])

  const selectedCompany =
    filteredCompanies.find((company) => company.slug === selectedSlug) ??
    COMPANIES.find((company) => company.slug === selectedSlug) ??
    filteredCompanies[0] ??
    COMPANIES[0]

  const mapCompanies = filteredCompanies.length > 0 ? filteredCompanies : [selectedCompany]

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto max-w-[1560px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="grid gap-5 lg:grid-cols-[430px_minmax(0,1fr)]">
          <DiscoveryPanel
            companies={filteredCompanies}
            selectedCompany={selectedCompany}
            search={search}
            onSearchChange={setSearch}
            quickFilter={quickFilter}
            onQuickFilterChange={setQuickFilter}
            category={category}
            onCategoryChange={setCategory}
            onSelectCompany={setSelectedSlug}
          />
          <div className="flex flex-col gap-5">
            <MapShell
              companies={mapCompanies}
              selectedCompany={selectedCompany}
              onSelectCompany={setSelectedSlug}
            />
            <div className="grid gap-4 lg:hidden">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-[0.2em] text-[var(--muted-ink)] uppercase">
                  Selected stop
                </h2>
                <span className="text-xs text-[var(--muted-ink)]">Mobile-friendly detail view</span>
              </div>
              <CompanyCard company={selectedCompany} active />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
