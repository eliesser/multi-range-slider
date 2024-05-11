import { typesResponse } from '../constants';

export const findEditRange = (node, indexAux, hours) => {
  let startHour;
  let startIndex;
  let startTypeResponse = typesResponse.typeDisable;

  let endHour;
  let endIndex;
  let endTypeResponse;

  for (let i = indexAux - 1; i >= 0; i--) {
    if (hours[i].node) {
      startHour = hours[i].hour;
      startIndex = i;
      startTypeResponse = hours[i + 1].typeResponse;
      break;
    } else {
      if (i == 0) {
        startTypeResponse = typesResponse.typeDisable;
        startHour = hours[i].hour;
      } else {
        if (indexAux + 1 === hours.length) {
          startTypeResponse = typesResponse.typeDisable;
        } else {
          startTypeResponse = hours[indexAux + 1].typeResponse;
        }
      }
    }
  }

  for (let i = indexAux + 1; i < hours.length; i++) {
    if (hours[i].node) {
      endHour = hours[i].hour;
      endIndex = i;
      endTypeResponse = hours[i].typeResponse;
      break;
    } else {
      if (i + 1 === hours.length) {
        endHour = hours[i].hour;
        endIndex = i;
        endTypeResponse = typesResponse.typeDisable;
      }
    }
  }

  return {
    start: {
      hour: startHour,
      index: startIndex,
      typeResponse: startTypeResponse,
    },
    end: {
      hour: endHour,
      index: endIndex,
      typeResponse: endTypeResponse,
    },
  };
};
