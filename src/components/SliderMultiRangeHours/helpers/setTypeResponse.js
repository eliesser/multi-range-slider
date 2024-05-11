import { actions, typesResponse } from '../constants';
import { getDateTimeByTimeHHMM, getNextSortType } from '../helpers';

export const setTypeResponse = (
  hours,
  newDataToEdit,
  action,
  typeResponse = null
) => {
  let dateRangeStart = getDateTimeByTimeHHMM(newDataToEdit.start);
  let dateRangeEnd = getDateTimeByTimeHHMM(newDataToEdit.end);

  if (dateRangeEnd < dateRangeStart) {
    dateRangeStart = getDateTimeByTimeHHMM(newDataToEdit.end);
    dateRangeEnd = getDateTimeByTimeHHMM(newDataToEdit.start);
  }

  const auxHours = hours.map((node) => {
    const dateNode = getDateTimeByTimeHHMM(node.hour);
    if (dateNode >= dateRangeStart && dateNode < dateRangeEnd) {
      return {
        ...node,
        typeResponse: typeResponse
          ? typeResponse
          : action === actions.add
          ? typesResponse.typeOperatorAssistance
          : getNextSortType(node.typeResponse),
        node:
          action !== actions.delete && node.hour === newDataToEdit.start
            ? true
            : action === actions.add &&
              dateNode > dateRangeStart &&
              dateNode < dateRangeEnd
            ? false
            : node.node,
      };
    } else {
      return {
        ...node,
        node:
          action !== actions.delete && node.hour === newDataToEdit.end
            ? true
            : node.node,
      };
    }
  });

  return [...auxHours];
};
