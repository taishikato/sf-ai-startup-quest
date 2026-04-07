import { formatInTimeZone, toDate } from "date-fns-tz"

/** Interprets `datetime-local` style string as wall time in `timeZone`, returns UTC ISO. */
export function meetupLocalInputToUtcIso(
  dateTimeLocal: string,
  timeZone: string
): string {
  const normalized =
    dateTimeLocal.length === 16 ? `${dateTimeLocal}:00` : dateTimeLocal
  const d = toDate(normalized, { timeZone })
  if (Number.isNaN(d.getTime())) {
    throw new Error("Invalid date/time")
  }
  return d.toISOString()
}

export function formatMeetupStartInTimezone(
  startsAtIso: string,
  timeZone: string
) {
  return formatInTimeZone(
    new Date(startsAtIso),
    timeZone,
    "EEE, MMM d, yyyy · h:mm a"
  )
}

export function formatMeetupRangeInTimezone(
  startsAtIso: string,
  endsAtIso: string | null,
  timeZone: string
) {
  const start = formatMeetupStartInTimezone(startsAtIso, timeZone)
  if (!endsAtIso) {
    return start
  }
  const end = formatInTimeZone(
    new Date(endsAtIso),
    timeZone,
    "h:mm a"
  )
  return `${start} – ${end}`
}
