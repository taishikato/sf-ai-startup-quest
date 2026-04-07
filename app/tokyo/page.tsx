import { Suspense } from "react"
import type { Metadata } from "next"

import { tokyoMapConfig } from "@/lib/city-config"
import { loadCityMapPageData } from "@/lib/city-page-data"
import { CityMap } from "@/components/city-map"

export const metadata: Metadata = {
  title: "Tokyo AI Startup Map: Explore AI Native Startups in Tokyo",
  description:
    "Browse AI-native startups across Tokyo on an interactive map, with category filters, source-backed locations, and direct company links.",
}

export default async function Page() {
  const { companies, meetups } = await loadCityMapPageData("tokyo")

  return (
    <Suspense fallback={null}>
      <CityMap
        key="tokyo"
        companies={companies}
        meetups={meetups}
        config={tokyoMapConfig}
      />
    </Suspense>
  )
}
