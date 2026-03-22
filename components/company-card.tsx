"use client"

import { useState } from "react"
import { ArrowUpRight, Flame, MapPin } from "lucide-react"

import { getCompanyLogoUrl, getCompanyMonogram, type Company } from "@/lib/companies"
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
  const monogram = getCompanyMonogram(company)

  const compactBody = (
    <article
      className={cn(
        "border p-3 transition-colors",
        active
          ? "border-foreground bg-card"
          : "border-border bg-background hover:border-muted-foreground/40"
      )}
    >
      <div className="flex items-start gap-3">
        <CompanyLogo company={company} monogram={monogram} compact />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase text-muted-foreground">
                <span>{company.category}</span>
                <span>{tierLabel[company.featuredTier]}</span>
              </div>
              <h3 className="mt-1 text-base font-semibold tracking-[-0.02em] text-foreground">
                {company.name}
              </h3>
            </div>
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit ${company.name}`}
              className="inline-flex size-8 shrink-0 items-center justify-center border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
            {company.shortDescription}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {company.neighborhood}
            </span>
            <span>Founded {company.founded}</span>
          </div>
        </div>
      </div>
    </article>
  )

  const body = (
    <article
      className={cn(
        "border p-4 transition-colors",
        active
          ? "border-foreground bg-card"
          : "border-border bg-background hover:border-muted-foreground/40"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
            <span className="bg-secondary px-2.5 py-1 text-[10px] tracking-[0.16em] text-secondary-foreground">
              {company.category}
            </span>
            {company.featuredTier === "hot" ? (
              <span className="inline-flex items-center gap-1 text-orange-600">
                <Flame className="size-3" />
                {tierLabel[company.featuredTier]}
              </span>
            ) : (
              <span>{tierLabel[company.featuredTier]}</span>
            )}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <CompanyLogo company={company} monogram={monogram} />
            <h3 className="min-w-0 text-xl font-semibold tracking-[-0.03em] text-foreground">
              {company.name}
            </h3>
          </div>
        </div>
        <a
          href={company.website}
          target="_blank"
          rel="noreferrer"
          aria-label={`Visit ${company.name}`}
          className="inline-flex size-10 shrink-0 items-center justify-center border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowUpRight className="size-4" />
        </a>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">{company.shortDescription}</p>

      <div className="mt-4 bg-muted px-4 py-3">
        <div className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Why it matters
        </div>
        <p className="mt-2 text-sm leading-6 text-foreground">{company.whyItMatters}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          {company.neighborhood}
        </span>
        <span>Founded {company.founded}</span>
      </div>
    </article>
  )

  const cardBody = compact ? compactBody : body

  if (!onSelect || compact === false) {
    return cardBody
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
      {cardBody}
    </div>
  )
}

function CompanyLogo({
  company,
  monogram,
  compact = false,
}: {
  company: Company
  monogram: string
  compact?: boolean
}) {
  const [showFallback, setShowFallback] = useState(false)

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center border border-border bg-white",
        compact ? "size-9" : "size-10"
      )}
    >
      {showFallback ? (
        <span className={cn("font-semibold text-foreground", compact ? "text-xs" : "text-sm")}>
          {monogram}
        </span>
      ) : (
        <img
          src={getCompanyLogoUrl(company)}
          alt={`${company.name} logo`}
          className={cn("object-contain", compact ? "size-5" : "size-6")}
          loading="lazy"
          onError={() => setShowFallback(true)}
        />
      )}
    </div>
  )
}
