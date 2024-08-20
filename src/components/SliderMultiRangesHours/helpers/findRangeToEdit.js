import {
  findFirstNodeLeftByIndex,
  findFirstNodeRightByIndex,
} from '../helpers'

export const findRangeToEdit = (indexSelected, hours) => {
  const left = findFirstNodeLeftByIndex(indexSelected, hours)
  const right = findFirstNodeRightByIndex(indexSelected, hours)

  return {
    left,
    right,
    selected: {
      hour: hours[indexSelected].hour,
      index: indexSelected,
      tag: hours[indexSelected].tag,
    },
  }
}
