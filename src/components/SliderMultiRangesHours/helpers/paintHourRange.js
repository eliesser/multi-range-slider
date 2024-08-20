import { actions, tags } from '../constants'
import { getDateTimeByTimeHHMM, getNextTypeResponse } from '.'

export const paintHourRange = (
  hours,
  newDataToEdit,
  action,
  tag = null
) => {
  let dateRangeStart = getDateTimeByTimeHHMM(newDataToEdit.start)
  let dateRangeEnd = getDateTimeByTimeHHMM(newDataToEdit.end)

  if (dateRangeEnd < dateRangeStart) {
    dateRangeStart = getDateTimeByTimeHHMM(newDataToEdit.end)
    dateRangeEnd = getDateTimeByTimeHHMM(newDataToEdit.start)
  }

  const auxHours = hours.map((node) => {
    const dateNode = getDateTimeByTimeHHMM(node.hour)
    if (dateNode >= dateRangeStart && dateNode < dateRangeEnd) {
      return {
        ...node,
        tag: tag
          ? tag
          : action === actions.add
            ? tags.operatorAssistance
            : getNextTypeResponse(node.tag),
        node:
          ![actions.edit, actions.delete].includes(action) &&
          node.hour === newDataToEdit.start
            ? true
            : action === actions.add &&
              dateNode > dateRangeStart &&
              dateNode < dateRangeEnd
              ? false
              : node.node,
      }
    } else {
      return {
        ...node,
        node:
          ![actions.edit, actions.delete].includes(action) &&
          node.hour === newDataToEdit.end
            ? true
            : node.node,
      }
    }
  })

  return [...auxHours]
}
