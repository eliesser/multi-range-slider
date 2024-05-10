import { typesResponse } from '../constants';

export const findEditRange = (node, indexAux, hours) => {
  let initHour;
  let initIndex;
  let initTypeResponse = typesResponse.typeDisable;

  let endHour;
  let endIndex;
  let endTypeResponse;

  for (let i = indexAux - 1; i >= 0; i--) {
    if (hours[i].node) {
      initHour = hours[i].hour;
      initIndex = i;
      initTypeResponse = hours[i + 1].typeResponse;
      break;
    } else {
      if (i == 0) {
        initTypeResponse = typesResponse.typeDisable;
        initHour = hours[i].hour;
      } else {
        if (indexAux + 1 === hours.length) {
          initTypeResponse = typesResponse.typeDisable;
        } else {
          initTypeResponse = hours[indexAux + 1].typeResponse;
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
    init: {
      hour: initHour,
      index: initIndex,
      typeResponse: initTypeResponse,
    },
    end: {
      hour: endHour,
      index: endIndex,
      typeResponse: endTypeResponse,
    },
  };
};
