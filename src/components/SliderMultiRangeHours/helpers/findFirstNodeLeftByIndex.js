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
