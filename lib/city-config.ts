export type CityMapConfig = {
  titleLines: [string, string]
  emptyStateTitle: string
  searchPlaceholder: string
  initialSelectedSlug: string
  mapCenter: [number, number]
  sourceHref: string
  switchHref: string
  switchLabel: string
  switchAriaLabel: string
}

export const sfMapConfig: CityMapConfig = {
  titleLines: ["SF AI", "Startup Map"],
  emptyStateTitle: "SF AI Startup Map",
  searchPlaceholder: "OpenAI, agents, voice...",
  initialSelectedSlug: "openai",
  mapCenter: [-122.4167, 37.7793],
  sourceHref: "https://github.com/taishikato/sf-ai-startup-quest",
  switchHref: "/toronto",
  switchLabel: "TO",
  switchAriaLabel: "Open Toronto AI Startup Map",
}

export const torontoMapConfig: CityMapConfig = {
  titleLines: ["Toronto AI", "Startup Map"],
  emptyStateTitle: "Toronto AI Startup Map",
  searchPlaceholder: "Cohere, agents, health...",
  initialSelectedSlug: "cohere",
  mapCenter: [-79.3832, 43.6532],
  sourceHref: "https://github.com/taishikato/sf-ai-startup-quest",
  switchHref: "/",
  switchLabel: "SF",
  switchAriaLabel: "Open SF AI Startup Map",
}
