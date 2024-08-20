import { useEffect, useState } from 'react'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import CancelIcon from '@mui/icons-material/Cancel'

import PropTypes from 'prop-types'

import './css/styles.scss'

import { actions } from './constants'
import {
  deleteNode,
  generateHours,
  getRangeByIndex,
  paintHourRange,
  findRangeToEdit,
  generateHoursDB,
  findRangeToAdd,
} from './helpers'
import { SliderNode } from './SliderNode'

export const SliderMultiRangesHours = ({
  day,
  hoursDB,
  literalsButtons,
  literalsTypesResponse,
  onSetHoursDB,
  title,
  rangeMin = 2,
}) => {
  const [hours, setHours] = useState([])
  const [hoursBK, setHoursBK] = useState([])
  const [dataToEdit, setDataToEdit] = useState({
    start: '',
    startIndex: -1,
    end: '',
    endIndex: -1,
  })
  const [action, setAction] = useState(actions.none)
  const [previewRange, setPreviewRange] = useState({
    startIndex: -1,
    endIndex: -1,
  })
  const [editRange, setEditRange] = useState({
    left: null,
    right: null,
    selected: null,
  })

  useEffect(() => {
    const newHours = generateHours(hoursDB)

    setHours(newHours)
  }, [hoursDB])

  const onSelected = (node, index, action) => {
    if ([actions.add].includes(action) && !dataToEdit.start.length) {
      setHoursBK(hours)
      onAdd(node, index)
      return
    }

    if ([actions.add].includes(action) && dataToEdit.start.length) {
      onSaveAdd(node, index)
      return
    }

    if ([actions.none].includes(action) && !node.node) {
      onChangeTypeResponse(index)
      return
    }

    if ([actions.none].includes(action) && node.node) {
      onEdit(index)
      return
    }

    if ([actions.edit].includes(action)) {
      onSaveEdit(node, index)
      return
    }

    if (
      [actions.delete].includes(action) &&
      node.node &&
      index > 0 &&
      index + 1 < hours.length
    ) {
      onDelete(node, index)
      return
    }
  }

  const onAdd = (node, index) => {
    const editRangeAux = findRangeToAdd(index, hours, rangeMin)

    if (editRangeAux?.selected) {
      let updatedHours = [...hours]

      updatedHours[index] = {
        ...node,
        node: true,
      }

      const newDataToEdit = {
        start: node.hour,
        startIndex: index,
        end: '',
      }

      setDataToEdit(newDataToEdit)
      setEditRange(editRangeAux)
      setHours(updatedHours)
    }
  }

  const onSaveAdd = (node, index) => {
    const editRangeAux = findRangeToAdd(index, hours, rangeMin, editRange)

    if (editRangeAux?.selected) {
      let updatedHours = [...hours]

      updatedHours[index] = {
        ...node,
        node: true,
      }

      const newDataToEdit = {
        ...dataToEdit,
        end: node.hour,
      }

      updatedHours = onPaintHourRange(updatedHours, newDataToEdit)
      const hoursDBAux = generateHoursDB(updatedHours)

      onSetHoursDB(hoursDBAux, day)
      setDataToEdit({
        start: '',
        startIndex: -1,
        end: '',
        endIndex: -1,
      })
      setPreviewRange({
        startIndex: -1,
        endIndex: -1,
      })
      setAction(actions.none)
      setHours(updatedHours)
    }
  }

  const onChangeTypeResponse = (index) => {
    let updatedHours = [...hours]

    const rangeByIndex = getRangeByIndex(index, updatedHours)

    updatedHours = onPaintHourRange(updatedHours, {
      ...rangeByIndex,
    })

    const hoursDBAux = generateHoursDB(updatedHours)

    onSetHoursDB(hoursDBAux, day)
    setHours(updatedHours)
  }

  const onEdit = (index) => {
    if (index > 0 && index + 1 < hours.length) {
      const editRangeAux = findRangeToEdit(index, hours)

      setEditRange(editRangeAux)
      setAction(actions.edit)
    }
  }

  const onDelete = (node, index) => {
    let { start, end, tag, auxHours } = deleteNode(hours, node, index)

    const newDataToEdit = {
      startIndex: -1,
      start,
      end,
    }

    setDataToEdit(newDataToEdit)

    const newHours = paintHourRange(
      auxHours,
      newDataToEdit,
      action,
      tag
    )

    const hoursDBAux = generateHoursDB(newHours)

    onSetHoursDB(hoursDBAux, day)
    setHours(newHours)
    setAction(actions.none)
  }

  const onPaintHourRange = (auxHours, newDataToEdit) => {
    if (
      (dataToEdit.start.length && dataToEdit.end.length) ||
      !(dataToEdit.start.length && dataToEdit.end.length)
    ) {
      const newHours = paintHourRange(auxHours, newDataToEdit, action)

      return newHours
    }

    return auxHours
  }

  const onSaveEdit = (node, index) => {
    if (
      index <= editRange?.right?.index - rangeMin &&
      index >= editRange?.left?.index + rangeMin
    ) {
      const auxHours = [...hours]

      if (index !== editRange.selected.index) {
        auxHours[index].node = true
        auxHours[editRange.selected.index].node = false
      }

      const hoursDBAux = generateHoursDB(auxHours)

      onSetHoursDB(hoursDBAux, day)
      setHours(auxHours)
      setAction(actions.none)
    }
  }

  const onPreviewRange = (index) => {
    if ([actions.edit].includes(action)) {
      let start = null
      let startIndex = null
      let end = null
      let tag = null

      if (index > editRange?.right?.index - rangeMin) {
        start = editRange.selected.hour
        startIndex = editRange.selected.index
        end = hours[editRange?.right?.index - rangeMin].hour
        tag = editRange.left.tag
      } else if (index < editRange?.left?.index + rangeMin) {
        start = hours[editRange?.left?.index + rangeMin].hour
        startIndex = hours[editRange?.left?.index + rangeMin].index
        end = editRange.selected.hour
        tag = editRange.right.tag
      } else if (editRange.preview) {
        if (index > editRange.preview.index) {
          start = editRange.left.hour
          startIndex = editRange.left.index
          end = hours[index].hour
          tag = editRange.left.tag
        } else if (index < editRange.preview.index) {
          start = hours[index].hour
          startIndex = hours[index].index
          end = editRange.right.hour
          tag = editRange.right.tag
        }
      }

      const newDataToEdit = {
        start,
        startIndex,
        end,
      }

      const newHours = paintHourRange(
        hours,
        newDataToEdit,
        actions.edit,
        tag
      )

      setHours(newHours)

      setEditRange({
        ...editRange,
        preview: {
          hour: hours[index].hour,
          index,
          tag: hours[index].tag,
        },
      })
    } else if (
      [actions.add].includes(action) &&
      dataToEdit.start.length &&
      !dataToEdit.end.length
    ) {
      let startIndex = dataToEdit.startIndex
      let endIndex = index

      if (startIndex > endIndex) {
        startIndex = index
        endIndex = dataToEdit.startIndex
      }

      if (startIndex < editRange.left.index) startIndex = editRange.left.index
      if (endIndex > editRange.right.index) endIndex = editRange.right.index

      setPreviewRange({
        startIndex,
        endIndex,
      })
    }
  }

  const onEnableAdd = () => {
    setAction(actions.add)

    setDataToEdit({
      start: '',
      startIndex: -1,
      end: '',
    })
  }

  const onCancelAdd = () => {
    if ([actions.add].includes(action) && dataToEdit.start.length)
      setHours(hoursBK)

    setAction(actions.none)
  }

  const onEnableDelete = () => {
    if (hoursDB.length > 1)
      setAction(actions.delete)
  }

  const onCancelDelete = () => {
    setAction(actions.none)
  }

  return (
    <>
      <div className='slider-multi-ranges-hours'>
        <div className={`slider-multi-ranges-hours__container${[actions.add, actions.edit, actions.delete].includes(action) ? ' slider-multi-ranges-hours__container__shadow' : ''}`}>
          <div className='title'>{title}</div>
          <div className='slider'>
            {hours.map((node, index) => (
              <SliderNode
                key={node.hour}
                {...node}
                literalsTypesResponse={literalsTypesResponse}
                index={index}
                action={action}
                previewRange={previewRange}
                editRange={editRange}
                onSelected={onSelected}
                onPreviewRange={onPreviewRange}
                rangeMin={rangeMin}
                cantHour={hours.length}
              />
            ))}
          </div>

          <div className='buttons'>
            {
              action !== actions.add ? (
                <button
                  className={`button${[actions.add, actions.edit, actions.delete].includes(action) ? ' disable' : ''}`}
                  disabled={!hours.length || action !== actions.none}
                  onClick={onEnableAdd}
                >
                  <AddCircleOutlineIcon /> {literalsButtons.textButtonAdd}
                </button>
              ) : (
                <button
                  className="button"
                  onClick={onCancelAdd}
                >
                  <CancelIcon /> {literalsButtons.textButtonCancelAdd}
                </button>
              )
            }
            {
              action !== actions.delete ? (
                <button
                  className={`button${[actions.add, actions.edit, actions.delete].includes(action) || hoursDB.length < 2 ? ' disable' : ''}`}
                  onClick={onEnableDelete}
                  disabled={!hours.length || action !== actions.none}
                >
                  <DeleteIcon /> {literalsButtons.textButtonDelete}
                </button>
              ) : (
                <button
                  className="button"
                  onClick={onCancelDelete}
                >
                  <CancelIcon /> {literalsButtons.textButtonCancelDelete}
                </button>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

SliderMultiRangesHours.propTypes = {
  day: PropTypes.string.isRequired,
  hoursDB: PropTypes.array.isRequired,
  literalsButtons: PropTypes.object.isRequired,
  literalsTypesResponse: PropTypes.object.isRequired,
  onSetHoursDB: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  rangeMin: PropTypes.number.isRequired,
}
