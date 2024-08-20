export const generateHoursDB = (hours) => {
  let hoursDB = []

  let start = hours[0]
  let end = null
  let tag = null

  for (let index = 1; index < hours.length; index++) {
    const hour = hours[index]
    if (hour.node) {
      end = hour

      tag = hours[index - 1].tag

      hoursDB.push({ start: start.hour, end: end.hour, tag })

      start = hour
    }
  }

  return hoursDB
}
