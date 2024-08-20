import { daysOfWeek } from '../helpers'

export const buildRangeHoursByDaysOfWeek = (hours, typesResp) => {
  for (const key in typesResp.schedule) {
    if (Object.hasOwnProperty.call(typesResp.schedule, key)) {
      const day = typesResp.schedule[key]
      if (daysOfWeek.includes(key)) {
        const ranges = day.ranges.map((range) => {
          return {
            ...range,
            tag: typesResp.tag
          }
        })

        if (Object.hasOwnProperty.call(hours, key)) {
          hours[key] = [...hours[key], ...ranges]
        } else {
          hours[key] = [...ranges]
        }
      }
    }
  }
}