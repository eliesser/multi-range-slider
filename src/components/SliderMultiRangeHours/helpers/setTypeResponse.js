import { actions, typesResponse } from '../constants';
import { getDateTimeByTimeHHMM, getNextSortType } from '../helpers';

export const setTypeResponse = (
  hours,
  newDataToEdit,
  action,
  typeResponse = null
) => {
  let dateRangeInit = getDateTimeByTimeHHMM(newDataToEdit.init);
  let dateRangeEnd = getDateTimeByTimeHHMM(newDataToEdit.end);

  if (dateRangeEnd < dateRangeInit) {
    dateRangeInit = getDateTimeByTimeHHMM(newDataToEdit.end);
    dateRangeEnd = getDateTimeByTimeHHMM(newDataToEdit.init);
  }

  return hours.map((node) => {
    const dateNode = getDateTimeByTimeHHMM(node.hour);
    if (dateNode >= dateRangeInit && dateNode < dateRangeEnd) {
      return {
        ...node,
        typeResponse: typeResponse
          ? typeResponse
          : action === actions.add
          ? typesResponse.typeOperatorAssistance
          : getNextSortType(node.typeResponse),
        node:
          node.hour === newDataToEdit.init
            ? true
            : action === actions.add &&
              dateNode > dateRangeInit &&
              dateNode < dateRangeEnd
            ? false
            : node.node,
      };
    } else
      return {
        ...node,
        node:
          action !== actions.delete && node.hour === newDataToEdit.end
            ? true
            : node.node,
      };
  });
};
