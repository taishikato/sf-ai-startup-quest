export type CityId = "sf" | "toronto" | "ny"

export type CitySwitchOption = {
  city: CityId
  href: string
  label: string
  ariaLabel: string
}

export type CityMapConfig = {
  city: CityId
  titleLines: [string, string]
  emptyStateTitle: string
  searchPlaceholder: string
  initialSelectedSlug: string
  mapCenter: [number, number]
  sourceHref: string
  switchOptions: CitySwitchOption[]
}

export const sfMapConfig: CityMapConfig = {
  city: "sf",
  titleLines: ["SF AI", "Startup Map"],
  emptyStateTitle: "SF AI Startup Map",
  searchPlaceholder: "OpenAI, agents, voice...",
  initialSelectedSlug: "openai",
  mapCenter: [-122.4167, 37.7793],
  sourceHref: "https://github.com/taishikato/sf-ai-startup-quest",
  switchOptions: [
    {
      city: "toronto",
      href: "/toronto",
      label: "TO",
      ariaLabel: "Open Toronto AI Startup Map",
    },
    {
      city: "ny",
      href: "/ny",
      label: "NY",
      ariaLabel: "Open New York AI Startup Map",
    },
  ],
}

export const torontoMapConfig: CityMapConfig = {
  city: "toronto",
  titleLines: ["Toronto AI", "Startup Map"],
  emptyStateTitle: "Toronto AI Startup Map",
  searchPlaceholder: "Cohere, agents, health...",
  initialSelectedSlug: "cohere",
  mapCenter: [-79.3832, 43.6532],
  sourceHref: "https://github.com/taishikato/sf-ai-startup-quest",
  switchOptions: [
    {
      city: "sf",
      href: "/",
      label: "SF",
      ariaLabel: "Open SF AI Startup Map",
    },
    {
      city: "ny",
      href: "/ny",
      label: "NY",
      ariaLabel: "Open New York AI Startup Map",
    },
  ],
}

export const nyMapConfig: CityMapConfig = {
  city: "ny",
  titleLines: ["NY AI", "Startup Map"],
  emptyStateTitle: "New York AI Startup Map",
  searchPlaceholder: "Runway, agents, fintech...",
  initialSelectedSlug: "runway",
  mapCenter: [-74.006, 40.7128],
  sourceHref: "https://github.com/taishikato/sf-ai-startup-quest",
  switchOptions: [
    {
      city: "sf",
      href: "/",
      label: "SF",
      ariaLabel: "Open SF AI Startup Map",
    },
    {
      city: "toronto",
      href: "/toronto",
      label: "TO",
      ariaLabel: "Open Toronto AI Startup Map",
    },
  ],
}
