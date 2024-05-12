import { typesResponse } from '../constants';

export const deleteNode = (hours, node, index) => {
  let typeResponse = typesResponse.typeDisable;
  let nodeStart;

  if (index > 0 && index < hours.length) {
    for (let i = index - 1; i >= 0; i--) {
      if (hours[i].node) {
        nodeStart = hours[i];
        break;
      }

      if (i == 0) {
        typeResponse = typesResponse.typeDisable;
        nodeStart = hours[i];
      } else {
        if (index + 1 === hours.length) {
          typeResponse = typesResponse.typeDisable;
        } else {
          typeResponse = hours[index + 1].typeResponse;
        }
      }
    }
  } else {
    typeResponse = typesResponse.typeDisable;
    for (let i = 1; i < hours.length; i++) {
      if (hours[i].node) {
        nodeStart = hours[i];
        break;
      }
    }
  }

  let auxHours = [...hours];

  auxHours[index] = {
    ...node,
    node: false,
  };

  const count = auxHours.filter((n) => n.node).length;

  if (count === 3) {
    typeResponse = typesResponse.typeDisable;
    auxHours = auxHours.map((n, index) =>
      index === 0 || index + 1 === auxHours.length
        ? { ...n }
        : { ...n, node: false, typeResponse }
    );
  }

  return {
    start: nodeStart.hour,
    end: node.hour,
    typeResponse,
    auxHours,
  };
};
