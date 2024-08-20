export const findFirstNodeRightByIndex = (indexSelected, hours) => {
  if (indexSelected + 1 === hours.length) return null

  for (let index = indexSelected + 1; index < hours.length; index++) {
    if (hours[index].node) {
      return {
        hour: hours[index].hour,
        index,
        tag: hours[index - 1].tag,
      }
    }
  }
}
