import { fromZonedTime, toZonedTime } from "date-fns-tz";

export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

// Get all IANA timezones with their offsets
export function getTimezones(): TimezoneOption[] {
  const date = new Date();

  return Intl.supportedValuesOf("timeZone")
    .map((timezone) => {
      const timeZoneDate = toZonedTime(date, timezone);
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "longOffset",
        hour12: false,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });

      const parts = formatter.formatToParts(timeZoneDate);
      const timeZonePart = parts.find((part) => part.type === "timeZoneName");
      const offset = timeZonePart?.value || "";

      // Format: "America/New_York (UTC-04:00)"
      const label = `${timezone.replace("_", " ")} (${offset})`;

      return {
        value: timezone,
        label,
        offset,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

// Convert a date to UTC based on timezone
export function convertToUTC(date: Date, timezone: string): Date {
  return fromZonedTime(date, timezone);
}

// Convert UTC to local timezone
export function convertFromUTC(date: Date, timezone: string): Date {
  return toZonedTime(date, timezone);
}

// Get user's local timezone
export function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
