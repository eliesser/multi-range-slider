import {
  findFirstNodeLeftByIndex,
  findFirstNodeRightByIndex,
} from '../helpers';

export const findRangeToAdd = (
  indexSelected,
  hours,
  rangeMin,
  editRange = null
) => {
  let left = findFirstNodeLeftByIndex(indexSelected, hours);
  let selected = {
    hour: hours[indexSelected].hour,
    index: indexSelected,
    typeResponse: hours[indexSelected].typeResponse,
  };
  let right = findFirstNodeRightByIndex(indexSelected, hours);

  const minRange = left.index + rangeMin;
  const maxRange = right.index - rangeMin;

  if (selected.index < minRange || selected.index > maxRange) selected = null;

  if (!selected) {
    left = null;
    right = null;
  }

  if (
    selected &&
    editRange &&
    (selected.index < editRange.left.index ||
      selected.index > editRange.right.index)
  )
    selected = null;

  return {
    left,
    selected,
    right,
  };
};
