export const findEditRange = (indexSelected, hours) => {
  const left = findFirstNodeLeftByIndex(indexSelected, hours);
  const right = findFirstNodeRightByIndex(indexSelected, hours);

  return {
    left,
    right,
    selected: {
      hour: hours[indexSelected].hour,
      index: indexSelected,
      typeResponse: hours[indexSelected].typeResponse,
    },
  };
};

export const findFirstNodeLeftByIndex = (indexSelected, hours) => {
  if (indexSelected === 0) return null;

  for (let index = indexSelected - 1; index >= 0; index--) {
    if (hours[index].node) {
      return {
        hour: hours[index].hour,
        index,
        typeResponse: hours[index + 1].typeResponse,
      };
    }
  }
};

export const findFirstNodeRightByIndex = (indexSelected, hours) => {
  if (indexSelected + 1 === hours.length) return null;

  for (let index = indexSelected + 1; index < hours.length; index++) {
    if (hours[index].node) {
      return {
        hour: hours[index].hour,
        index,
        typeResponse: hours[index - 1].typeResponse,
      };
    }
  }
};
