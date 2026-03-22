"use client"

import { QUICK_FILTERS, type QuickFilterId } from "@/lib/companies"
import { cn } from "@/lib/utils"

type QuickFiltersProps = {
  value: QuickFilterId
  onChange: (value: QuickFilterId) => void
}

export function QuickFilters({ value, onChange }: QuickFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-[0.2em] text-[var(--muted-ink)] uppercase">
          Start here
        </h2>
        <span className="text-xs text-[var(--muted-ink)]">Quick ways in</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {QUICK_FILTERS.map((filter) => {
          const active = filter.id === value

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onChange(filter.id)}
              className={cn(
                "rounded-[24px] border px-3 py-3 text-left transition-all",
                active
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] shadow-[0_14px_30px_-20px_rgba(34,46,62,0.6)]"
                  : "border-[color:var(--line)] bg-white/75 text-[var(--ink)] hover:border-[var(--accent-strong)] hover:bg-[var(--card-soft)]"
              )}
            >
              <div className="text-sm font-semibold">{filter.label}</div>
              <div
                className={cn(
                  "mt-1 text-xs leading-5",
                  active ? "text-white/78" : "text-[var(--muted-ink)]"
                )}
              >
                {filter.description}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
