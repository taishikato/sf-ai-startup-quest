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
        <h2 className="text-sm font-semibold text-foreground">Quick filters</h2>
        <span className="text-xs text-muted-foreground">Fast ways to narrow the map</span>
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
                "border px-3 py-3 text-left transition-colors",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:bg-muted"
              )}
            >
              <div className="text-sm font-medium">{filter.label}</div>
              <div
                className={cn(
                  "mt-1 text-xs leading-5",
                  active ? "text-background/75" : "text-muted-foreground"
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
