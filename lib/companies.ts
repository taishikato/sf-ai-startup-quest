import {
  YC_SF_SEARCH_COMPANIES,
  type DiscoveredCompany,
} from "@/lib/yc-sf-companies"

export const COMPANY_CATEGORIES = [
  "Core Labs",
  "Consumer AI",
  "Devtools",
  "Infra",
  "Agents",
  "Vertical AI",
] as const

export type CompanyCategory = (typeof COMPANY_CATEGORIES)[number]

export const FEATURED_TIERS = ["core", "hot", "scene"] as const

export type FeaturedTier = (typeof FEATURED_TIERS)[number]

export type Company = {
  slug: string
  name: string
  website: string
  shortDescription: string
  whyItMatters: string
  category: CompanyCategory
  neighborhood: string
  coordinates: [number, number]
  founded: number
  featuredTier: FeaturedTier
  logoUrl?: string
}

type AnchorPoint = {
  name: string
  coordinates: [number, number]
}

const CATEGORY_ANCHORS: Record<CompanyCategory, AnchorPoint[]> = {
  "Core Labs": [
    { name: "Mission Bay", coordinates: [-122.3931, 37.7712] },
    { name: "Financial District", coordinates: [-122.4014, 37.7918] },
  ],
  "Consumer AI": [
    { name: "Mission District", coordinates: [-122.4191, 37.7595] },
    { name: "Hayes Valley", coordinates: [-122.4244, 37.7767] },
    { name: "North Beach", coordinates: [-122.4072, 37.8061] },
    { name: "Duboce Triangle", coordinates: [-122.4361, 37.7699] },
  ],
  Devtools: [
    { name: "SoMa", coordinates: [-122.4054, 37.783] },
    { name: "South Beach", coordinates: [-122.3909, 37.7805] },
    { name: "Civic Center", coordinates: [-122.4148, 37.7794] },
    { name: "Mission Bay", coordinates: [-122.3922, 37.7698] },
  ],
  Infra: [
    { name: "Mission Bay", coordinates: [-122.3914, 37.7708] },
    { name: "Dogpatch", coordinates: [-122.3896, 37.7604] },
    { name: "Financial District", coordinates: [-122.4017, 37.7937] },
    { name: "Potrero Hill", coordinates: [-122.4043, 37.7594] },
  ],
  Agents: [
    { name: "SoMa", coordinates: [-122.4032, 37.7854] },
    { name: "Financial District", coordinates: [-122.4009, 37.7908] },
    { name: "South Beach", coordinates: [-122.3907, 37.7808] },
    { name: "Mission District", coordinates: [-122.4132, 37.7608] },
  ],
  "Vertical AI": [
    { name: "Mission Bay", coordinates: [-122.3921, 37.7689] },
    { name: "Jackson Square", coordinates: [-122.4015, 37.7962] },
    { name: "Financial District", coordinates: [-122.4008, 37.7898] },
    { name: "Potrero Hill", coordinates: [-122.4048, 37.7589] },
  ],
}

const CONSUMER_TAGS = [
  "consumer",
  "social",
  "social-media",
  "social-network",
  "gaming",
  "search",
  "chat",
  "travel",
  "education",
  "ai-enhanced-learning",
  "augmented-reality",
  "video",
  "no-code",
]

const INFRA_TAGS = [
  "infrastructure",
  "cloud-computing",
  "api",
  "apis",
  "data-labeling",
  "privacy",
  "security",
  "cybersecurity",
  "edge-computing-semiconductors",
  "aiops",
]

const DEVTOOLS_TAGS = [
  "developer-tools",
  "open-source",
  "design-tools",
  "devops",
  "devsecops",
  "monitoring",
  "analytics",
]

const VERTICAL_TAGS = [
  "healthcare",
  "healthcare-it",
  "health-tech",
  "telemedicine",
  "telehealth",
  "biotech",
  "biotechnology",
  "drug-discovery",
  "genomics",
  "legal",
  "legaltech",
  "construction",
  "architecture",
  "manufacturing",
  "industrial",
  "supply-chain",
  "logistics",
  "insurance",
  "lending",
  "fintech",
  "finops",
  "restaurant-tech",
  "sports-tech",
  "market-research",
  "compliance",
  "robotics",
  "hardware",
]

const AGENT_TAGS = [
  "ai-assistant",
  "workflow-automation",
  "customer-service",
  "customer-support",
  "sales",
  "recruiting",
  "robotic-process-automation",
  "conversational-ai",
  "email",
  "operations",
]

const DISCOVERED_HOT_SLUGS = new Set([
  "a0-dev",
  "blaxel",
  "calltree",
  "chamber",
  "cyberdesk",
  "dedalus-labs",
  "emergent",
  "hud",
  "logical",
  "onlook",
  "roark",
  "tinfoil",
  "truffle-ai",
])

function hashString(value: string) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

function hasAnyTag(raw: DiscoveredCompany, keywords: string[]) {
  const tags = raw.tags.map((tag) => tag.toLowerCase())

  return keywords.some((keyword) => tags.includes(keyword))
}

function inferCompanyCategory(raw: DiscoveredCompany): CompanyCategory {
  const text = `${raw.name} ${raw.shortDescription} ${raw.tags.join(" ")}`.toLowerCase()

  if (hasAnyTag(raw, CONSUMER_TAGS)) {
    return "Consumer AI"
  }

  if (hasAnyTag(raw, INFRA_TAGS)) {
    return "Infra"
  }

  if (
    hasAnyTag(raw, DEVTOOLS_TAGS) ||
    /code|developer|frontend|design-to-code|sandbox|test|pull request|mobile app/.test(text)
  ) {
    return "Devtools"
  }

  if (hasAnyTag(raw, VERTICAL_TAGS)) {
    return "Vertical AI"
  }

  if (hasAnyTag(raw, AGENT_TAGS) || /agent|copilot|assistant|automation/.test(text)) {
    return "Agents"
  }

  return "Vertical AI"
}

function buildPlacement(raw: DiscoveredCompany, category: CompanyCategory) {
  const anchors = CATEGORY_ANCHORS[category]
  const hash = hashString(raw.slug)
  const anchor = anchors[hash % anchors.length]
  const lngOffset = ((((hash >> 8) % 1000) / 1000) - 0.5) * 0.015
  const latOffset = ((((hash >> 18) % 1000) / 1000) - 0.5) * 0.011

  return {
    neighborhood: anchor.name,
    coordinates: [
      Number((anchor.coordinates[0] + lngOffset).toFixed(4)),
      Number((anchor.coordinates[1] + latOffset).toFixed(4)),
    ] as [number, number],
  }
}

function buildWhyItMatters(category: CompanyCategory, raw: DiscoveredCompany) {
  const tags = raw.tags.map((tag) => tag.toLowerCase())

  if (tags.some((tag) => ["healthcare", "healthcare-it", "health-tech", "biotech"].includes(tag))) {
    return "A strong signal that healthcare and biotech remain one of the busiest corners of SF AI."
  }

  if (tags.some((tag) => ["legal", "legaltech", "compliance", "regtech"].includes(tag))) {
    return "A reminder that legal, compliance, and regulated workflows are major AI beachheads in SF."
  }

  if (tags.some((tag) => ["cybersecurity", "security", "privacy"].includes(tag))) {
    return "Part of the trust, privacy, and security layer growing around the current AI stack."
  }

  if (tags.some((tag) => ["robotics", "hardware", "manufacturing", "industrial"].includes(tag))) {
    return "Shows how tightly the SF AI scene now overlaps with robotics, hardware, and real-world systems."
  }

  if (tags.some((tag) => ["sales", "marketing", "customer-service", "customer-support", "recruiting"].includes(tag))) {
    return "A good example of the agent wave moving into revenue and customer-facing workflows."
  }

  switch (category) {
    case "Consumer AI":
      return "Shows the more product-facing and consumer side of the SF AI scene."
    case "Devtools":
      return "One of the builder tools showing up in the current SF AI workflow stack."
    case "Infra":
      return "Represents the infrastructure and platform layer underneath the current SF AI boom."
    case "Agents":
      return "A clear example of AI agents getting packaged into concrete software and workflows."
    case "Vertical AI":
      return "A sign that much of SF AI is now moving into specific industries and operating workflows."
    case "Core Labs":
      return "One of the companies that defines the center of gravity for SF AI."
  }
}

function normalizeWebsite(website: string, slug: string) {
  const fallback = `https://www.ycombinator.com/companies/${slug}`

  if (!website) {
    return fallback
  }

  try {
    const parsed = new URL(website)

    if (parsed.protocol === "http:") {
      parsed.protocol = "https:"
    }

    return parsed.toString()
  } catch {
    return fallback
  }
}

function buildDiscoveredCompany(raw: DiscoveredCompany): Company {
  const category = inferCompanyCategory(raw)
  const placement = buildPlacement(raw, category)

  return {
    slug: raw.slug,
    name: raw.name,
    website: normalizeWebsite(raw.website, raw.slug),
    shortDescription: raw.shortDescription,
    whyItMatters: buildWhyItMatters(category, raw),
    category,
    neighborhood: placement.neighborhood,
    coordinates: placement.coordinates,
    founded: raw.founded,
    featuredTier: DISCOVERED_HOT_SLUGS.has(raw.slug) ? "hot" : "scene",
    logoUrl: raw.logoUrl,
  }
}

export function getCompanyMonogram(company: Company) {
  if (company.name === "11x") {
    return "11"
  }

  const parts = company.name
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(" ")
    .filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return company.name.slice(0, 2).toUpperCase()
}

export function getCompanyDomain(company: Company) {
  return new URL(company.website).hostname
}

export function getCompanyLogoUrl(company: Company) {
  if (company.logoUrl) {
    return company.logoUrl
  }

  const domain = getCompanyDomain(company)

  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
}

// Curated, not exhaustive: keep the obvious anchors on the map, then extend
// the scene with newer SF AI companies discovered from current YC listings.
const CURATED_COMPANIES: Company[] = [
  {
    slug: "openai",
    name: "OpenAI",
    website: "https://openai.com",
    shortDescription: "Frontier AI lab behind ChatGPT and a huge share of the current AI wave.",
    whyItMatters: "The obvious anchor on any map of modern SF AI.",
    category: "Core Labs",
    neighborhood: "Mission Bay",
    coordinates: [-122.3968, 37.7897],
    founded: 2015,
    featuredTier: "core",
  },
  {
    slug: "anthropic",
    name: "Anthropic",
    website: "https://www.anthropic.com",
    shortDescription: "Claude-maker focused on frontier models, safety, and serious product adoption.",
    whyItMatters: "If OpenAI is one pole of SF AI, Anthropic is the other.",
    category: "Core Labs",
    neighborhood: "Financial District",
    coordinates: [-122.4007, 37.7895],
    founded: 2021,
    featuredTier: "core",
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    website: "https://www.perplexity.ai",
    shortDescription: "Answer engine with a strong consumer feel and nonstop mindshare.",
    whyItMatters: "One of the clearest consumer-facing AI stories to come out of SF.",
    category: "Consumer AI",
    neighborhood: "Financial District",
    coordinates: [-122.4019, 37.7921],
    founded: 2022,
    featuredTier: "core",
  },
  {
    slug: "cursor",
    name: "Cursor",
    website: "https://cursor.com",
    shortDescription: "AI coding tool that helped define the vibe of the current builder scene.",
    whyItMatters: "Probably the most culturally visible devtool in the current wave.",
    category: "Devtools",
    neighborhood: "SoMa",
    coordinates: [-122.4089, 37.7825],
    founded: 2022,
    featuredTier: "core",
  },
  {
    slug: "scale-ai",
    name: "Scale AI",
    website: "https://scale.com",
    shortDescription: "Data, evaluation, and enterprise infrastructure for training and deploying AI.",
    whyItMatters: "Too central to the SF AI ecosystem to leave off the map.",
    category: "Infra",
    neighborhood: "Dogpatch",
    coordinates: [-122.3871, 37.7823],
    founded: 2016,
    featuredTier: "core",
  },
  {
    slug: "baseten",
    name: "Baseten",
    website: "https://www.baseten.com",
    shortDescription: "Inference platform for shipping AI products fast with production-ready performance.",
    whyItMatters: "A strong infra name with builder credibility and a sharp product story.",
    category: "Infra",
    neighborhood: "SoMa",
    coordinates: [-122.4056, 37.7817],
    founded: 2019,
    featuredTier: "core",
  },
  {
    slug: "harvey",
    name: "Harvey",
    website: "https://www.harvey.ai",
    shortDescription: "Legal AI company building one of the clearest vertical AI success stories.",
    whyItMatters: "Shows how much of SF AI is about real workflows, not just foundation models.",
    category: "Vertical AI",
    neighborhood: "Jackson Square",
    coordinates: [-122.4011, 37.7964],
    founded: 2022,
    featuredTier: "hot",
  },
  {
    slug: "decagon",
    name: "Decagon",
    website: "https://decagon.ai",
    shortDescription: "AI agents for customer experience and support teams at enterprise scale.",
    whyItMatters: "A very current example of the AI agent wave turning into product reality.",
    category: "Agents",
    neighborhood: "SoMa",
    coordinates: [-122.4029, 37.7856],
    founded: 2023,
    featuredTier: "hot",
  },
  {
    slug: "langfuse",
    name: "Langfuse",
    website: "https://langfuse.com",
    shortDescription: "Open-source LLM engineering and observability platform for teams shipping AI features.",
    whyItMatters: "Represents the practical tooling layer behind modern AI apps.",
    category: "Devtools",
    neighborhood: "SoMa",
    coordinates: [-122.4002, 37.7847],
    founded: 2022,
    featuredTier: "hot",
  },
  {
    slug: "replit",
    name: "Replit",
    website: "https://replit.com",
    shortDescription: "Cloud coding environment leaning hard into AI-assisted software creation.",
    whyItMatters: "A familiar builder product that bridges mainstream and frontier developer audiences.",
    category: "Devtools",
    neighborhood: "North Beach",
    coordinates: [-122.4033, 37.7999],
    founded: 2016,
    featuredTier: "scene",
  },
  {
    slug: "notion",
    name: "Notion",
    website: "https://www.notion.so",
    shortDescription: "Workspace product with an AI layer that shapes how many people work every day.",
    whyItMatters: "Not a tiny startup, but too influential in SF AI product culture to ignore.",
    category: "Vertical AI",
    neighborhood: "Mission District",
    coordinates: [-122.4064, 37.7597],
    founded: 2013,
    featuredTier: "scene",
  },
  {
    slug: "11x",
    name: "11x",
    website: "https://11x.ai",
    shortDescription: "AI digital workers aimed at automating revenue and go-to-market operations.",
    whyItMatters: "One of the companies people point to when they talk about the agent economy.",
    category: "Agents",
    neighborhood: "SoMa",
    coordinates: [-122.4078, 37.784],
    founded: 2022,
    featuredTier: "hot",
  },
  {
    slug: "pika",
    name: "Pika",
    website: "https://pika.art",
    shortDescription: "Idea-to-video product making generative media feel playful and immediate.",
    whyItMatters: "A friendlier, creator-facing side of the SF AI scene.",
    category: "Consumer AI",
    neighborhood: "Mission District",
    coordinates: [-122.4191, 37.7593],
    founded: 2023,
    featuredTier: "hot",
  },
  {
    slug: "hedra",
    name: "Hedra",
    website: "https://www.hedra.com",
    shortDescription: "Generative media platform focused on expressive AI characters and video creation.",
    whyItMatters: "Captures the current energy around multimodal creative tools.",
    category: "Consumer AI",
    neighborhood: "Hayes Valley",
    coordinates: [-122.4244, 37.7767],
    founded: 2023,
    featuredTier: "hot",
  },
  {
    slug: "cartesia",
    name: "Cartesia",
    website: "https://cartesia.ai",
    shortDescription: "Real-time multimodal intelligence for on-device and voice-heavy experiences.",
    whyItMatters: "A strong signal that voice and low-latency AI are part of the SF stack.",
    category: "Infra",
    neighborhood: "SoMa",
    coordinates: [-122.4106, 37.7812],
    founded: 2023,
    featuredTier: "hot",
  },
  {
    slug: "adept",
    name: "Adept",
    website: "https://www.adept.ai",
    shortDescription: "Applied research company working on AI systems that take actions in software.",
    whyItMatters: "Still one of the clearest references for action-oriented AI assistants.",
    category: "Agents",
    neighborhood: "Presidio",
    coordinates: [-122.4564, 37.7972],
    founded: 2022,
    featuredTier: "scene",
  },
  {
    slug: "greptile",
    name: "Greptile",
    website: "https://www.greptile.com",
    shortDescription: "AI code reviewer built for teams that want a second set of machine eyes on PRs.",
    whyItMatters: "A very online developer-tool company with strong current-scene relevance.",
    category: "Devtools",
    neighborhood: "Civic Center",
    coordinates: [-122.4162, 37.7811],
    founded: 2023,
    featuredTier: "hot",
  },
  {
    slug: "anyscale",
    name: "Anyscale",
    website: "https://www.anyscale.com",
    shortDescription: "Ray-driven infrastructure company helping teams build and scale AI systems.",
    whyItMatters: "A key bridge between the research stack and practical model deployment.",
    category: "Infra",
    neighborhood: "Union Square",
    coordinates: [-122.4074, 37.7881],
    founded: 2019,
    featuredTier: "scene",
  },
  {
    slug: "unlearn",
    name: "Unlearn",
    website: "https://www.unlearn.ai",
    shortDescription: "AI for clinical trial design, simulation, and drug development workflows.",
    whyItMatters: "Represents the serious, domain-heavy side of SF AI innovation.",
    category: "Vertical AI",
    neighborhood: "Mission Bay",
    coordinates: [-122.3905, 37.7676],
    founded: 2017,
    featuredTier: "scene",
  },
  {
    slug: "sierra",
    name: "Sierra",
    website: "https://sierra.ai",
    shortDescription: "Conversational AI platform designed around customer-facing brand experiences.",
    whyItMatters: "A strong proof point that AI assistants are becoming a mainstream product layer.",
    category: "Agents",
    neighborhood: "South Beach",
    coordinates: [-122.3908, 37.7806],
    founded: 2023,
    featuredTier: "scene",
  },
]

const DISCOVERED_COMPANIES = YC_SF_SEARCH_COMPANIES.map(buildDiscoveredCompany)

export const COMPANIES: Company[] = [...CURATED_COMPANIES, ...DISCOVERED_COMPANIES]
