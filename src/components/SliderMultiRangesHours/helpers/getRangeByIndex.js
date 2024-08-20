export const getRangeByIndex = (index, hours) => {
  let nodeStart = hours[0]
  let nodeEnd = hours[hours.length - 1]

  for (let i = index - 1; i > 0; i--) {
    if (hours[i].node) {
      nodeStart = hours[i]
      break
    }
  }

  for (let i = index + 1; i < hours.length; i++) {
    if (hours[i].node) {
      nodeEnd = hours[i]
      break
    }
  }

  return {
    start: nodeStart.hour,
    end: nodeEnd.hour,
  }
}
