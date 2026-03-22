"use client"

import { ArrowUpRight, Flame, MapPin } from "lucide-react"

import type { Company } from "@/lib/companies"
import { cn } from "@/lib/utils"

type CompanyCardProps = {
  company: Company
  active?: boolean
  compact?: boolean
  onSelect?: (slug: string) => void
}

const tierLabel: Record<Company["featuredTier"], string> = {
  core: "Core",
  hot: "Hot",
  scene: "Scene",
}

export function CompanyCard({
  company,
  active = false,
  compact = false,
  onSelect,
}: CompanyCardProps) {
  const body = (
    <article
      className={cn(
        "rounded-[28px] border p-4 transition-all",
        active
          ? "border-[var(--accent-strong)] bg-[var(--card)] shadow-[0_24px_50px_-28px_rgba(34,46,62,0.45)]"
          : "border-[color:var(--line)] bg-white/80 hover:border-[var(--accent-strong)] hover:bg-[var(--card)]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-[var(--muted-ink)] uppercase">
            <span className="rounded-full bg-[var(--card-soft)] px-2.5 py-1 text-[10px] tracking-[0.22em]">
              {company.category}
            </span>
            {company.featuredTier === "hot" ? (
              <span className="inline-flex items-center gap-1 text-[var(--accent-strong)]">
                <Flame className="size-3" />
                {tierLabel[company.featuredTier]}
              </span>
            ) : (
              <span>{tierLabel[company.featuredTier]}</span>
            )}
          </div>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--ink)]">
            {company.name}
          </h3>
        </div>
        <a
          href={company.website}
          target="_blank"
          rel="noreferrer"
          aria-label={`Visit ${company.name}`}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--line)] bg-white/80 text-[var(--ink)] transition-colors hover:border-[var(--accent-strong)] hover:text-[var(--accent-strong)]"
        >
          <ArrowUpRight className="size-4" />
        </a>
      </div>

      <p className="mt-4 text-sm leading-6 text-[var(--muted-ink)]">{company.shortDescription}</p>

      <div className="mt-4 rounded-[22px] bg-[var(--card-soft)] px-4 py-3">
        <div className="text-[11px] font-semibold tracking-[0.18em] text-[var(--muted-ink)] uppercase">
          Why it matters
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--ink)]">{company.whyItMatters}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--muted-ink)]">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          {company.neighborhood}
        </span>
        <span>Founded {company.founded}</span>
      </div>
    </article>
  )

  if (!onSelect || compact === false) {
    return body
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(company.slug)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onSelect(company.slug)
        }
      }}
      className="w-full text-left outline-none"
    >
      {body}
    </div>
  )
}
