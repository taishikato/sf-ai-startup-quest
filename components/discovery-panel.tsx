"use client"

import { Search } from "lucide-react"

import { CompanyCard } from "@/components/company-card"
import { QuickFilters } from "@/components/quick-filters"
import {
  COMPANY_CATEGORIES,
  type Company,
  type CompanyCategory,
  type QuickFilterId,
} from "@/lib/companies"
import { cn } from "@/lib/utils"

type DiscoveryPanelProps = {
  companies: Company[]
  selectedCompany: Company
  search: string
  onSearchChange: (value: string) => void
  quickFilter: QuickFilterId
  onQuickFilterChange: (value: QuickFilterId) => void
  category: CompanyCategory | "All"
  onCategoryChange: (value: CompanyCategory | "All") => void
  onSelectCompany: (slug: string) => void
}

export function DiscoveryPanel({
  companies,
  selectedCompany,
  search,
  onSearchChange,
  quickFilter,
  onQuickFilterChange,
  category,
  onCategoryChange,
  onSelectCompany,
}: DiscoveryPanelProps) {
  return (
    <aside className="flex min-h-[40rem] flex-col gap-5 rounded-[34px] border border-[color:var(--line)] bg-[var(--panel)] p-5 shadow-[0_30px_70px_-40px_rgba(51,63,79,0.45)] backdrop-blur">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-[color:var(--line)] bg-white/70 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[var(--muted-ink)] uppercase">
            Curated map
          </span>
          <span className="text-xs text-[var(--muted-ink)]">{companies.length} companies showing</span>
        </div>
        <div className="space-y-3">
          <h1 className="max-w-xs text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-[var(--ink)]">
            A friendlier map of SF AI startups.
          </h1>
          <p className="max-w-md text-sm leading-6 text-[var(--muted-ink)]">
            This is not every company. It is a curated way to feel the shape of the
            current scene, from the names everyone knows to the ones builders keep
            bringing up.
          </p>
        </div>
      </div>

      <QuickFilters value={quickFilter} onChange={onQuickFilterChange} />

      <div className="space-y-4 rounded-[28px] border border-[color:var(--line)] bg-white/70 p-4">
        <label className="block">
          <span className="text-sm font-semibold text-[var(--ink)]">Find a company</span>
          <span className="relative mt-2 block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--muted-ink)]" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search OpenAI, agents, voice..."
              className="h-11 w-full rounded-full border border-[color:var(--line)] bg-[var(--paper)] pr-4 pl-10 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted-ink)] focus:border-[var(--accent-strong)]"
            />
          </span>
        </label>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--ink)]">What they do</span>
            <button
              type="button"
              onClick={() => onCategoryChange("All")}
              className="text-xs font-medium text-[var(--accent-strong)]"
            >
              Reset
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterPill
              active={category === "All"}
              label="All"
              onClick={() => onCategoryChange("All")}
            />
            {COMPANY_CATEGORIES.map((item) => (
              <FilterPill
                key={item}
                active={category === item}
                label={item}
                onClick={() => onCategoryChange(item)}
              />
            ))}
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-[0.2em] text-[var(--muted-ink)] uppercase">
              Selected
            </h2>
            <p className="mt-1 text-sm text-[var(--muted-ink)]">Start with the big names, then wander.</p>
          </div>
        </div>
        <CompanyCard company={selectedCompany} active />
      </section>

      <section className="min-h-0 flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-[0.2em] text-[var(--muted-ink)] uppercase">
            What&apos;s happening nearby
          </h2>
          <span className="text-xs text-[var(--muted-ink)]">Tap a card or marker</span>
        </div>
        {companies.length > 0 ? (
          <div className="grid gap-3 overflow-y-auto pr-1">
            {companies.map((company) => (
              <CompanyCard
                key={company.slug}
                company={company}
                compact
                active={company.slug === selectedCompany.slug}
                onSelect={onSelectCompany}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[color:var(--line)] bg-white/50 p-6">
            <h3 className="text-base font-semibold text-[var(--ink)]">Nothing matches that mix yet.</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
              Try clearing the search or flipping back to “All scene” to get your bearings
              again.
            </p>
          </div>
        )}
      </section>
    </aside>
  )
}

function FilterPill({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-2 text-xs font-semibold transition-all",
        active
          ? "border-[var(--accent-strong)] bg-[var(--accent-soft)] text-[var(--ink)]"
          : "border-[color:var(--line)] bg-white/70 text-[var(--muted-ink)] hover:border-[var(--accent-strong)] hover:text-[var(--ink)]"
      )}
    >
      {label}
    </button>
  )
}
