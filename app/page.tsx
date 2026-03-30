import { companyFromRow } from "@/lib/company"
import { createAdminClient } from "@/lib/supabase/admin"
import { SfAiMap } from "@/components/sf-ai-map"

export default async function Page() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("companies")
    .select(
      "slug, name, website, short_description, category, location_label, city, latitude, longitude, founded, logo_url, map_sprite, source_url"
    )
    .match({ city: "sf" })
    .order("name")

  if (error) throw new Error(`Failed to load companies: ${error.message}`)

  return <SfAiMap companies={(data ?? []).map(companyFromRow)} />
}
