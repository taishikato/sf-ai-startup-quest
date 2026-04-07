import { Suspense } from "react"
import type { Metadata } from "next"

import { tokyoMapConfig } from "@/lib/city-config"
import { companyFromRow } from "@/lib/company"
import { createAdminClient } from "@/lib/supabase/admin"
import { CityMap } from "@/components/city-map"

export const metadata: Metadata = {
  title: "Tokyo AI Startup Map: Explore AI Native Startups in Tokyo",
  description:
    "Browse AI-native startups across Tokyo on an interactive map, with category filters, source-backed locations, and direct company links.",
}

export default async function Page() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("companies")
    .select(
      "slug, name, website, short_description, category, location_label, city, latitude, longitude, founded, logo_url, map_sprite, source_url"
    )
    .match({ city: "tokyo" })
    .order("name")

  if (error) throw new Error(`Failed to load companies: ${error.message}`)

  return (
    <Suspense fallback={null}>
      <CityMap
        key="tokyo"
        companies={(data ?? []).map(companyFromRow)}
        config={tokyoMapConfig}
      />
    </Suspense>
  )
}
