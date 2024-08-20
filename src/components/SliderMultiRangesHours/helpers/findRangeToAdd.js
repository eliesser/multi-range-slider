import {
  findFirstNodeLeftByIndex,
  findFirstNodeRightByIndex,
} from '../helpers'

export const findRangeToAdd = (
  indexSelected,
  hours,
  rangeMin,
  editRange = null
) => {
  let left = findFirstNodeLeftByIndex(indexSelected, hours)
  let selected = {
    hour: hours[indexSelected].hour,
    index: indexSelected,
    tag: hours[indexSelected].tag,
  }
  let right = findFirstNodeRightByIndex(indexSelected, hours)

  const minRange = left ? left.index + rangeMin : selected.index
  const maxRange = right ? right.index - rangeMin : selected.index

  if (selected.index < minRange || selected.index > maxRange) selected = null

  if (!selected) {
    left = null
    right = null
  }

  if (
    selected &&
    editRange &&
    (selected.index < editRange.left.index ||
      selected.index > editRange.right.index)
  )
    selected = null

  return {
    left,
    selected,
    right,
  }
}
