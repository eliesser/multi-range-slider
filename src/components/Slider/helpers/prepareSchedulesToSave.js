import { daysOfWeek } from '../helpers'

export const prepareSchedulesToSave = (rangeHoursByDaysOfWeekAux, schedules) => {
  const schedulesAux = { ...schedules }

  Object.keys(schedulesAux).forEach(key => {
    const schedule = schedulesAux[key].schedule
    Object.keys(schedule).forEach(day => {
      if (daysOfWeek.includes(day))
        schedule[day].ranges = []
    })
  })

  Object.keys(rangeHoursByDaysOfWeekAux).forEach(day => {
    rangeHoursByDaysOfWeekAux[day].forEach(range => {
      Object.keys(schedulesAux).forEach(key => {
        if (schedulesAux[key].tag === range.tag) {
          schedulesAux[key].schedule[day].ranges.push({
            start: range.start,
            end: range.end
          })
          schedulesAux[key].schedule[day].isActive = true
        }
      })
    })
  })

  return schedulesAux
}