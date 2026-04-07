import { companyFromRow } from "@/lib/company"
import { filterAndSortUpcomingMeetups, meetupFromRow } from "@/lib/meetup"
import type { CityId } from "@/lib/city-config"
import { createAdminClient } from "@/lib/supabase/admin"

export async function loadCityMapPageData(city: CityId) {
  const supabase = createAdminClient()

  const [companiesResult, meetupsResult] = await Promise.all([
    supabase
      .from("companies")
      .select(
        "slug, name, website, short_description, category, location_label, city, latitude, longitude, founded, logo_url, map_sprite, source_url"
      )
      .match({ city })
      .order("name"),
    supabase
      .from("meetups")
      .select(
        "slug, city, title, description, venue_name, location_label, latitude, longitude, starts_at, ends_at, organizer_name, event_url, contact_email, status"
      )
      .match({ city, status: "published" })
      .order("starts_at", { ascending: true })
      .order("title", { ascending: true }),
  ])

  if (companiesResult.error) {
    throw new Error(`Failed to load companies: ${companiesResult.error.message}`)
  }

  const companies = (companiesResult.data ?? []).map(companyFromRow)

  let meetupsRaw = meetupsResult.data ?? []
  if (meetupsResult.error) {
    const msg = meetupsResult.error.message
    const missingTable =
      msg.includes("meetups") &&
      (msg.includes("schema cache") || msg.includes("does not exist"))
    if (!missingTable) {
      throw new Error(`Failed to load meetups: ${msg}`)
    }
    meetupsRaw = []
  }

  const meetups = filterAndSortUpcomingMeetups(meetupsRaw.map(meetupFromRow))

  return { companies, meetups }
}
